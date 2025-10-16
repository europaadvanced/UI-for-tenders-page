
import React from 'react';
import { SummaryData } from '../types';
import { ClipboardListIcon, CashIcon, CalendarIcon } from './Icons';

interface SummaryBarProps {
    data: SummaryData;
}

const formatCurrencyShort = (value: number) => {
    if (value >= 1_000_000) {
        return `€${(value / 1_000_000).toFixed(2)}M`;
    }
    if (value >= 1_000) {
        return `€${Math.round(value / 1000)}k`;
    }
    return new Intl.NumberFormat('sl-SI', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
};

const SummaryItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number | null; valueClassName?: string;}> = ({ icon, label, value, valueClassName = "text-base" }) => (
    <div className="bg-white dark:bg-slate-800/50 p-3 rounded-lg flex items-center gap-4 border border-slate-200 dark:border-slate-700/50">
        <div className="bg-brand/10 dark:bg-brand/20 p-2 rounded-full flex-shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className={`font-semibold text-slate-800 dark:text-slate-100 leading-tight ${valueClassName}`}>{value ?? 'N/A'}</p>
        </div>
    </div>
);


const SummaryBar: React.FC<SummaryBarProps> = ({ data }) => {
    const earliest = data.earliestDeadline ? new Date(data.earliestDeadline).toLocaleDateString('sl-SI') : null;
    const latest = data.latestDeadline ? new Date(data.latestDeadline).toLocaleDateString('sl-SI') : null;
    let dateValue: string | null = null;

    if (earliest && latest) {
        dateValue = earliest === latest ? earliest : `${earliest} - ${latest}`;
    } else {
        dateValue = earliest || latest;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <SummaryItem 
                icon={<ClipboardListIcon className="w-5 h-5 text-brand" />}
                label="Najdenih razpisov" 
                value={data.count} 
                valueClassName="text-lg"
            />
            <SummaryItem 
                icon={<CashIcon className="w-5 h-5 text-brand" />}
                label="Skupno financiranje" 
                value={data.count > 0 ? `${formatCurrencyShort(data.totalMin)} - ${formatCurrencyShort(data.totalMax)}` : '€0'} 
                valueClassName="text-base"
            />
            <SummaryItem 
                icon={<CalendarIcon className="w-5 h-5 text-brand" />}
                label="Obdobje rokov" 
                value={dateValue}
                valueClassName="text-base"
            />
        </div>
    );
};

export default SummaryBar;