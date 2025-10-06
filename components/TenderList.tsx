import React from 'react';
import { Tender } from '../types';
import TenderCard from './TenderCard';

interface TenderListProps {
    tenders: Tender[];
    onSelectTender: (id: number) => void;
    selectedTenderId: number | null;
    onSaveTender: (id: number) => void;
    savedTenderIds: number[];
}

const TenderList: React.FC<TenderListProps> = ({ tenders, onSelectTender, selectedTenderId, onSaveTender, savedTenderIds }) => {
    if (tenders.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-md p-10 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Ni najdenih razpisov</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">Poskusite prilagoditi filtre za iskanje novih priložnosti.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tenders.map(tender => (
                <TenderCard 
                    key={tender.id} 
                    tender={tender} 
                    onClick={() => onSelectTender(tender.id)}
                    isSelected={tender.id === selectedTenderId}
                    onSave={() => onSaveTender(tender.id)}
                    isSaved={savedTenderIds.includes(tender.id)}
                />
            ))}
        </div>
    );
};

export default TenderList;