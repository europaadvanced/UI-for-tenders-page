
import React, { useState, useMemo } from 'react';
import { Tender } from '../types';
import TenderList from './TenderList';
import TenderDetail from './TenderDetail';

interface SavedTendersPageProps {
    allTenders: Tender[];
    savedTenderIds: number[];
    onSaveTender: (id: number) => void;
}

const SavedTendersPage: React.FC<SavedTendersPageProps> = ({ allTenders, savedTenderIds, onSaveTender }) => {
    const [selectedTenderId, setSelectedTenderId] = useState<number | null>(null);

    const savedTenders = useMemo(() => {
        return allTenders.filter(tender => savedTenderIds.includes(tender.id));
    }, [allTenders, savedTenderIds]);
    
    const selectedTender = useMemo(() => allTenders.find(t => t.id === selectedTenderId) || null, [selectedTenderId, allTenders]);

    return (
        <div>
            <div className="bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-8">
                 <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 dark:text-gray-100">Shranjeni razpisi ({savedTenderIds.length})</h2>
                 <p className="mt-1 text-base text-gray-600 dark:text-gray-400">Tukaj so vsi razpisi, ki ste jih označili za kasnejši pregled.</p>
            </div>
            
            <div className="lg:flex lg:gap-8">
                <div className={`w-full transition-all duration-300 ${selectedTender ? 'hidden lg:block lg:w-1/3' : 'lg:w-full'}`}>
                     <TenderList 
                        tenders={savedTenders} 
                        onSelectTender={setSelectedTenderId} 
                        selectedTenderId={selectedTenderId} 
                        onSaveTender={onSaveTender} 
                        savedTenderIds={savedTenderIds}
                    />
                </div>
                 <div className={`w-full lg:sticky lg:top-8 transition-all duration-300 lg:max-h-[calc(100vh-4rem)] ${selectedTender ? 'lg:w-2/3' : 'lg:w-0'}`}>
                     {selectedTender && (
                        <TenderDetail 
                            tender={selectedTender} 
                            onClose={() => setSelectedTenderId(null)} 
                            onSave={onSaveTender} 
                            isSaved={savedTenderIds.includes(selectedTender.id)} 
                        />
                    )}
                 </div>
            </div>
        </div>
    );
};

export default SavedTendersPage;