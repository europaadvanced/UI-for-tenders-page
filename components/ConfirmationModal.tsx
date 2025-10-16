
import React from 'react';
import { CloseIcon, TrashIcon } from './Icons';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Izbriši", cancelText = "Prekliči" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="rounded-lg shadow-xl w-full max-w-md ui-element-depth">
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-heading font-bold text-gray-800 dark:text-gray-100">{title}</h3>
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Zapri modal">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-base text-gray-600 dark:text-gray-300">{message}</p>
                </div>
                <div className="flex justify-end items-center p-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg space-x-3">
                    <button
                        onClick={onCancel}
                        className="h-[42px] px-4 py-2 rounded font-semibold transition-colors btn-secondary text-gray-700 dark:text-gray-200"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="h-[42px] bg-red-600 text-white font-bold text-base px-6 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2 btn-primary"
                        style={{ backgroundImage: 'linear-gradient(to top right, #ef4444, #b91c1c)', borderColor: '#991b1b' }}
                    >
                        <TrashIcon className="w-5 h-5" />
                        <span>{confirmText}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;