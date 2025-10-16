
import React from 'react';
import { FilterState, FundingType, Category } from '../types';
import { SearchIcon, ChevronRightIcon, SaveIcon } from './Icons';

interface FilterBarProps {
    filters: FilterState;
    onFilterChange: (newFilters: Partial<FilterState>) => void;
    onSearch: () => void;
    institutions: string[];
    eligibleEntities: string[];
    onNavigateToAiChat: () => void;
    onSaveSearchClick: () => void;
}

const fundingTypes: (FundingType | 'all')[] = ['all', 'Nepovratna sredstva', 'Subvencija', 'So-investicija', 'Vračljiva pomoč', 'Subvencioniran kredit'];
const categories: (Category | 'all')[] = ['all', 'Tehnologija in inovacije', 'Zeleni prehod', 'Kmetijstvo', 'Turizem', 'Digitalizacija', 'Socialno podjetništvo'];

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onSearch, institutions, eligibleEntities, onNavigateToAiChat, onSaveSearchClick }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onFilterChange({ [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ [e.target.name]: e.target.checked });
    }

    const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <div className="space-y-4 pt-4">
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <label htmlFor="keyword" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Ključna beseda</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                type="text" name="keyword" id="keyword" value={filters.keyword} onChange={handleInputChange}
                                placeholder="Išči po nazivu ali povzetku..."
                                className="w-full h-[42px] text-base pl-10 pr-4 rounded-md input-depth"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="fundingType" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tip financiranja</label>
                        <select name="fundingType" id="fundingType" value={filters.fundingType} onChange={handleInputChange} className="w-full h-[42px] text-base pr-4 rounded-md input-depth">
                            {fundingTypes.map(type => <option key={type} value={type}>{type === 'all' ? 'Vse vrste' : type}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Kategorija</label>
                        <select name="category" id="category" value={filters.category} onChange={handleInputChange} className="w-full h-[42px] text-base pr-4 rounded-md input-depth">
                            {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'Vse kategorije' : cat}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                    <div>
                        <label htmlFor="institution" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Institucija</label>
                        <select name="institution" id="institution" value={filters.institution} onChange={handleInputChange} className="w-full h-[42px] text-base pr-4 rounded-md input-depth">
                            {institutions.map(inst => <option key={inst} value={inst}>{inst === 'all' ? 'Vse institucije' : inst}</option>)}
                        </select>
                    </div>
                    <div>
                         <label htmlFor="eligibleEntity" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Upravičeni prijavitelj</label>
                        <select name="eligibleEntity" id="eligibleEntity" value={filters.eligibleEntity} onChange={handleInputChange} className="w-full h-[42px] text-base pr-4 rounded-md input-depth">
                             {eligibleEntities.map(entity => <option key={entity} value={entity}>{entity === 'all' ? 'Vsi tipi' : entity}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Rok prijave</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="date" name="deadlineStart" value={filters.deadlineStart} onChange={handleInputChange} className="w-full h-[42px] text-base px-2 rounded-md input-depth" />
                            <input type="date" name="deadlineEnd" value={filters.deadlineEnd} onChange={handleInputChange} className="w-full h-[42px] text-base px-2 rounded-md input-depth" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        onClick={handleSearchClick}
                        className="h-[42px] text-base px-6 py-2 rounded-md flex items-center justify-center gap-2 btn-primary"
                    >
                        <span>Filtriraj</span>
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                     <button
                        type="button"
                        onClick={onSaveSearchClick}
                        className="h-[42px] px-4 py-2 flex items-center justify-center gap-2 rounded-md btn-secondary"
                        aria-label="Shrani trenutno iskanje"
                    >
                        <SaveIcon className="w-5 h-5" />
                        <span>Shrani iskanje</span>
                    </button>
                </div>
                
                 <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      id="showUninteresting"
                      name="showUninteresting"
                      checked={filters.showUninteresting}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                    />
                    <label htmlFor="showUninteresting" className="text-sm font-medium text-slate-600 dark:text-slate-400">Pokaži nezanimive</label>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;