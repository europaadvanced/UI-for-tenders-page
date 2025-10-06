
import React, { useState } from 'react';
import { AppView } from '../App';
import { SearchIcon, BookmarkIcon, BookmarkAltIcon, ChatAlt2Icon, UserCircleIcon, MenuIcon, CloseIcon } from './Icons';

interface SidebarProps {
    currentView: AppView;
    onViewChange: (view: AppView) => void;
}

const navItems = [
    { view: 'search' as AppView, label: 'Iskanje razpisov', icon: <SearchIcon className="w-6 h-6" /> },
    { view: 'saved-tenders' as AppView, label: 'Shranjeni razpisi', icon: <BookmarkIcon className="w-6 h-6" filled /> },
    { view: 'ai-chat' as AppView, label: 'AI pomoč', icon: <ChatAlt2Icon className="w-6 h-6" /> },
    { view: 'saved-searches' as AppView, label: 'Shranjena iskanja', icon: <BookmarkAltIcon className="w-6 h-6" /> },
    { view: 'profile' as AppView, label: 'Profil podjetja', icon: <UserCircleIcon className="w-6 h-6" /> },
];

const NavLink: React.FC<{
    item: typeof navItems[0];
    isActive: boolean;
    onClick: () => void;
}> = ({ item, isActive, onClick }) => {
    const activeClasses = 'bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-light';
    const inactiveClasses = 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700';

    return (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); onClick(); }}
            className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-semibold transition-colors ${isActive ? activeClasses : inactiveClasses}`}
        >
            {item.icon}
            <span className="flex-1">{item.label}</span>
        </a>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLinkClick = (view: AppView) => {
        onViewChange(view);
        setIsMobileMenuOpen(false);
    };
    
    const navContent = (
      <nav className="flex flex-col gap-2">
          {navItems.map(item => (
              <NavLink
                  key={item.view}
                  item={item}
                  isActive={currentView === item.view}
                  onClick={() => handleLinkClick(item.view)}
              />
          ))}
      </nav>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                     <div className="flex-shrink-0">
                        <h1 className="text-2xl text-gray-900 dark:text-gray-100">
                            <span className="font-serif font-bold">Tenders</span>
                            <span className="font-serif font-thin italic text-brand">.AI</span>
                        </h1>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                        {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
                {isMobileMenuOpen && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        {navContent}
                    </div>
                )}
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-40">
                <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex-shrink-0 p-3 mb-4">
                        <h1 className="text-3xl text-gray-900 dark:text-gray-100">
                            <span className="font-serif font-bold">Tenders</span>
                            <span className="font-serif font-thin italic text-brand">.AI</span>
                        </h1>
                         <p className="text-sm text-gray-500 dark:text-gray-400">Vaš portal do javnih sredstev</p>
                    </div>
                    {navContent}
                </div>
            </div>
        </>
    );
};

export default Sidebar;