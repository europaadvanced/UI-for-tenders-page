import React, { useState, useEffect, useRef } from 'react';
import { Tender } from '../types';
import { CalendarIcon, CashIcon, OfficeBuildingIcon, TagIcon, BookmarkIcon, EyeOffIcon, PencilIcon } from './Icons';
import InstitutionLogo from './InstitutionLogo';

interface TenderCardProps {
    tender: Tender;
    onClick: () => void;
    isSelected: boolean;
    onSave: () => void;
    isSaved: boolean;
    onMarkUninteresting: () => void;
    isUninteresting: boolean;
    nickname?: string;
    onUpdateNickname?: (newNickname: string) => void;
    isEditable?: boolean;
}

const formatCurrency = (value: number) => `€${(value / 1000).toFixed(0)}k`;

const Tag: React.FC<{ icon: React.ReactNode; text: string; className?: string }> = ({ icon, text, className }) => (
    <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${className}`}>
        <div className="flex-shrink-0">{icon}</div>
        <span>{text}</span>
    </div>
);

const TenderCard: React.FC<TenderCardProps> = ({ tender, onClick, isSelected, onSave, isSaved, onMarkUninteresting, isUninteresting, nickname, onUpdateNickname, isEditable = false }) => {
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

    const handleSaveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSave();
    };
    
    const handleUninterestingClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onMarkUninteresting();
    };

    const handleNicknameSave = () => {
        if (onUpdateNickname) {
            onUpdateNickname(nicknameInput);
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
        <div 
            onClick={onClick}
            className={`p-5 rounded-xl cursor-pointer transition-all duration-200 relative ui-element-depth hover:shadow-lg hover:-translate-y-px ${isSelected ? 'selected-depth' : ''} ${isUninteresting ? 'uninteresting-card' : ''}`}
        >
            <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
                <button onClick={handleUninterestingClick} className="p-2 rounded-full hover:bg-slate-400/10 transition-colors" aria-label={isUninteresting ? "Označi kot zanimivo" : "Označi kot nezanimivo"}>
                    <EyeOffIcon filled={isUninteresting} />
                </button>
                <button onClick={handleSaveClick} className="p-2 rounded-full hover:bg-brand/10 transition-colors" aria-label={isSaved ? "Odstrani shranjen razpis" : "Shrani razpis"}>
                    <BookmarkIcon filled={isSaved} />
                </button>
            </div>
            <div className="flex items-start gap-4">
                <InstitutionLogo institutionName={tender.institution} className="w-10 h-10 flex-shrink-0 mt-1" />
                <div className="flex-grow">
                     <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 pr-16">{tender.title}</h3>
                     {isEditable && isSaved && (
                         <div className="mt-1.5 flex items-center gap-2">
                             {isEditingNickname ? (
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={nicknameInput}
                                    onChange={(e) => setNicknameInput(e.target.value)}
                                    onBlur={handleNicknameSave}
                                    onKeyDown={handleNicknameKeyDown}
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="Dodaj vzdevek..."
                                    className="text-sm h-7 px-2 rounded-md bg-white dark:bg-slate-700 border border-brand"
                                />
                             ) : (
                                <>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                                        {nickname || 'Brez vzdevka'}
                                     </p>
                                     <button onClick={(e) => { e.stopPropagation(); setIsEditingNickname(true); }} className="text-slate-400 hover:text-brand">
                                         <PencilIcon className="w-4 h-4" />
                                     </button>
                                </>
                             )}
                         </div>
                     )}
                     {!isUninteresting && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{tender.summary}</p>}
                </div>
            </div>
            
            {!isUninteresting && tender.eligibleEntities && tender.eligibleEntities.length > 0 && (
                <div className="mt-3 pl-14">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {tender.eligibleEntities.join('  •  ')}
                    </p>
                </div>
            )}

            {!isUninteresting && (
                <div className="flex flex-wrap gap-2 mt-4 pl-14">
                    <Tag 
                        icon={<CashIcon className="w-4 h-4"/>} 
                        text={`${formatCurrency(tender.fundingMin)} - ${formatCurrency(tender.fundingMax)}`}
                        className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                    />
                     <Tag 
                        icon={<OfficeBuildingIcon className="w-4 h-4" />} 
                        text={tender.institution} 
                        className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    />
                    <Tag 
                        icon={<CalendarIcon className="w-4 h-4" />} 
                        text={`Rok: ${new Date(tender.deadline).toLocaleDateString('sl-SI')}`} 
                        className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    />
                    <Tag 
                        icon={<TagIcon className="w-4 h-4" />} 
                        text={tender.fundingType} 
                        className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    />
                </div>
            )}
        </div>
    );
};

export default TenderCard;