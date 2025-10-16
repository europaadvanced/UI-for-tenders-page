
import React, { useState } from 'react';
import { CloseIcon, SaveIcon } from './Icons';

interface SaveSearchModalProps {
    onSave: (name: string) => void;
    onClose: () => void;
}

const SaveSearchModal: React.FC<SaveSearchModalProps> = ({ onSave, onClose }) => {
    const [name, setName] = useState('');

    const handleSave = () => {
        if (name.trim()) {
            onSave(name.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="rounded-lg shadow-xl w-full max-w-md ui-element-depth">
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-heading font-bold text-gray-800 dark:text-gray-100">Shrani iskanje</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Zapri modal">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <label htmlFor="searchName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ime iskanja
                    </label>
                    <input
                        id="searchName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Npr. 'Nepovratna sredstva za digitalizacijo'"
                        className="w-full h-[42px] text-base px-4 rounded input-depth text-gray-900 dark:text-gray-100"
                        autoFocus
                    />
                     <p className="text-xs text-gray-500 dark:text-gray-400">
                        S shranjevanjem iskanja boste v prihodnosti lahko prejemali obvestila o novih ustreznih razpisih.
                    </p>
                </div>
                <div className="flex justify-end items-center p-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg space-x-3">
                    <button
                        onClick={onClose}
                        className="h-[42px] px-4 py-2 rounded font-semibold transition-colors btn-secondary text-gray-700 dark:text-gray-200"
                    >
                        Prekliči
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!name.trim()}
                        className="h-[42px] text-white font-bold text-base px-6 py-2 rounded flex items-center justify-center gap-2 btn-primary"
                    >
                        <SaveIcon className="w-5 h-5" />
                        <span>Shrani</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveSearchModal;