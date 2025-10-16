

import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from './Icons';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange
}) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  const handleItemsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onItemsPerPageChange(Number(e.target.value));
    onPageChange(1);
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <label htmlFor="items-per-page" className="text-sm font-medium text-slate-600 dark:text-slate-400">Prikaži:</label>
            <select 
                id="items-per-page"
                value={itemsPerPage}
                onChange={handleItemsChange}
                className="h-[42px] text-base rounded-md input-depth"
            >
                <option value="10">10</option>
                <option value="18">18</option>
                <option value="25">25</option>
            </select>
             <span className="text-sm text-slate-500 dark:text-slate-400">rezultatov</span>
        </div>
        
        <div className="flex items-center gap-4">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="p-2 rounded-md btn-secondary"
                aria-label="Previous Page"
            >
                <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <span className="text-base font-medium text-slate-600 dark:text-slate-300">
                Stran {currentPage} od {totalPages}
            </span>
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md btn-secondary"
                aria-label="Next Page"
            >
                <ArrowRightIcon className="w-5 h-5" />
            </button>
        </div>
    </div>
  );
};

export default PaginationControls;