
import React, { useState } from 'react';
import { SavedSearch } from '../types';
import { ChevronUpIcon, ChevronDownIcon, TrashIcon } from './Icons';

interface SavedSearchesProps {
    searches: SavedSearch[];
    onLoad: (search: SavedSearch) => void;
    onDelete: (id: string) => void;
}

const SavedSearches: React.FC<SavedSearchesProps> = ({ searches, onLoad, onDelete }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (searches.length === 0) {
        return null;
    }

    return (
        <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-t-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 font-serif">Shranjena iskanja ({searches.length})</h3>
                {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                    {searches.map(search => (
                        <div key={search.id} className="flex justify-between items-center p-3 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                            <span className="font-medium text-gray-800 dark:text-gray-200">{search.name}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onLoad(search)}
                                    className="px-3 py-1 text-sm font-semibold bg-brand/10 text-brand-dark dark:text-brand-light rounded hover:bg-brand/20 transition-colors"
                                >
                                    Naloži
                                </button>
                                <button
                                    onClick={() => onDelete(search.id)}
                                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                    aria-label={`Izbriši iskanje ${search.name}`}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SavedSearches;
