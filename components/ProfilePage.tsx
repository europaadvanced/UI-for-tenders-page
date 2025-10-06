
import React, { useState } from 'react';
import { ProfileData } from '../types';
import { SaveIcon } from './Icons';

interface ProfilePageProps {
    profile: ProfileData;
    onSave: (newProfile: ProfileData) => void;
}

const InputField: React.FC<{label: string, name: keyof ProfileData, value: string, onChange, placeholder?: string}> = 
    ({label, name, value, onChange, placeholder}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-11 text-base px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-brand focus:border-brand"
        />
    </div>
);

const TextareaField: React.FC<{label: string, name: keyof ProfileData, value: string, onChange, placeholder?: string, rows?: number}> = 
    ({label, name, value, onChange, placeholder, rows = 4}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full text-base p-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-brand focus:border-brand resize-y"
        />
    </div>
);


const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onSave }) => {
    const [formData, setFormData] = useState<ProfileData>(profile);
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (isSaved) setIsSaved(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700">
             <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 dark:text-gray-100">Profil podjetja</h2>
                <p className="mt-1 text-base text-gray-600 dark:text-gray-400">Izpolnite te podatke, da bo lahko AI pomočnik bolje razumel vaše potrebe in vam ponudil prilagojene nasvete.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="p-4 sm:p-6 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <InputField 
                            label="Ime podjetja"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Npr. Inovacije d.o.o."
                        />
                        <InputField 
                            label="Industrija"
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            placeholder="Npr. Informacijska tehnologija"
                        />
                     </div>
                     <InputField 
                        label="Velikost podjetja (število zaposlenih)"
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                        placeholder="Npr. 1-10 (Startup), 11-50 (MSP), 50+"
                    />
                    <TextareaField
                        label="Glavni cilji vašega podjetja"
                        name="mainGoals"
                        value={formData.mainGoals}
                        onChange={handleChange}
                        placeholder="Na kratko opišite, kaj želite doseči v naslednjih 1-3 letih. Npr. 'Razvoj novega SaaS produkta, širitev na tuje trge, povečanje proizvodnih kapacitet.'"
                    />
                    <TextareaField
                        label="Opis projekta, za katerega iščete financiranje"
                        name="projectDescription"
                        value={formData.projectDescription}
                        onChange={handleChange}
                        placeholder="Opišite projekt, s katerim se nameravate prijaviti na razpise. Npr. 'Digitalizacija prodajnih poti z uvedbo nove CRM in e-commerce platforme.'"
                        rows={6}
                    />
                </div>
                <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end items-center gap-4">
                    {isSaved && <p className="text-green-600 dark:text-green-400 font-semibold animate-fade-in">Spremembe shranjene!</p>}
                    <button type="submit" className="h-11 bg-brand text-white font-bold px-6 py-2 rounded-md hover:bg-brand-dark transition-colors flex items-center gap-2">
                        <SaveIcon />
                        Shrani profil
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;