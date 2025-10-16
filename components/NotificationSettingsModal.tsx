import React, { useState, useEffect } from 'react';
import { SavedSearch, NotificationSettings } from '../types';
import { CloseIcon, SaveIcon } from './Icons';

interface NotificationSettingsModalProps {
    search: SavedSearch;
    onClose: () => void;
    onSave: (searchId: string, settings: NotificationSettings) => void;
}

const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({ search, onClose, onSave }) => {
    const [settings, setSettings] = useState<NotificationSettings>(search.notificationSettings);

    useEffect(() => {
        setSettings(search.notificationSettings);
    }, [search]);

    const handleSave = () => {
        onSave(search.id, settings);
    };

    const handleToggle = (key: keyof NotificationSettings) => {
        setSettings(prev => ({...prev, [key]: !prev[key]}));
    }
    
    const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h3 className="text-xl font-heading font-bold text-gray-800 dark:text-gray-100">Nastavitve obvestil</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">za iskanje: "{search.name}"</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Zapri modal">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Omogoči email obvestila</span>
                        <button
                            type="button"
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${settings.enabled ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'}`}
                            role="switch"
                            aria-checked={settings.enabled}
                            onClick={() => handleToggle('enabled')}
                        >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className={`space-y-4 transition-opacity duration-300 ${settings.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <div>
                            <label htmlFor="email" className="font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Email za obvestila</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={settings.email}
                                onChange={handleSettingChange}
                                placeholder="vnesite.vas@email.com"
                                className="w-full h-11 text-base px-4 rounded-md input-depth"
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Pogostost</label>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setSettings(s => ({...s, frequency: 'weekly'}))}
                                    className={`flex-1 p-3 rounded-md border-2 ${settings.frequency === 'weekly' ? 'border-brand bg-brand/5' : 'border-gray-300 dark:border-gray-600'}`}
                                >Tedensko</button>
                                <button
                                    onClick={() => setSettings(s => ({...s, frequency: 'monthly'}))}
                                    className={`flex-1 p-3 rounded-md border-2 ${settings.frequency === 'monthly' ? 'border-brand bg-brand/5' : 'border-gray-300 dark:border-gray-600'}`}
                                >Mesečno</button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                             <label htmlFor="include-tips" className="font-semibold text-gray-700 dark:text-gray-300">Vključi nasvete za prijavo</label>
                            <input
                                id="include-tips"
                                type="checkbox"
                                checked={settings.includeTips}
                                onChange={() => handleToggle('includeTips')}
                                className="h-5 w-5 rounded border-gray-300 text-brand focus:ring-brand"
                            />
                        </div>
                    </div>

                </div>
                <div className="flex justify-end items-center p-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg space-x-3">
                    <button onClick={onClose} className="h-[42px] px-4 py-2 rounded btn-secondary">Prekliči</button>
                    <button onClick={handleSave} className="h-[42px] text-white font-bold px-6 py-2 rounded flex items-center gap-2 btn-primary"><SaveIcon /> Shrani</button>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettingsModal;