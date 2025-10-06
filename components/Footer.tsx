
import React from 'react';
import ThemeToggleSwitch from './ThemeToggleSwitch';
import { MailIcon, PhoneIcon, LocationMarkerIcon } from './Icons';

interface FooterProps {
    theme: 'light' | 'dark';
    onToggle: () => void;
}

const Footer: React.FC<FooterProps> = ({ theme, onToggle }) => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 md:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {/* Column 1: Brand & Copyright */}
                    <div>
                        <h2 className="text-2xl text-gray-900 dark:text-gray-100 flex items-center justify-center md:justify-start">
                            <span className="font-serif font-bold">Tenders</span>
                            <span className="font-serif font-thin italic text-brand">.AI</span>
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            &copy; {new Date().getFullYear()} Tenders.AI. Vse pravice pridržane.
                        </p>
                    </div>

                    {/* Column 2: Contact Info */}
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4 font-heading">Kontakt</h3>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                            <li className="flex items-center justify-center md:justify-start">
                                <MailIcon className="w-5 h-5 mr-3 text-brand" />
                                <span>info@tenders.ai</span>
                            </li>
                            <li className="flex items-center justify-center md:justify-start">
                                <PhoneIcon className="w-5 h-5 mr-3 text-brand" />
                                <span>+386 1 234 5678</span>
                            </li>
                            <li className="flex items-center justify-center md:justify-start">
                                <LocationMarkerIcon className="w-5 h-5 mr-3 text-brand" />
                                <span>Dunajska cesta 5, 1000 Ljubljana</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Theme Toggle */}
                    <div className="flex items-center justify-center md:justify-end md:items-start pt-2">
                        <ThemeToggleSwitch theme={theme} onToggle={onToggle} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
