
import React from 'react';
import { SunIcon, MoonIcon } from './Icons';

interface ThemeToggleSwitchProps {
    theme: 'light' | 'dark';
    onToggle: () => void;
}

const ThemeToggleSwitch: React.FC<ThemeToggleSwitchProps> = ({ theme, onToggle }) => {
    const isDark = theme === 'dark';

    return (
        <div className="flex items-center gap-2">
            <SunIcon className={`w-6 h-6 ${isDark ? 'text-gray-500' : 'text-brand'}`} />
            <button
                type="button"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:ring-offset-gray-800 ${
                    isDark ? 'bg-brand' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={isDark}
                onClick={onToggle}
                aria-label="Preklopi med temnim in svetlim načinom"
            >
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isDark ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
            <MoonIcon className={`w-6 h-6 ${isDark ? 'text-brand' : 'text-gray-500'}`} />
        </div>
    );
};

export default ThemeToggleSwitch;
