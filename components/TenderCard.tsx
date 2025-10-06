import React from 'react';
import { Tender } from '../types';
import { CalendarIcon, CashIcon, OfficeBuildingIcon, TagIcon, ChevronRightIcon, BookmarkIcon } from './Icons';

interface TenderCardProps {
    tender: Tender;
    onClick: () => void;
    isSelected: boolean;
    onSave: () => void;
    isSaved: boolean;
}

const formatCurrency = (value: number) => `€${(value / 1000).toFixed(0)}k`;

const Tag: React.FC<{ icon: React.ReactNode; text: string; className?: string }> = ({ icon, text, className }) => (
    <div className={`flex items-start gap-1.5 text-sm font-medium px-2.5 py-1 rounded ${className}`}>
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <span>{text}</span>
    </div>
);

const TenderCard: React.FC<TenderCardProps> = ({ tender, onClick, isSelected, onSave, isSaved }) => {
    const handleSaveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSave();
    };

    return (
        <div 
            onClick={onClick}
            className={`bg-white dark:bg-gray-800 p-5 rounded-md border cursor-pointer transition-all duration-200 relative ${isSelected ? 'border-brand shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'}`}
        >
            <div className="flex justify-between items-start">
                <h3 className="font-heading font-bold text-xl text-gray-800 dark:text-gray-100 pr-10">{tender.title}</h3>
                 <button onClick={handleSaveClick} className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand/10 transition-colors">
                    <BookmarkIcon filled={isSaved} />
                </button>
            </div>
            <p className="text-base text-gray-600 dark:text-gray-300 mt-2">{tender.summary}</p>
            
            {tender.eligibleEntities && tender.eligibleEntities.length > 0 && (
                <div className="mt-4">
                    <p className="font-serif text-sm italic text-gray-500 dark:text-gray-400">
                        {tender.eligibleEntities.join(' | ')}
                    </p>
                </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
                <Tag 
                    icon={<CashIcon className="w-4 h-4"/>} 
                    text={`${formatCurrency(tender.fundingMin)} - ${formatCurrency(tender.fundingMax)}`}
                    className="bg-brand/10 text-brand-dark dark:text-brand-light"
                />
                 <Tag 
                    icon={<OfficeBuildingIcon className="w-4 h-4" />} 
                    text={tender.institution} 
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                />
                <Tag 
                    icon={<CalendarIcon className="w-4 h-4" />} 
                    text={`Rok: ${new Date(tender.deadline).toLocaleDateString('sl-SI')}`} 
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                />
                <Tag 
                    icon={<TagIcon className="w-4 h-4" />} 
                    text={tender.fundingType} 
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                />
            </div>
        </div>
    );
};

export default TenderCard;