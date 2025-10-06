import React from 'react';
import { Tender } from '../types';
import { CloseIcon, BookmarkIcon, ChevronRightIcon } from './Icons';

interface TenderDetailProps {
    tender: Tender;
    onClose: () => void;
    onSave: (id: number) => void;
    isSaved: boolean;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('sl-SI', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
};

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-6 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-4">{title}</h4>
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
        <div className="text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed text-base">
            {elements.map((element, index) => {
                if (Array.isArray(element)) {
                    return (
                        <ul key={index} className="list-disc list-outside pl-5 space-y-2">
                            {element.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
                        </ul>
                    );
                }
                
                if (element.startsWith('### ')) {
                    return <h3 key={index} className="text-2xl font-heading font-bold text-gray-800 dark:text-gray-100 mt-6 mb-2">{element.substring(4)}</h3>;
                }

                return <p key={index}>{element}</p>;
            })}
        </div>
    );
};


const TenderDetail: React.FC<TenderDetailProps> = ({ tender, onClose, onSave, isSaved }) => {
    const handleSaveClick = () => {
        onSave(tender.id);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden" onClick={onClose}></div>
            <div className="bg-white dark:bg-gray-800 h-full overflow-y-auto fixed inset-y-0 right-0 w-full max-w-lg z-40 lg:relative lg:max-w-none lg:inset-auto lg:z-auto lg:rounded-md lg:shadow-md lg:border lg:border-gray-200 dark:border-gray-700 animate-slide-in-right lg:animate-none">
                <div className="p-6">
                    <div className="flex justify-between items-start pb-5 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <p className="text-base text-brand font-semibold">{tender.category}</p>
                            <h2 className="text-3xl font-heading font-bold text-gray-800 dark:text-gray-100 mt-1">{tender.title}</h2>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                            <button onClick={handleSaveClick} className="p-2 rounded-full hover:bg-brand/10 transition-colors" aria-label={isSaved ? 'Odstrani shranjen razpis' : 'Shrani razpis'}>
                                <BookmarkIcon filled={isSaved} />
                            </button>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Zapri podrobnosti">
                                <CloseIcon />
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-6 gap-y-6 py-6 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <p className="text-base text-gray-500 dark:text-gray-400">Višina financiranja</p>
                            <p className="font-semibold text-xl text-gray-800 dark:text-gray-100">{`${formatCurrency(tender.fundingMin)} - ${formatCurrency(tender.fundingMax)}`}</p>
                        </div>
                        <div>
                            <p className="text-base text-gray-500 dark:text-gray-400">Rok za prijavo</p>
                            <p className="font-semibold text-xl text-gray-800 dark:text-gray-100">{new Date(tender.deadline).toLocaleDateString('sl-SI')}</p>
                        </div>
                         <div>
                            <p className="text-base text-gray-500 dark:text-gray-400">Institucija</p>
                            <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">{tender.institution}</p>
                        </div>
                         <div>
                            <p className="text-base text-gray-500 dark:text-gray-400">Tip financiranja</p>
                            <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">{tender.fundingType}</p>
                        </div>
                    </div>

                    <DetailSection title="Upravičeni prijavitelji">
                        <div className="flex flex-wrap gap-2">
                            {tender.eligibleEntities.map(entity => (
                                <span key={entity} className="bg-brand/10 text-brand-dark dark:text-brand-light text-base font-medium px-4 py-1.5 rounded-full">{entity}</span>
                            ))}
                        </div>
                    </DetailSection>

                     <DetailSection title="Polni opis">
                        <MarkdownRenderer content={tender.fullDescription} />
                    </DetailSection>

                    <DetailSection title="Ključne točke">
                        <ul className="space-y-3">
                            {tender.conclusionPoints.map((point, index) => (
                                <li key={index} className="flex items-start text-base text-gray-700 dark:text-gray-300">
                                    <ChevronRightIcon className="w-5 h-5 mr-2 mt-1 text-brand flex-shrink-0" />
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