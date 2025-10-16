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
        <label htmlFor={name} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{label}</label>
        <input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-11 text-base px-4 rounded-md input-depth"
        />
    </div>
);

const TextareaField: React.FC<{label: string, name: keyof ProfileData, value: string, onChange, placeholder?: string, rows?: number}> = 
    ({label, name, value, onChange, placeholder, rows = 4}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full text-base p-4 rounded-md resize-y input-depth"
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
        <div className="rounded-xl ui-element-depth">
             <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100">Profil podjetja</h2>
                <p className="mt-1 text-base text-slate-600 dark:text-slate-400">Izpolnite te podatke, da bo lahko AI pomočnik bolje razumel vaše potrebe in vam ponudil prilagojene nasvete.</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">(Izbirno, a priporočljivo za boljše rezultate AI asistenta)</p>
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
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField 
                            label="Velikost podjetja (število zaposlenih)"
                            name="companySize"
                            value={formData.companySize}
                            onChange={handleChange}
                            placeholder="Npr. 1-10 (Startup), 11-50 (MSP), 50+"
                        />
                        <InputField 
                            label="Spletna stran podjetja"
                            name="companyWebsite"
                            value={formData.companyWebsite}
                            onChange={handleChange}
                            placeholder="https://www.vase-podjetje.si"
                        />
                    </div>
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
                        rows={5}
                    />
                    <TextareaField
                        label="Izkušnje s pridobivanjem sredstev"
                        name="fundingExperience"
                        value={formData.fundingExperience}
                        onChange={handleChange}
                        placeholder="Opišite vaše pretekle izkušnje z javnimi razpisi ali drugimi viri financiranja."
                        rows={3}
                    />
                    <TextareaField
                        label="Ključne tehnologije / strokovno znanje"
                        name="keyTechnologies"
                        value={formData.keyTechnologies}
                        onChange={handleChange}
                        placeholder="Naštejte ključne tehnologije, ki jih uporabljate, ali področja, kjer imate največ znanja (npr. umetna inteligenca, biotehnologija, trajnostna gradnja)."
                        rows={3}
                    />
                </div>
                <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end items-center gap-4 rounded-b-xl">
                    {isSaved && <p className="text-green-600 dark:text-green-400 font-semibold animate-fade-in">Spremembe shranjene!</p>}
                    <button type="submit" className="h-11 font-bold px-6 py-2 rounded-md flex items-center gap-2 btn-primary text-white">
                        <SaveIcon />
                        Shrani profil
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;