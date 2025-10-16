import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ProfileData, SavedTender, Tender } from '../types';
import { GoogleGenAI } from "@google/genai";
import { PaperAirplaneIcon, PaperClipIcon, XCircleIcon, ChevronDownIcon, CashIcon, CalendarIcon, ChatAlt2Icon, TrashIcon, PencilIcon } from './Icons';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ConfirmationModal from './ConfirmationModal';

// --- TYPE DEFINITIONS ---
interface MessageFile { name: string; type: string; size: number; }
interface Message { sender: 'user' | 'ai'; text: string; files?: MessageFile[]; contextTenderId?: number; }
interface Conversation { id: string; name: string; messages: Message[]; contextTenderId?: number | null; }

// --- HELPER COMPONENTS & FUNCTIONS ---
const SUPPORTED_MIME_TYPES = [ 'image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain', 'text/csv', 'text/markdown' ];
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return { inlineData: { data: await base64EncodedDataPromise, mimeType: file.type } };
};

// --- MAIN COMPONENT ---
interface AiChatPageProps {
    profile: ProfileData;
    allTenders: Tender[];
    savedTenders: SavedTender[];
}

const AiChatPage: React.FC<AiChatPageProps> = ({ profile, allTenders, savedTenders }) => {
    const [conversations, setConversations] = useLocalStorage<Conversation[]>('aiConversations', []);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [selectedContextTenderId, setSelectedContextTenderId] = useState<number | null>(null);
    const [isTenderDetailsExpanded, setIsTenderDetailsExpanded] = useState(false);
    const [conversationToDeleteId, setConversationToDeleteId] = useState<string | null>(null);
    const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");

    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeConversation = useMemo(() => conversations.find(c => c.id === activeConversationId), [conversations, activeConversationId]);
    const selectedTenderDetails = useMemo(() => {
        const tender = allTenders.find(t => t.id === selectedContextTenderId);
        if (!tender) return null;
        const savedInfo = savedTenders.find(st => st.id === selectedContextTenderId);
        return { ...tender, nickname: savedInfo?.nickname };
    }, [allTenders, savedTenders, selectedContextTenderId]);

    useEffect(() => {
        if (conversations.length === 0) {
            handleNewConversation();
        } else if (!activeConversationId && conversations.length > 0) {
            setActiveConversationId(conversations[0].id);
        }
    }, [conversations, activeConversationId]);

    useEffect(() => {
        if (activeConversation) {
            setSelectedContextTenderId(activeConversation.contextTenderId || null);
        } else {
            setSelectedContextTenderId(null);
        }
    }, [activeConversation]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeConversation?.messages]);

    const handleNewConversation = () => {
        const newConversation: Conversation = { id: Date.now().toString(), name: 'Nova konverzacija', messages: [
            { sender: 'ai', text: 'Pozdravljen! Sem vaš Tenders.AI asistent. Kako vam lahko pomagam danes?' }
        ], contextTenderId: null };
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
    };

    const handleTenderContextSelect = (tenderId: number | null) => {
        const newSelectedId = selectedContextTenderId === tenderId ? null : tenderId;
        setSelectedContextTenderId(newSelectedId);
        if (activeConversationId) {
            setConversations(prev => prev.map(c => 
                c.id === activeConversationId ? { ...c, contextTenderId: newSelectedId } : c
            ));
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && filesToUpload.length === 0) || isLoading || !activeConversationId) return;

        const userMessage: Message = { sender: 'user', text: input, files: filesToUpload.map(f => ({ name: f.name, type: f.type, size: f.size })), contextTenderId: selectedContextTenderId };
        
        let conversationName = activeConversation?.name;
        if (conversationName === 'Nova konverzacija' && input.trim()) {
            conversationName = input.trim().split(' ').slice(0, 4).join(' ') + (input.trim().split(' ').length > 4 ? '...' : '');
        }
        
        setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, name: conversationName, messages: [...c.messages, userMessage] } : c));
        
        const currentFiles = [...filesToUpload];
        setInput(''); setFilesToUpload([]); setIsLoading(true);

        try {
            if (!process.env.API_KEY) { throw new Error("API_KEY not configured."); }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const profileContext = `Kontekst podjetja: Ime=${profile.companyName || 'N/A'}, Industrija=${profile.industry || 'N/A'}, Cilji=${profile.mainGoals || 'N/A'}`;
            const tenderContext = selectedTenderDetails ? `\n--- Priložen razpis: ${selectedTenderDetails.title} ---\n${selectedTenderDetails.summary}\n--- Konec razpisa ---` : '';
            const systemInstruction = `You are Tenders.AI, an expert assistant for public funding tenders in Slovenia. Provide concise, helpful, and accurate advice. Use the provided company and tender context to tailor your answers. Always reply in Slovenian. ${profileContext} ${tenderContext}`;
            
            const parts: ({ text: string } | { inlineData: { data: string; mimeType: string; } })[] = [{ text: input }];
            for (const file of currentFiles) { parts.push(await fileToGenerativePart(file)); }

            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: { parts }, config: { systemInstruction } });
            
            setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, messages: [...c.messages, { sender: 'ai', text: response.text }] } : c));
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, messages: [...c.messages, { sender: 'ai', text: 'Oprostite, prišlo je do napake. Preverite API ključ in poskusite znova.' }] } : c));
        } finally { setIsLoading(false); }
    };

    const startEditing = (conv: Conversation) => { setEditingConversationId(conv.id); setEditingName(conv.name); };
    const saveName = (id: string) => { setConversations(prev => prev.map(c => c.id === id ? {...c, name: editingName} : c)); setEditingConversationId(null); };

    return (
        <div className="h-[calc(100vh-8rem)] flex ui-element-depth rounded-xl overflow-hidden">
            <div className="w-1/3 max-w-xs bg-slate-100/50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <button onClick={handleNewConversation} className="w-full h-11 btn-secondary text-base">Nova konverzacija</button>
                </div>
                <div className="flex-grow overflow-y-auto p-2 space-y-1">
                    {conversations.map(conv => (
                        <div key={conv.id} className={`group flex items-center gap-2 rounded-lg cursor-pointer transition-colors ${activeConversationId === conv.id ? 'bg-brand/10 text-brand-dark dark:text-brand-light' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'}`}>
                            <div className="flex-grow flex items-center gap-2 p-2" onClick={() => setActiveConversationId(conv.id)}>
                                <ChatAlt2Icon className="w-5 h-5 shrink-0" />
                                {editingConversationId === conv.id ? (
                                    <input type="text" value={editingName} onChange={e => setEditingName(e.target.value)} onBlur={() => saveName(conv.id)} onKeyDown={e => e.key === 'Enter' && saveName(conv.id)} className="w-full bg-transparent p-1 rounded border border-brand" autoFocus />
                                ) : ( <span className="truncate text-sm font-medium">{conv.name}</span> )}
                            </div>
                            {editingConversationId !== conv.id && (
                                <div className="pr-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => startEditing(conv)} className="p-1.5 rounded hover:bg-slate-500/10"><PencilIcon className="w-4 h-4" /></button>
                                    <button onClick={() => setConversationToDeleteId(conv.id)} className="p-1.5 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-grow flex flex-col">
                <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4">
                    {activeConversation?.messages.map((msg, index) => (
                        <div key={index} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xl p-3 rounded-lg ${msg.sender === 'user' ? 'text-white bg-brand' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200'}`}>
                                {msg.text && <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>}
                                {msg.files && msg.files.length > 0 && <div className={`mt-2 space-y-2 ${msg.text ? `border-t ${msg.sender === 'user' ? 'border-white/20' : 'border-slate-200 dark:border-slate-600'} pt-2` : ''}`}>
                                    {msg.files.map((file, i) => <div key={i} className={`text-sm ${msg.sender === 'user' ? 'bg-black/20' : 'bg-slate-100 dark:bg-black/20'} rounded-md px-2 py-1 flex items-center gap-2`}><PaperClipIcon className="w-4 h-4 shrink-0" /><span>{file.name}</span></div>)}
                                </div>}
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="flex justify-start"><div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 p-3 rounded-lg"><div className="flex items-center gap-2 text-slate-500"><div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div><div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:75ms]"></div><div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:150ms]"></div></div></div></div>}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900">
                    {filesToUpload.length > 0 && <div className="mb-3 p-2 border border-slate-300 dark:border-slate-700 rounded-md space-y-2 max-h-32 overflow-y-auto">{filesToUpload.map((file, index) => <div key={index} className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 p-2 rounded"><div className="flex items-center gap-2 overflow-hidden"><PaperClipIcon className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0"/><span className="text-sm text-slate-800 dark:text-slate-200 truncate">{file.name}</span><span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">({formatFileSize(file.size)})</span></div><button onClick={() => setFilesToUpload(p => p.filter((_, i) => i !== index))} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-600 dark:hover:text-slate-300"><XCircleIcon className="w-5 h-5"/></button></div>)}</div>}
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="h-12 w-12 shrink-0 rounded-md flex items-center justify-center transition-colors btn-secondary" aria-label="Pripni datoteko"><PaperClipIcon className="w-6 h-6"/></button>
                        <input ref={fileInputRef} type="file" multiple onChange={e => { if (e.target.files) setFilesToUpload(p => [...p, ...Array.from(e.target.files).filter(f => SUPPORTED_MIME_TYPES.includes(f.type))]); if(fileInputRef.current) fileInputRef.current.value = ''; }} className="hidden" accept={SUPPORTED_MIME_TYPES.join(',')} />
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Vnesite svoje vprašanje..." className="flex-grow h-12 text-base px-4 rounded-md input-depth" disabled={isLoading} />
                        <button type="submit" disabled={(!input.trim() && filesToUpload.length === 0) || isLoading} className="h-12 w-12 shrink-0 text-white rounded-md flex items-center justify-center btn-primary"><PaperAirplaneIcon className="w-6 h-6" /></button>
                    </form>

                    <div className="mt-4">
                        {selectedTenderDetails && (
                            <div className="p-3 border border-brand/50 bg-brand/5 dark:bg-brand/10 rounded-lg animate-fade-in">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-grow">
                                        <p className="text-xs text-brand dark:text-brand-light font-semibold">PRILOŽEN RAZPIS ZA KONTEKST</p>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedTenderDetails.nickname || selectedTenderDetails.title}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button onClick={() => setIsTenderDetailsExpanded(p => !p)} className="text-sm font-semibold text-brand hover:underline">
                                            {isTenderDetailsExpanded ? 'Skrij' : 'Pokaži več'}
                                        </button>
                                        <button onClick={() => handleTenderContextSelect(null)} className="p-1 rounded-full text-slate-500 hover:text-red-500 hover:bg-red-500/10">
                                            <XCircleIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </div>
                                {isTenderDetailsExpanded && (
                                    <div className="mt-3 pt-3 border-t border-brand/20 text-sm text-slate-600 dark:text-slate-400 space-y-2 animate-fade-in-up">
                                        <p>{selectedTenderDetails.summary}</p>
                                        <div className="flex justify-between items-center text-xs pt-2">
                                            <div className="flex items-center gap-1.5"><CashIcon className="w-4 h-4"/><span>Do {new Intl.NumberFormat('sl-SI', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(selectedTenderDetails.fundingMax)}</span></div>
                                            <div className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4"/><span>Rok: {new Date(selectedTenderDetails.deadline).toLocaleDateString('sl-SI')}</span></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <details className="mt-2" open={!selectedTenderDetails}>
                            <summary className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                                Priloži shranjen razpis <ChevronDownIcon className="w-4 h-4"/>
                            </summary>
                            <div className="mt-2 p-2 border border-slate-200 dark:border-slate-700 rounded-md max-h-48 overflow-y-auto space-y-2">
                                {savedTenders.length > 0 ? (
                                    savedTenders.map(st => {
                                        const tender = allTenders.find(t => t.id === st.id);
                                        if (!tender) return null;
                                        const isSelected = selectedContextTenderId === st.id;
                                        return (
                                            <div key={st.id} className={`flex items-center justify-between gap-2 p-2 rounded-md transition-colors ${isSelected ? 'bg-brand/10' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>
                                                <div className="flex-grow overflow-hidden">
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{st.nickname || tender.title}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{tender.institution}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleTenderContextSelect(st.id)}
                                                    className={`h-9 px-4 rounded-md text-sm font-semibold transition-colors shrink-0 ${isSelected ? 'btn-secondary bg-red-100/50 dark:bg-red-900/50 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900' : 'btn-primary'}`}
                                                >
                                                    {isSelected ? 'Odstrani' : 'Izberi'}
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 p-2 text-center">Nimate shranjenih razpisov, ki bi jih lahko priložili.</p>
                                )}
                            </div>
                        </details>
                    </div>
                </div>
            </div>
            <ConfirmationModal isOpen={!!conversationToDeleteId} title="Izbriši konverzacijo" message="Ali ste prepričani? Dejanje je nepreklicno." onConfirm={() => {if(conversationToDeleteId) { setConversations(p => p.filter(c => c.id !== conversationToDeleteId)); if(activeConversationId === conversationToDeleteId) setActiveConversationId(null);} setConversationToDeleteId(null);}} onCancel={() => setConversationToDeleteId(null)} />
        </div>
    );
};

export default AiChatPage;
