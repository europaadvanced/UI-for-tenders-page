
import React from 'react';
import { SortKey, SortDirection } from '../types';

interface SortBarProps {
  sortConfig: { key: SortKey; direction: SortDirection };
  onSortChange: (key: SortKey, direction: SortDirection) => void;
}

const sortOptions: { label: string; key: SortKey; direction: SortDirection }[] = [
    { label: 'Rok prijave (najstarejši)', key: 'deadline', direction: 'asc' },
    { label: 'Rok prijave (najnovejši)', key: 'deadline', direction: 'desc' },
    { label: 'Višina sredstev (najnižja)', key: 'fundingMax', direction: 'asc' },
    { label: 'Višina sredstev (najvižja)', key: 'fundingMax', direction: 'desc' },
];

const SortBar: React.FC<SortBarProps> = ({ sortConfig, onSortChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [key, direction] = e.target.value.split('-') as [SortKey, SortDirection];
    onSortChange(key, direction);
  };

  const currentValue = `${sortConfig.key}-${sortConfig.direction}`;

  return (
    <div className="flex justify-end items-center">
      <label htmlFor="sort-select" className="text-sm font-medium text-slate-600 dark:text-slate-400 mr-2">
        Razvrsti po:
      </label>
      <select
        id="sort-select"
        value={currentValue}
        onChange={handleChange}
        className="h-[42px] text-base rounded-md input-depth"
      >
        {sortOptions.map((option) => (
          <option key={`${option.key}-${option.direction}`} value={`${option.key}-${option.direction}`}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortBar;