
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Tender, FilterState, SavedSearch, ProfileData } from './types';
import { fetchTenders } from './services/geminiService';
import { useLocalStorage } from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import TenderSearchPage from './components/TenderSearchPage';
import SavedTendersPage from './components/SavedTendersPage';
import SavedSearchesPage from './components/SavedSearchesPage';
import AiChatPage from './components/AiChatPage';
import ProfilePage from './components/ProfilePage';
import Footer from './components/Footer';

export type AppView = 'search' | 'saved-tenders' | 'ai-chat' | 'saved-searches' | 'profile';

const App: React.FC = () => {
    const [allTenders, setAllTenders] = useState<Tender[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [savedTenderIds, setSavedTenderIds] = useLocalStorage<number[]>('savedTenders', []);
    const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>('savedSearches', []);
    const [profile, setProfile] = useLocalStorage<ProfileData>('userProfile', {
        companyName: '', industry: '', companySize: '', mainGoals: '', projectDescription: ''
    });

    const [currentView, setCurrentView] = useState<AppView>('search');
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

    // State specifically for TenderSearchPage
    const [searchPageState, setSearchPageState] = useLocalStorage('searchPageState', {
        selectedTenderId: null,
        filters: {
            keyword: '', fundingType: 'all', category: 'all', institution: 'all',
            eligibleEntity: 'all', deadlineStart: '', deadlineEnd: '',
            minFunding: 0, maxFunding: 0, showSaved: false,
        },
        activeFilters: {
            keyword: '', fundingType: 'all', category: 'all', institution: 'all',
            eligibleEntity: 'all', deadlineStart: '', deadlineEnd: '',
            minFunding: 0, maxFunding: 0, showSaved: false,
        },
        sortConfig: { key: 'deadline', direction: 'asc' },
        currentPage: 1,
        itemsPerPage: 10,
    });

    const handleThemeToggle = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    // Load tenders on mount
    useEffect(() => {
        const loadTenders = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const tenders = await fetchTenders();
                setAllTenders(tenders);
            } catch (err) {
                setError('Napaka pri nalaganju razpisov. Poskusite znova kasneje.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadTenders();
    }, []);
    
    // Check for URL params to load a saved search
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const searchId = urlParams.get('searchId');
      if (searchId) {
        const searchToLoad = savedSearches.find(s => s.id === searchId);
        if (searchToLoad) {
          setSearchPageState(prev => ({
            ...prev,
            filters: searchToLoad.filters,
            activeFilters: searchToLoad.filters,
            currentPage: 1,
          }));
          setCurrentView('search');
          // Clean the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }, [savedSearches, setSearchPageState]);


    const handleSaveTender = useCallback((id: number) => {
        setSavedTenderIds(prev => prev.includes(id) ? prev.filter(savedId => savedId !== id) : [...prev, id]);
    }, [setSavedTenderIds]);
    
    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center py-20 text-lg">Nalaganje razpisov...</div>
        }
        if (error) {
            return <div className="text-center py-20 text-red-500 text-lg">{error}</div>
        }

        switch (currentView) {
            case 'search':
                return <TenderSearchPage
                    allTenders={allTenders}
                    savedTenderIds={savedTenderIds}
                    onSaveTender={handleSaveTender}
                    savedSearches={savedSearches}
                    setSavedSearches={setSavedSearches}
                    pageState={searchPageState}
                    setPageState={setSearchPageState}
                />;
            case 'saved-tenders':
                return <SavedTendersPage
                    allTenders={allTenders}
                    savedTenderIds={savedTenderIds}
                    onSaveTender={handleSaveTender}
                />;
            case 'saved-searches':
                return <SavedSearchesPage
                    allTenders={allTenders}
                    savedSearches={savedSearches}
                    setSavedSearches={setSavedSearches}
                />;
            case 'ai-chat':
                return <AiChatPage profile={profile} />;
            case 'profile':
                return <ProfilePage profile={profile} onSave={setProfile} />;
            default:
                return <TenderSearchPage
                    allTenders={allTenders}
                    savedTenderIds={savedTenderIds}
                    onSaveTender={handleSaveTender}
                    savedSearches={savedSearches}
                    setSavedSearches={setSavedSearches}
                    pageState={searchPageState}
                    setPageState={setSearchPageState}
                />;
        }
    };

    return (
        <div className="min-h-screen text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 font-sans">
            <Sidebar currentView={currentView} onViewChange={setCurrentView} />
            <div className="lg:pl-64 flex flex-col min-h-screen">
                <main className="flex-grow p-4 md:p-6 lg:p-8">
                    {renderContent()}
                </main>
                <Footer theme={theme} onToggle={handleThemeToggle} />
            </div>
        </div>
    );
};

export default App;