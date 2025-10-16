import React from 'react';

const InstitutionLogo: React.FC<{ institutionName: string; className?: string }> = ({ institutionName, className = 'w-12 h-12' }) => {
    
    const DefaultLogo = () => (
        <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md ${className}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="w-2/3 h-2/3 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M9 21v-3.07a2 2 0 01.15-.767L10.5 13m3 8v-3.07a2 2 0 00-.15-.767L12 13m-3 8h6" />
            </svg>
        </div>
    );
    
    const SpsLogo = () => (
        <div className={`flex items-center justify-center bg-[#004a8f] rounded-md p-1 ${className}`}>
            <span className="text-white font-bold text-center text-lg leading-none tracking-tighter">SPS</span>
        </div>
    );

    const ArsktrpLogo = () => (
        <div className={`flex items-center justify-center bg-[#6c8d2d] rounded-md p-1 ${className}`}>
            <span className="text-white font-bold text-center text-[10px] leading-tight">AKTRP</span>
        </div>
    );
    
    const SpiritLogo = () => (
         <div className={`flex items-center justify-center bg-gray-800 dark:bg-gray-200 rounded-md p-1 ${className}`}>
            <span className="text-white dark:text-gray-800 font-bold text-center text-xs leading-none">SPIRIT<br/>SLO</span>
        </div>
    );
    
    const MinistryLogo = () => (
        <div className={`flex items-center justify-center bg-transparent rounded-md p-0.5 ${className}`}>
             <svg className="w-full h-full text-gray-500 dark:text-gray-400" viewBox="0 0 512 512" fill="currentColor">
               <path d="M256 32L0 192v32h48v224h416V224h48v-32L256 32zm0 44.5L440.1 192H71.9L256 76.5zM112 256h32v128h-32V256zm96 0h32v128h-32V256zm96 0h32v128h-32V256zm96 0h32v128h-32V256z"/>
             </svg>
        </div>
    );
    
    const SidBankaLogo = () => (
         <div className={`flex items-center justify-center bg-[#e4002b] rounded-md p-1 ${className}`}>
            <span className="text-white font-bold text-center text-xl leading-none">SID</span>
        </div>
    );

    let logoComponent;
    if (institutionName.includes('Slovenski podjetniški sklad')) {
        logoComponent = <SpsLogo />;
    } else if (institutionName.includes('Agencija RS za kmetijske trge')) {
        logoComponent = <ArsktrpLogo />;
    } else if (institutionName.includes('SPIRIT')) {
        logoComponent = <SpiritLogo />;
    } else if (institutionName.includes('Ministrstvo')) {
        logoComponent = <MinistryLogo />;
    } else if (institutionName.includes('SID banka')) {
        logoComponent = <SidBankaLogo />;
    } else {
        logoComponent = <DefaultLogo />;
    }

    return logoComponent;
};

export default InstitutionLogo;
