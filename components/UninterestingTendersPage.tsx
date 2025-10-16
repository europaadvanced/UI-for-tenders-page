import React, { useState, useMemo } from 'react';
import { Tender, SavedTender } from '../types';
import TenderCard from './TenderCard';
import TenderDetail from './TenderDetail';

interface UninterestingTendersPageProps {
    allTenders: Tender[];
    uninterestingTenderIds: number[];
    onMarkUninteresting: (id: number) => void;
    savedTenders: SavedTender[];
    onSaveTender: (id: number) => void;
    onUpdateNickname: (id: number, nickname: string) => void;
}

const UninterestingTendersPage: React.FC<UninterestingTendersPageProps> = ({ 
    allTenders, 
    uninterestingTenderIds, 
    onMarkUninteresting,
    savedTenders,
    onSaveTender,
    onUpdateNickname
}) => {
    const [selectedTenderId, setSelectedTenderId] = useState<number | null>(null);

    const uninterestingTenders = useMemo(() => {
        return allTenders.filter(tender => uninterestingTenderIds.includes(tender.id));
    }, [allTenders, uninterestingTenderIds]);

    const selectedTender = useMemo(() => allTenders.find(t => t.id === selectedTenderId) || null, [selectedTenderId, allTenders]);
    const savedTenderIds = useMemo(() => savedTenders.map(t => t.id), [savedTenders]);
    
    return (
        <div>
            <div className="p-4 sm:p-6 mb-8 ui-element-depth rounded-xl">
                 <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100">Nezanimivi razpisi ({uninterestingTenderIds.length})</h2>
                 <p className="mt-1 text-base text-slate-600 dark:text-slate-400">Seznam razpisov, ki ste jih označili kot nezanimive. Tukaj jih lahko pregledate in po potrebi spremenite njihov status.</p>
            </div>
            
            <div className="lg:flex lg:gap-8">
                <div className={`w-full transition-all duration-300 ${selectedTender ? 'hidden lg:block lg:w-1/3' : 'lg:w-full'}`}>
                    {uninterestingTenders.length > 0 ? (
                        <div className="space-y-3">
                            {uninterestingTenders.map(tender => (
                                <TenderCard 
                                    key={tender.id}
                                    tender={tender} 
                                    onClick={() => setSelectedTenderId(tender.id)}
                                    isSelected={tender.id === selectedTenderId}
                                    onSave={() => onSaveTender(tender.id)}
                                    isSaved={savedTenderIds.includes(tender.id)}
                                    onMarkUninteresting={() => onMarkUninteresting(tender.id)}
                                    isUninteresting={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-10 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Nimate nezanimivih razpisov</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">Tukaj se bodo zbirali razpisi, ki jih boste označili.</p>
                        </div>
                    )}
                </div>
                 <div className={`w-full lg:sticky lg:top-8 transition-all duration-300 lg:max-h-[calc(100vh-4rem)] ${selectedTender ? 'lg:w-2/3' : 'lg:w-0'}`}>
                    {selectedTender && (
                        <TenderDetail 
                            tender={selectedTender} 
                            onClose={() => setSelectedTenderId(null)} 
                            onSave={onSaveTender} 
                            isSaved={savedTenderIds.includes(selectedTender.id)}
                            onMarkUninteresting={onMarkUninteresting}
                            isUninteresting={uninterestingTenderIds.includes(selectedTender.id)}
                            savedTenders={savedTenders}
                            onUpdateNickname={onUpdateNickname}
                        />
                    )}
                 </div>
            </div>
        </div>
    );
};

export default UninterestingTendersPage;