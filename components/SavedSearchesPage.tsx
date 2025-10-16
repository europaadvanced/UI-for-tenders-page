
import React, { useState, useMemo } from 'react';
import { SavedSearch, FilterState, Tender, Category, FundingType } from '../types';
import { TrashIcon, PencilIcon, ExternalLinkIcon, CogIcon, SaveIcon, CloseIcon } from './Icons';
import NotificationSettingsModal from './NotificationSettingsModal';
import ConfirmationModal from './ConfirmationModal';

// --- Edit Search Modal Component (defined in the same file) ---

const fundingTypes: (FundingType | 'all')[] = ['all', 'Nepovratna sredstva', 'Subvencija', 'So-investicija', 'Vračljiva pomoč', 'Subvencioniran kredit'];
const categories: (Category | 'all')[] = ['all', 'Tehnologija in inovacije', 'Zeleni prehod', 'Kmetijstvo', 'Turizem', 'Digitalizacija', 'Socialno podjetništvo'];

interface EditSearchModalProps {
    search: SavedSearch;
    onClose: () => void;
    onSave: (updatedSearch: SavedSearch) => void;
    institutions: string[];
    eligibleEntities: string[];
}

const EditSearchModal: React.FC<EditSearchModalProps> = ({ search, onClose, onSave, institutions, eligibleEntities }) => {
    const [editedSearch, setEditedSearch] = useState<SavedSearch>(search);

    const handleFilterChange = (updates: Partial<FilterState>) => {
        setEditedSearch(prev => ({
            ...prev,
            filters: { ...prev.filters, ...updates }
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        handleFilterChange({ [e.target.name]: e.target.value });
    };
    
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedSearch(prev => ({...prev, name: e.target.value}));
    }

    const handleSave = () => {
        onSave(editedSearch);
    };

    const filters = editedSearch.filters;

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 animate-fade-in overflow-y-auto">
            <div className="rounded-lg shadow-xl w-full max-w-2xl my-8 ui-element-depth">
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-heading font-bold text-gray-800 dark:text-gray-100">Uredi shranjeno iskanje</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Zapri modal"><CloseIcon /></button>
                </div>
                <div className="p-6 space-y-6">
                     <div>
                        <label htmlFor="searchName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ime iskanja</label>
                        <input id="searchName" type="text" value={editedSearch.name} onChange={handleNameChange} className="w-full h-[42px] text-base px-4 rounded input-depth text-gray-900 dark:text-gray-100" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ključna beseda</label>
                            <input type="text" name="keyword" id="keyword" value={filters.keyword} onChange={handleInputChange} className="w-full h-[42px] text-base px-4 rounded input-depth text-gray-900 dark:text-gray-100" />
                        </div>
                        <div>
                            <label htmlFor="fundingType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tip financiranja</label>
                            <select name="fundingType" id="fundingType" value={filters.fundingType} onChange={handleInputChange} className="w-full h-[42px] text-base pr-4 rounded input-depth text-gray-900 dark:text-gray-100">
                                {fundingTypes.map(type => <option key={type} value={type}>{type === 'all' ? 'Vse vrste' : type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategorija</label>
                            <select name="category" id="category" value={filters.category} onChange={handleInputChange} className="w-full h-[42px] text-base pr-4 rounded input-depth text-gray-900 dark:text-gray-100">
                                {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'Vse kategorije' : cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institucija</label>
                            <select name="institution" id="institution" value={filters.institution} onChange={handleInputChange} className="w-full h-[42px] text-base pr-4 rounded input-depth text-gray-900 dark:text-gray-100">
                                {institutions.map(inst => <option key={inst} value={inst}>{inst === 'all' ? 'Vse institucije' : inst}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="eligibleEntity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upravičeni prijavitelj</label>
                            <select name="eligibleEntity" id="eligibleEntity" value={filters.eligibleEntity} onChange={handleInputChange} className="w-full h-[42px] text-base pr-4 rounded input-depth text-gray-900 dark:text-gray-100">
                                {eligibleEntities.map(entity => <option key={entity} value={entity}>{entity === 'all' ? 'Vsi tipi' : entity}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rok prijave</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="date" name="deadlineStart" value={filters.deadlineStart} onChange={handleInputChange} className="w-full h-[42px] text-base px-2 rounded input-depth text-gray-900 dark:text-gray-100" />
                                <input type="date" name="deadlineEnd" value={filters.deadlineEnd} onChange={handleInputChange} className="w-full h-[42px] text-base px-2 rounded input-depth text-gray-900 dark:text-gray-100" />
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="flex justify-end items-center p-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg space-x-3">
                    <button onClick={onClose} className="h-[42px] px-4 py-2 rounded btn-secondary font-semibold">Prekliči</button>
                    <button onClick={handleSave} className="h-[42px] text-white font-bold px-6 py-2 rounded flex items-center gap-2 btn-primary"><SaveIcon /> Shrani spremembe</button>
                </div>
            </div>
        </div>
    );
};


// --- Main Saved Searches Page Component ---

interface SavedSearchesPageProps {
    allTenders: Tender[];
    savedSearches: SavedSearch[];
    setSavedSearches: React.Dispatch<React.SetStateAction<SavedSearch[]>>;
}

const FilterSummary: React.FC<{ filters: FilterState }> = ({ filters }) => {
    const items: string[] = [];
    if (filters.keyword) items.push(`"${filters.keyword}"`);
    if (filters.fundingType !== 'all') items.push(filters.fundingType);
    if (filters.category !== 'all') items.push(filters.category);
    if (filters.institution !== 'all') items.push(filters.institution);
    if (filters.eligibleEntity !== 'all') items.push(filters.eligibleEntity);
    if (filters.deadlineStart || filters.deadlineEnd) {
        const start = filters.deadlineStart ? new Date(filters.deadlineStart).toLocaleDateString('sl-SI') : '...';
        const end = filters.deadlineEnd ? new Date(filters.deadlineEnd).toLocaleDateString('sl-SI') : '...';
        items.push(`Rok: ${start} - ${end}`);
    }

    if (items.length === 0) {
        return <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-2">Brez posebnih filtrov.</p>;
    }

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {items.map((item, index) => (
                <span key={index} className="text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-md">{item}</span>
            ))}
        </div>
    );
};

const SavedSearchesPage: React.FC<SavedSearchesPageProps> = ({ allTenders, savedSearches, setSavedSearches }) => {
    const [editingSearchId, setEditingSearchId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [notificationModalSearch, setNotificationModalSearch] = useState<SavedSearch | null>(null);
    const [editModalSearch, setEditModalSearch] = useState<SavedSearch | null>(null);
    const [searchToDeleteId, setSearchToDeleteId] = useState<string | null>(null);


    const institutions = useMemo(() => ['all', ...[...new Set(allTenders.map(t => t.institution).filter(Boolean))].sort()], [allTenders]);
    const eligibleEntities = useMemo(() => ['all', ...[...new Set(allTenders.flatMap(t => t.eligibleEntities).filter(Boolean))].sort()], [allTenders]);

    const handleDeleteRequest = (id: string) => {
        setSearchToDeleteId(id);
    };

    const handleConfirmDelete = () => {
        if (searchToDeleteId) {
            setSavedSearches(prev => prev.filter(s => s.id !== searchToDeleteId));
        }
        setSearchToDeleteId(null);
    };

    const handleCancelDelete = () => {
        setSearchToDeleteId(null);
    };
    
    const handleEditStart = (search: SavedSearch) => {
        setEditingSearchId(search.id);
        setEditingName(search.name);
    };
    
    const handleNameSave = (id: string) => {
        setSavedSearches(prev => prev.map(s => s.id === id ? { ...s, name: editingName } : s));
        setEditingSearchId(null);
        setEditingName('');
    };
    
    const handleGoToSearch = (search: SavedSearch) => {
        const url = new URL(window.location.href);
        url.searchParams.set('searchId', search.id);
        window.open(url.toString(), '_blank');
    };

    const handleUpdateNotifications = (searchId: string, newSettings) => {
        setSavedSearches(prev => prev.map(s => s.id === searchId ? { ...s, notificationSettings: newSettings } : s));
        setNotificationModalSearch(null);
    }
    
    const handleSaveEditedSearch = (updatedSearch: SavedSearch) => {
        setSavedSearches(prev => prev.map(s => s.id === updatedSearch.id ? updatedSearch : s));
        setEditModalSearch(null);
    }

    return (
        <>
            <div className="ui-element-depth rounded-md">
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 dark:text-gray-100">Shranjena iskanja ({savedSearches.length})</h2>
                    <p className="mt-1 text-base text-gray-600 dark:text-gray-400">Upravljajte s shranjenimi filtri in nastavite obvestila za nove priložnosti.</p>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                    {savedSearches.length > 0 ? (
                        savedSearches.map(search => (
                            <div key={search.id} className="p-4 rounded-lg ui-element-depth">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                                    <div className="flex-grow">
                                        {editingSearchId === search.id ? (
                                            <input 
                                                type="text"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                onBlur={() => handleNameSave(search.id)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleNameSave(search.id)}
                                                className="w-full sm:w-auto text-lg font-semibold rounded px-2 py-1 input-depth"
                                                autoFocus
                                            />
                                        ) : (
                                            <h3 className="text-lg font-heading font-semibold text-gray-800 dark:text-gray-200">{search.name}</h3>
                                        )}
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Obvestila: <span className={`font-semibold ${search.notificationSettings.enabled ? 'text-green-600' : 'text-red-600'}`}>{search.notificationSettings.enabled ? `Vklopljena (${search.notificationSettings.frequency === 'weekly' ? 'tedensko' : 'mesečno'})` : 'Izklopljena'}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button onClick={() => setNotificationModalSearch(search)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" title="Nastavitve obvestil"><CogIcon /></button>
                                        <button onClick={() => handleEditStart(search)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" title="Uredi ime"><PencilIcon /></button>
                                        <button onClick={() => handleGoToSearch(search)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" title="Odpri v novem zavihku"><ExternalLinkIcon /></button>
                                        <button onClick={() => handleDeleteRequest(search.id)} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" title="Izbriši"><TrashIcon /></button>
                                    </div>
                                </div>
                                <div>
                                    <FilterSummary filters={search.filters} />
                                </div>
                                 <div className="mt-3 text-right">
                                    <button onClick={() => setEditModalSearch(search)} className="text-sm font-bold text-brand hover:text-brand-dark transition-colors">Uredi filtre iskanja</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-10 text-gray-500 dark:text-gray-400">Nimate shranjenih iskanj.</p>
                    )}
                </div>
            </div>

            {notificationModalSearch && (
                <NotificationSettingsModal
                    search={notificationModalSearch}
                    onClose={() => setNotificationModalSearch(null)}
                    onSave={handleUpdateNotifications}
                />
            )}
            {editModalSearch && (
                <EditSearchModal
                    search={editModalSearch}
                    onClose={() => setEditModalSearch(null)}
                    onSave={handleSaveEditedSearch}
                    institutions={institutions}
                    eligibleEntities={eligibleEntities}
                />
            )}
            <ConfirmationModal
                isOpen={!!searchToDeleteId}
                title="Potrdi brisanje"
                message="Ali ste prepričani, da želite trajno izbrisati to shranjeno iskanje? Dejanje je nepreklicno."
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Da, izbriši"
                cancelText="Prekliči"
            />
        </>
    );
};

export default SavedSearchesPage;