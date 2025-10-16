
import React, { useState } from 'react';
import { AppView } from '../App';
import { SearchIcon, BookmarkIcon, BookmarkAltIcon, ChatAlt2Icon, UserCircleIcon, MenuIcon, CloseIcon, EyeOffIcon } from './Icons';

interface SidebarProps {
    currentView: AppView;
    onViewChange: (view: AppView) => void;
}

const mainNavItems = [
    { view: 'search' as AppView, label: 'Iskanje razpisov', icon: <SearchIcon className="w-5 h-5" /> },
    { view: 'saved-tenders' as AppView, label: 'Shranjeni razpisi', icon: <BookmarkIcon className="w-5 h-5" filled /> },
    { view: 'ai-chat' as AppView, label: 'AI upravljalnik', icon: <ChatAlt2Icon className="w-5 h-5" /> },
];

const secondaryNavItems = [
    { view: 'uninteresting-tenders' as AppView, label: 'Nezanimivi razpisi', icon: <EyeOffIcon className="w-5 h-5" /> },
    { view: 'saved-searches' as AppView, label: 'Shranjena iskanja', icon: <BookmarkAltIcon className="w-5 h-5" /> },
    { view: 'profile' as AppView, label: 'Profil podjetja', icon: <UserCircleIcon className="w-5 h-5" /> },
];


const NavLink: React.FC<{
    item: typeof mainNavItems[0];
    isActive: boolean;
    onClick: () => void;
    isSecondary?: boolean;
}> = ({ item, isActive, onClick, isSecondary = false }) => {
    const activeClasses = 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-slate-100';
    const primaryClasses = `font-semibold ${isActive ? activeClasses : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'}`;
    const secondaryClasses = `font-medium ${isActive ? activeClasses : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200'}`;

    return (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); onClick(); }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base transition-colors ${isSecondary ? secondaryClasses : primaryClasses}`}
        >
            {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
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
      <nav className="flex flex-col gap-1">
          {mainNavItems.map(item => (
              <NavLink
                  key={item.view}
                  item={item}
                  isActive={currentView === item.view}
                  onClick={() => handleLinkClick(item.view)}
              />
          ))}
          <div className="my-3 border-t border-slate-200 dark:border-slate-700"></div>
           {secondaryNavItems.map(item => (
              <NavLink
                  key={item.view}
                  item={item}
                  isActive={currentView === item.view}
                  onClick={() => handleLinkClick(item.view)}
                  isSecondary
              />
          ))}
      </nav>
    );

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                     <div className="flex-shrink-0">
                        <h1 className="text-2xl text-slate-900 dark:text-slate-100 font-bold">
                            <span>tenders</span>
                            <span className="font-light text-brand">.ai</span>
                        </h1>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2">
                        {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
                {isMobileMenuOpen && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        {navContent}
                    </div>
                )}
            </header>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-40">
                <div className="flex flex-col flex-grow bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex-shrink-0 p-3 mb-4">
                         <h1 className="text-3xl text-slate-900 dark:text-slate-100 font-bold">
                             <span>tenders</span>
                             <span className="font-light text-brand">.ai</span>
                        </h1>
                         <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Vaš portal do javnih sredstev</p>
                    </div>
                    {navContent}
                </div>
            </div>
        </>
    );
};

export default Sidebar;