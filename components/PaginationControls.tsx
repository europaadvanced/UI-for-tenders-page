
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
    <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <label htmlFor="items-per-page" className="text-sm font-medium text-gray-600 dark:text-gray-300">Prikaži:</label>
            <select 
                id="items-per-page"
                value={itemsPerPage}
                onChange={handleItemsChange}
                className="h-[42px] text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 focus:ring-brand focus:border-brand"
            >
                <option value="10">10</option>
                <option value="18">18</option>
                <option value="25">25</option>
            </select>
             <span className="text-sm text-gray-500 dark:text-gray-400">rezultatov</span>
        </div>
        
        <div className="flex items-center gap-4">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous Page"
            >
                <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <span className="text-base font-medium text-gray-600 dark:text-gray-300">
                Stran {currentPage} od {totalPages}
            </span>
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next Page"
            >
                <ArrowRightIcon className="w-5 h-5" />
            </button>
        </div>
    </div>
  );
};

export default PaginationControls;
