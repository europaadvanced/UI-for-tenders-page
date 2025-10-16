import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Tender, FilterState, SavedSearch, ProfileData, SavedTender } from './types';
import { fetchTenders } from './services/geminiService';
import { useLocalStorage } from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import TenderSearchPage from './components/TenderSearchPage';
import SavedTendersPage from './components/SavedTendersPage';
import UninterestingTendersPage from './components/UninterestingTendersPage';
import SavedSearchesPage from './components/SavedSearchesPage';
import AiChatPage from './components/AiChatPage';
import ProfilePage from './components/ProfilePage';
import Footer from './components/Footer';

export type AppView = 'search' | 'saved-tenders' | 'uninteresting-tenders' | 'ai-chat' | 'saved-searches' | 'profile';

const App: React.FC = () => {
    const [allTenders, setAllTenders] = useState<Tender[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [savedTenders, setSavedTenders] = useLocalStorage<SavedTender[]>('savedTenders', []);
    const [uninterestingTenderIds, setUninterestingTenderIds] = useLocalStorage<number[]>('uninterestingTenderIds', []);
    const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>('savedSearches', []);
    
    const [profile, setProfile] = useLocalStorage<ProfileData>('userProfile', {
        companyName: '', industry: '', companySize: '', mainGoals: '', projectDescription: '',
        companyWebsite: '', fundingExperience: '', keyTechnologies: ''
    });

    const [currentView, setCurrentView] = useState<AppView>('search');
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

    // State specifically for TenderSearchPage
    const [searchPageState, setSearchPageState] = useLocalStorage('searchPageState', {
        selectedTenderId: null,
        filters: {
            keyword: '', fundingType: 'all', category: 'all', institution: 'all',
            eligibleEntity: 'all', deadlineStart: '', deadlineEnd: '',
            minFunding: 0, maxFunding: 0, showSaved: false, showUninteresting: true,
        },
        activeFilters: {
            keyword: '', fundingType: 'all', category: 'all', institution: 'all',
            eligibleEntity: 'all', deadlineStart: '', deadlineEnd: '',
            minFunding: 0, maxFunding: 0, showSaved: false, showUninteresting: true,
        },
        sortConfig: { key: 'deadline', direction: 'asc' },
        currentPage: 1,
        itemsPerPage: 10,
    });

    const handleThemeToggle = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

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
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }, [savedSearches, setSearchPageState]);

    const handleSaveTender = useCallback((id: number) => {
        setSavedTenders(prev => {
            const isSaved = prev.some(t => t.id === id);
            if (isSaved) {
                return prev.filter(t => t.id !== id);
            } else {
                setUninterestingTenderIds(ids => ids.filter(uninterestingId => uninterestingId !== id));
                return [...prev, { id, nickname: '' }];
            }
        });
    }, [setSavedTenders, setUninterestingTenderIds]);
    
    const handleUpdateNickname = useCallback((id: number, nickname: string) => {
        setSavedTenders(prev => prev.map(t => t.id === id ? { ...t, nickname } : t));
    }, [setSavedTenders]);
    
    const handleMarkUninteresting = useCallback((id: number) => {
        setUninterestingTenderIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(uninterestingId => uninterestingId !== id);
            } else {
                setSavedTenders(saved => saved.filter(t => t.id !== id));
                return [...prev, id];
            }
        });
    }, [setUninterestingTenderIds, setSavedTenders]);
    
    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center py-20 text-lg text-slate-600 dark:text-slate-400">Nalaganje razpisov...</div>
        }
        if (error) {
            return <div className="text-center py-20 text-red-500 text-lg">{error}</div>
        }

        switch (currentView) {
            case 'search':
                return <TenderSearchPage
                    allTenders={allTenders}
                    savedTenders={savedTenders}
                    uninterestingTenderIds={uninterestingTenderIds}
                    onSaveTender={handleSaveTender}
                    onMarkUninteresting={handleMarkUninteresting}
                    onUpdateNickname={handleUpdateNickname}
                    savedSearches={savedSearches}
                    setSavedSearches={setSavedSearches}
                    pageState={searchPageState}
                    setPageState={setSearchPageState}
                />;
            case 'saved-tenders':
                return <SavedTendersPage
                    allTenders={allTenders}
                    savedTenders={savedTenders}
                    onSaveTender={handleSaveTender}
                    onMarkUninteresting={handleMarkUninteresting}
                    onUpdateNickname={handleUpdateNickname}
                    uninterestingTenderIds={uninterestingTenderIds}
                />;
            case 'uninteresting-tenders':
                 return <UninterestingTendersPage
                    allTenders={allTenders}
                    uninterestingTenderIds={uninterestingTenderIds}
                    onMarkUninteresting={handleMarkUninteresting}
                    savedTenders={savedTenders}
                    onSaveTender={handleSaveTender}
                    onUpdateNickname={handleUpdateNickname}
                />;
            case 'saved-searches':
                return <SavedSearchesPage
                    allTenders={allTenders}
                    savedSearches={savedSearches}
                    setSavedSearches={setSavedSearches}
                />;
            case 'ai-chat':
                return <AiChatPage 
                            profile={profile} 
                            allTenders={allTenders}
                            savedTenders={savedTenders}
                       />;
            case 'profile':
                return <ProfilePage profile={profile} onSave={setProfile} />;
            default:
                return <div />;
        }
    };

    return (
        <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-900">
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