
import React from 'react';
import { Tender } from '../types';
import TenderCard from './TenderCard';

interface TenderListProps {
    tenders: Tender[];
    onSelectTender: (id: number) => void;
    selectedTenderId: number | null;
    onSaveTender: (id: number) => void;
    savedTenderIds: number[];
    onMarkUninteresting: (id: number) => void;
    uninterestingTenderIds: number[];
}

const TenderList: React.FC<TenderListProps> = ({ tenders, onSelectTender, selectedTenderId, onSaveTender, savedTenderIds, onMarkUninteresting, uninterestingTenderIds }) => {
    if (tenders.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-10 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Ni najdenih razpisov</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">Poskusite prilagoditi filtre za iskanje novih priložnosti.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tenders.map(tender => (
                <TenderCard 
                    key={tender.id} 
                    tender={tender} 
                    onClick={() => onSelectTender(tender.id)}
                    isSelected={tender.id === selectedTenderId}
                    onSave={() => onSaveTender(tender.id)}
                    isSaved={savedTenderIds.includes(tender.id)}
                    onMarkUninteresting={() => onMarkUninteresting(tender.id)}
                    isUninteresting={uninterestingTenderIds.includes(tender.id)}
                />
            ))}
        </div>
    );
};

export default TenderList;