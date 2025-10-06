
import React, { useState, useMemo, useCallback } from 'react';
import { Tender, FilterState, SummaryData, SortKey, SortDirection, SavedSearch } from '../types';
import FilterBar from './FilterBar';
import SummaryBar from './SummaryBar';
import TenderList from './TenderList';
import TenderDetail from './TenderDetail';
import PaginationControls from './PaginationControls';
import SortBar from './SortBar';
import SaveSearchModal from './SaveSearchModal';
import { ChevronUpIcon, ChevronDownIcon } from './Icons';

interface TenderSearchPageProps {
    allTenders: Tender[];
    savedTenderIds: number[];
    onSaveTender: (id: number) => void;
    savedSearches: SavedSearch[];
    setSavedSearches: React.Dispatch<React.SetStateAction<SavedSearch[]>>;
    pageState: any; 
    setPageState: React.Dispatch<React.SetStateAction<any>>;
}

const TenderSearchPage: React.FC<TenderSearchPageProps> = ({
    allTenders,
    savedTenderIds,
    onSaveTender,
    savedSearches,
    setSavedSearches,
    pageState,
    setPageState,
}) => {
    const [isFilterUIVisible, setIsFilterUIVisible] = useState<boolean>(true);
    const [isSaveSearchModalVisible, setIsSaveSearchModalVisible] = useState<boolean>(false);
    
    const { selectedTenderId, filters, activeFilters, sortConfig, currentPage, itemsPerPage } = pageState;

    const setFilters = (newFilters: Partial<FilterState>) => setPageState(p => ({...p, filters: {...p.filters, ...newFilters}}));
    const setActiveFilters = (newFilters: FilterState) => setPageState(p => ({...p, activeFilters: newFilters}));
    const setSortConfig = (config) => setPageState(p => ({...p, sortConfig: config}));
    const setCurrentPage = (page: number) => setPageState(p => ({...p, currentPage: page}));
    const setItemsPerPage = (items: number) => setPageState(p => ({...p, itemsPerPage: items, currentPage: 1}));
    const setSelectedTenderId = (id: number | null) => setPageState(p => ({...p, selectedTenderId: id}));


    const handleSearch = useCallback(() => {
        setActiveFilters(filters);
        setCurrentPage(1);
    }, [filters]);

    const handleSortChange = (key: SortKey, direction: SortDirection) => {
        setSortConfig({ key, direction });
    };

    const handleOpenSaveSearchModal = () => setIsSaveSearchModalVisible(true);
    const handleCloseSaveSearchModal = () => setIsSaveSearchModalVisible(false);

    const handleSaveSearch = (name: string) => {
        const newSearch: SavedSearch = {
          id: Date.now().toString(),
          name,
          filters: activeFilters, // Save the filters that are actually applied
          notificationSettings: { enabled: false, frequency: 'weekly', includeTips: true },
        };
        setSavedSearches(prev => [...prev, newSearch]);
        handleCloseSaveSearchModal();
    };
    
    const processedTenders = useMemo(() => {
        const filtered = allTenders.filter(tender => {
            if (activeFilters.keyword && !tender.title.toLowerCase().includes(activeFilters.keyword.toLowerCase()) && !tender.summary.toLowerCase().includes(activeFilters.keyword.toLowerCase())) return false;
            if (activeFilters.fundingType !== 'all' && tender.fundingType !== activeFilters.fundingType) return false;
            if (activeFilters.category !== 'all' && tender.category !== activeFilters.category) return false;
            if (activeFilters.institution !== 'all' && tender.institution !== activeFilters.institution) return false;
            if (activeFilters.eligibleEntity !== 'all' && !tender.eligibleEntities.includes(activeFilters.eligibleEntity)) return false;
            if (activeFilters.deadlineStart && new Date(tender.deadline) < new Date(activeFilters.deadlineStart)) return false;
            if (activeFilters.deadlineEnd && new Date(tender.deadline) > new Date(activeFilters.deadlineEnd)) return false;
            return true;
        });

        return [...filtered].sort((a, b) => {
            const { key, direction } = sortConfig;
            const aValue = key === 'deadline' ? new Date(a.deadline).getTime() : a.fundingMax;
            const bValue = key === 'deadline' ? new Date(b.deadline).getTime() : b.fundingMax;
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [allTenders, activeFilters, sortConfig]);

    const paginatedTenders = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return processedTenders.slice(startIndex, startIndex + itemsPerPage);
    }, [processedTenders, currentPage, itemsPerPage]);
    
    const totalPages = Math.ceil(processedTenders.length / itemsPerPage);

    const summaryData = useMemo<SummaryData>(() => {
        if (processedTenders.length === 0) return { count: 0, totalMin: 0, totalMax: 0, earliestDeadline: null, latestDeadline: null };
        const deadlines = processedTenders.map(t => new Date(t.deadline).getTime()).filter(d => !isNaN(d));
        if (deadlines.length === 0) return { count: processedTenders.length, totalMin: processedTenders.reduce((s, t) => s + t.fundingMin, 0), totalMax: processedTenders.reduce((s, t) => s + t.fundingMax, 0), earliestDeadline: null, latestDeadline: null };
        return {
            count: processedTenders.length,
            totalMin: processedTenders.reduce((s, t) => s + t.fundingMin, 0),
            totalMax: processedTenders.reduce((s, t) => s + t.fundingMax, 0),
            earliestDeadline: new Date(Math.min(...deadlines)).toISOString().split('T')[0],
            latestDeadline: new Date(Math.max(...deadlines)).toISOString().split('T')[0],
        };
    }, [processedTenders]);

    const selectedTender = useMemo(() => allTenders.find(t => t.id === selectedTenderId) || null, [selectedTenderId, allTenders]);
    const institutions = useMemo(() => ['all', ...[...new Set(allTenders.map(t => t.institution).filter(Boolean))].sort()], [allTenders]);
    const eligibleEntities = useMemo(() => ['all', ...[...new Set(allTenders.flatMap(t => t.eligibleEntities).filter(Boolean))].sort()], [allTenders]);

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700 transition-all duration-500">
                <div className="flex justify-between items-center px-4 sm:px-6 py-3">
                    <h2 className="text-xl md:text-2xl font-heading font-bold text-gray-800 dark:text-gray-100">Iskanje razpisov</h2>
                    <button onClick={() => setIsFilterUIVisible(!isFilterUIVisible)} className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        {isFilterUIVisible ? 'Skrij filtre' : 'Pokaži filtre'}
                        {isFilterUIVisible ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                    </button>
                </div>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isFilterUIVisible ? 'max-h-[2000px]' : 'max-h-0'}`}>
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <FilterBar 
                            filters={filters} 
                            onFilterChange={setFilters} 
                            onSearch={handleSearch} 
                            institutions={institutions} 
                            eligibleEntities={eligibleEntities}
                            onNavigateToAiChat={() => {}} // This should be handled by Sidebar now
                            onSaveSearchClick={handleOpenSaveSearchModal}
                        />
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                        <h3 className="text-lg font-heading font-semibold text-gray-700 dark:text-gray-300 mb-3">Povzetek rezultatov</h3>
                        <SummaryBar data={summaryData} />
                    </div>
                </div>
                {processedTenders.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                        <SortBar sortConfig={sortConfig} onSortChange={handleSortChange} />
                    </div>
                )}
            </div>

            <div className="mt-8">
                <div className="lg:flex lg:gap-8">
                    <div className={`w-full transition-all duration-300 ${selectedTender ? 'hidden lg:block lg:w-1/3' : 'lg:w-full'}`}>
                        <TenderList tenders={paginatedTenders} onSelectTender={setSelectedTenderId} selectedTenderId={selectedTenderId} onSaveTender={onSaveTender} savedTenderIds={savedTenderIds}/>
                        {processedTenders.length > 0 && (
                            <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} itemsPerPage={itemsPerPage} onItemsPerPageChange={setItemsPerPage} />
                        )}
                    </div>
                    <div className={`w-full lg:sticky lg:top-8 transition-all duration-300 lg:max-h-[calc(100vh-4rem)] ${selectedTender ? 'lg:w-2/3' : 'lg:w-0'}`}>
                        {selectedTender && (
                            <TenderDetail tender={selectedTender} onClose={() => setSelectedTenderId(null)} onSave={onSaveTender} isSaved={savedTenderIds.includes(selectedTender.id)} />
                        )}
                    </div>
                </div>
            </div>
            
            {isSaveSearchModalVisible && (
                <SaveSearchModal
                    onSave={handleSaveSearch}
                    onClose={handleCloseSaveSearchModal}
                />
            )}
        </>
    );
};

export default TenderSearchPage;
