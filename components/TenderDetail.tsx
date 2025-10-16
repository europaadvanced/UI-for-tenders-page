import React, { useState, useEffect, useRef } from 'react';
import { Tender, SavedTender } from '../types';
import { CloseIcon, BookmarkIcon, EyeOffIcon, PencilIcon, ChevronRightIcon } from './Icons';
import InstitutionLogo from './InstitutionLogo';

interface TenderDetailProps {
    tender: Tender;
    onClose: () => void;
    onSave: (id: number) => void;
    isSaved: boolean;
    onMarkUninteresting: (id: number) => void;
    isUninteresting: boolean;
    savedTenders: SavedTender[];
    onUpdateNickname: (id: number, nickname: string) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('sl-SI', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
};

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-6 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-4">{title}</h4>
        {children}
    </div>
);

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    const elements: (string | string[])[] = [];
    let currentList: string[] | null = null;

    lines.forEach(line => {
        if (line.startsWith('* ')) {
            if (!currentList) {
                currentList = [];
                elements.push(currentList);
            }
            currentList.push(line.substring(2));
        } else {
            currentList = null;
            elements.push(line);
        }
    });

    return (
        <div className="text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed text-base">
            {elements.map((element, index) => {
                if (Array.isArray(element)) {
                    return (
                        <ul key={index} className="list-disc list-outside pl-5 space-y-2">
                            {element.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
                        </ul>
                    );
                }
                
                if (element.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-6 mb-2">{element.substring(4)}</h3>;
                }

                return <p key={index}>{element}</p>;
            })}
        </div>
    );
};


const TenderDetail: React.FC<TenderDetailProps> = ({ tender, onClose, onSave, isSaved, onMarkUninteresting, isUninteresting, savedTenders, onUpdateNickname }) => {
    
    const savedTenderInfo = savedTenders.find(st => st.id === tender.id);
    const nickname = savedTenderInfo?.nickname;

    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [nicknameInput, setNicknameInput] = useState(nickname || '');
    const inputRef = useRef<HTMLInputElement>(null);

     useEffect(() => {
        setNicknameInput(nickname || '');
    }, [nickname]);
    
    useEffect(() => {
        if (isEditingNickname) {
            inputRef.current?.focus();
        }
    }, [isEditingNickname]);

    const handleNicknameSave = () => {
        if (onUpdateNickname) {
            onUpdateNickname(tender.id, nicknameInput);
        }
        setIsEditingNickname(false);
    }
    
    const handleNicknameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleNicknameSave();
        } else if (e.key === 'Escape') {
            setNicknameInput(nickname || '');
            setIsEditingNickname(false);
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden" onClick={onClose}></div>
            <div className="h-full overflow-y-auto fixed inset-y-0 right-0 w-full max-w-lg z-40 lg:relative lg:max-w-none lg:inset-auto lg:z-auto lg:rounded-xl animate-slide-in-right lg:animate-none ui-element-depth">
                <div className="p-6">
                    <div className="flex justify-between items-start pb-5 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex-grow">
                            <p className="text-sm text-brand font-semibold">{tender.category}</p>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{tender.title}</h2>
                            {isSaved && (
                                 <div className="mt-3 flex items-center gap-2">
                                     {isEditingNickname ? (
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={nicknameInput}
                                            onChange={(e) => setNicknameInput(e.target.value)}
                                            onBlur={handleNicknameSave}
                                            onKeyDown={handleNicknameKeyDown}
                                            placeholder="Dodaj vzdevek..."
                                            className="text-base h-9 px-3 rounded-md input-depth border-brand w-full"
                                        />
                                     ) : (
                                        <button onClick={() => setIsEditingNickname(true)} className="flex items-center gap-2 text-left w-full p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                             <PencilIcon className="w-5 h-5 text-slate-400" />
                                             <p className="text-base text-slate-500 dark:text-slate-400 italic">
                                                {nickname || 'Dodaj vzdevek...'}
                                             </p>
                                         </button>
                                     )}
                                 </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                            <button onClick={() => onMarkUninteresting(tender.id)} className="p-2 rounded-full hover:bg-slate-400/10 transition-colors" aria-label={isUninteresting ? "Označi kot zanimivo" : "Označi kot nezanimivo"}>
                                <EyeOffIcon filled={isUninteresting} />
                            </button>
                            <button onClick={() => onSave(tender.id)} className="p-2 rounded-full hover:bg-brand/10 transition-colors" aria-label={isSaved ? 'Odstrani shranjen razpis' : 'Shrani razpis'}>
                                <BookmarkIcon filled={isSaved} />
                            </button>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Zapri podrobnosti">
                                <CloseIcon />
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-6 gap-y-6 py-6 border-b border-slate-200 dark:border-slate-700">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Višina financiranja</p>
                            <p className="font-semibold text-lg text-slate-800 dark:text-slate-100">{`${formatCurrency(tender.fundingMin)} - ${formatCurrency(tender.fundingMax)}`}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Rok za prijavo</p>
                            <p className="font-semibold text-lg text-slate-800 dark:text-slate-100">{new Date(tender.deadline).toLocaleDateString('sl-SI')}</p>
                        </div>
                         <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Institucija</p>
                            <div className="flex items-center gap-3 mt-1">
                                <InstitutionLogo institutionName={tender.institution} className="w-8 h-8" />
                                <p className="font-semibold text-base text-slate-800 dark:text-slate-100">{tender.institution}</p>
                            </div>
                        </div>
                         <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Tip financiranja</p>
                            <p className="font-semibold text-base text-slate-800 dark:text-slate-100">{tender.fundingType}</p>
                        </div>
                    </div>

                    <DetailSection title="Upravičeni prijavitelji">
                        <div className="flex flex-wrap gap-2">
                            {tender.eligibleEntities.map(entity => (
                                <span key={entity} className="bg-brand/10 text-brand-dark dark:text-brand-light text-sm font-medium px-3 py-1.5 rounded-full">{entity}</span>
                            ))}
                        </div>
                    </DetailSection>

                     <DetailSection title="Polni opis">
                        <MarkdownRenderer content={tender.fullDescription} />
                    </DetailSection>

                    <DetailSection title="Ključne točke">
                        <ul className="space-y-3">
                            {tender.conclusionPoints.map((point, index) => (
                                <li key={index} className="flex items-start text-base text-slate-700 dark:text-slate-300">
                                    <ChevronRightIcon className="w-5 h-5 mr-2 mt-0.5 text-brand flex-shrink-0" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </DetailSection>
                </div>
            </div>
        </>
    );
};

export default TenderDetail;