
import React, { useState, useEffect, useRef } from 'react';
import { ProfileData } from '../types';
import { GoogleGenAI } from "@google/genai";
import { PaperAirplaneIcon, PaperClipIcon, XCircleIcon } from './Icons';

interface AiChatPageProps {
    profile: ProfileData;
}

interface MessageFile {
    name: string;
    type: string;
    size: number;
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
    files?: MessageFile[];
}

const SUPPORTED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'text/plain',
    'text/csv',
    'text/markdown',
];

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


const AiChatPage: React.FC<AiChatPageProps> = ({ profile }) => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: 'Pozdravljen! Sem vaš Tenders.AI asistent. Kako vam lahko pomagam danes? Vprašajte me karkoli o razpisih, prijavah ali financiranju. Lahko tudi naložite dokument za analizo.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const allFiles = Array.from(event.target.files);
            const supportedFiles: File[] = [];
            const unsupportedFiles: File[] = [];

            allFiles.forEach(file => {
                if (SUPPORTED_MIME_TYPES.includes(file.type)) {
                    supportedFiles.push(file);
                } else {
                    unsupportedFiles.push(file);
                }
            });

            if (unsupportedFiles.length > 0) {
                const unsupportedFileNames = unsupportedFiles.map(f => f.name).join(', ');
                alert(`Naslednje datoteke imajo nepodprt format: ${unsupportedFileNames}.\n\nPodprti formati so PDF, PNG, JPG, WEBP, TXT, CSV, MD.`);
            }

            setFilesToUpload(prev => [...prev, ...supportedFiles]);
        }
        // Reset file input to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        setFilesToUpload(prev => prev.filter((_, i) => i !== index));
    };

    const fileToGenerativePart = async (file: File) => {
      const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                 resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to read file as data URL"));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
      
      const data = await base64EncodedDataPromise;
      return {
        inlineData: { data, mimeType: file.type },
      };
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && filesToUpload.length === 0) || isLoading) return;

        const userMessage: Message = { 
            sender: 'user', 
            text: input, 
            files: filesToUpload.map(f => ({ name: f.name, type: f.type, size: f.size }))
        };
        setMessages(prev => [...prev, userMessage]);
        
        const currentFiles = [...filesToUpload];
        setInput('');
        setFilesToUpload([]);
        setIsLoading(true);

        try {
            if (!process.env.API_KEY) {
                console.log("API_KEY not found. Falling back to a canned response.");
                setTimeout(() => {
                    const cannedResponse: Message = { sender: 'ai', text: 'Trenutno ne morem dostopiti do storitve AI. To je prednastavljen odgovor. Prosimo, preverite svojo API ključ konfiguracijo.' };
                    setMessages(prev => [...prev, cannedResponse]);
                    setIsLoading(false);
                }, 1000);
                return;
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const profileContext = `
              Kontekst podjetja:
              - Ime: ${profile.companyName || 'N/A'}
              - Industrija: ${profile.industry || 'N/A'}
              - Velikost: ${profile.companySize || 'N/A'}
              - Glavni cilji: ${profile.mainGoals || 'N/A'}
              - Opis projekta: ${profile.projectDescription || 'N/A'}
            `;
            
            const systemInstruction = `You are Tenders.AI, an expert assistant for public funding tenders in Slovenia. Your goal is to provide concise, helpful, and accurate advice. Use the provided company context to tailor your answers. Always reply in Slovenian. Keep your answers helpful but not overly long. If files are provided, analyze them and incorporate findings into your response.
            ${profileContext}
            `;

            // FIX: Explicitly type `parts` to allow both text and inline data objects.
            const parts: ({ text: string } | { inlineData: { data: string; mimeType: string; } })[] = [{ text: input }];
            if (currentFiles.length > 0) {
              for (const file of currentFiles) {
                parts.push(await fileToGenerativePart(file));
              }
            }

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: parts },
                config: { systemInstruction },
            });
            
            const aiMessage: Message = { sender: 'ai', text: response.text };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            const errorMessage: Message = { sender: 'ai', text: 'Oprostite, prišlo je do napake pri komunikaciji z AI. Poskusite znova kasneje.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700 h-[calc(100vh-8rem)] flex flex-col">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 dark:text-gray-100">AI pomočnik</h2>
                <p className="mt-1 text-base text-gray-600 dark:text-gray-400">Vaš osebni svetovalec za javne razpise.</p>
            </div>
            <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xl p-3 rounded-lg ${msg.sender === 'user' ? 'bg-brand text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                            {msg.text && <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>}
                            {msg.files && msg.files.length > 0 && (
                                <div className={`mt-2 space-y-2 ${msg.text ? 'border-t border-white/20 pt-2' : ''}`}>
                                    {msg.files.map((file, fileIndex) => (
                                        <div key={fileIndex} className="text-sm bg-black/20 rounded-md px-2 py-1 flex items-center gap-2">
                                            <PaperClipIcon className="w-4 h-4 flex-shrink-0" />
                                            <span>{file.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                           <div className="flex items-center gap-2 text-gray-500">
                               <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                               <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '75ms'}}></div>
                               <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                {filesToUpload.length > 0 && (
                    <div className="mb-3 p-3 border border-gray-300 dark:border-gray-600 rounded-md space-y-2 max-h-32 overflow-y-auto">
                        {filesToUpload.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <PaperClipIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0"/>
                                    <span className="text-sm text-gray-800 dark:text-gray-200 truncate">{file.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">({formatFileSize(file.size)})</span>
                                </div>
                                <button onClick={() => removeFile(index)} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-300">
                                    <XCircleIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" accept={SUPPORTED_MIME_TYPES.join(',')} />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="h-12 w-12 flex-shrink-0 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Pripni datoteko"
                    >
                        <PaperClipIcon className="w-6 h-6"/>
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Vnesite svoje vprašanje..."
                        className="flex-grow h-12 text-base px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-brand focus:border-brand"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={(!input.trim() && filesToUpload.length === 0) || isLoading}
                        className="h-12 w-12 flex-shrink-0 bg-brand text-white rounded-md flex items-center justify-center hover:bg-brand-dark transition-colors disabled:opacity-50"
                    >
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </form>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                    Podprti formati datotek: PDF, PNG, JPG, WEBP, TXT, CSV.
                </p>
            </div>
        </div>
    );
};

export default AiChatPage;
