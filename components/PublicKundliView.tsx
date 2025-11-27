
import React, { useState } from 'react';
import { PublicKundliPersona, KundliDetails } from '../types';
import { getCoordinatesForPlace, getTimezoneForPlace } from '../services/geminiService';
import { OmIcon, SearchIcon, LinkIcon, BotIcon, UserIcon, DnaIcon, PlusIcon } from './Icons';

type ViewState = 'welcome' | 'create' | 'creating' | 'success' | 'gallery' | 'create_ansh' | 'creating_ansh';

interface KundliSubFormProps {
    title: string;
    details: Partial<KundliDetails>;
    onDetailsChange: (newDetails: Partial<KundliDetails>) => void;
}

const KundliSubForm: React.FC<KundliSubFormProps> = ({ title, details, onDetailsChange }) => {
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [geocodingError, setGeocodingError] = useState<string | null>(null);

    const handleFindCoordinates = async () => {
        if (!details.pob?.trim()) return;
        setIsGeocoding(true);
        setGeocodingError(null);
        try {
            const [coords, timezone] = await Promise.all([
                getCoordinatesForPlace(details.pob.trim()),
                getTimezoneForPlace(details.pob.trim())
            ]);
            onDetailsChange({ ...details, lat: coords.lat, lon: coords.lon, tzone: timezone.tzone });
        } catch (error: any) {
            setGeocodingError(error.message);
        } finally {
            setIsGeocoding(false);
        }
    };
    
    return (
        <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
             <h3 className="text-lg font-semibold text-amber-300">{title}</h3>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input type="text" value={details.name || ''} onChange={(e) => onDetailsChange({...details, name: e.target.value})} placeholder="Name" className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500" required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
                    <input type="date" value={details.dob || ''} onChange={(e) => onDetailsChange({...details, dob: e.target.value})} className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Time of Birth</label>
                    <input type="time" value={details.tob || ''} onChange={(e) => onDetailsChange({...details, tob: e.target.value})} className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Place of Birth</label>
                <div className="flex items-center gap-2">
                    <input type="text" value={details.pob || ''} onChange={(e) => { onDetailsChange({...details, pob: e.target.value}); setGeocodingError(null); }} placeholder="e.g., Delhi, India" className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500" required />
                    <button type="button" onClick={handleFindCoordinates} disabled={!details.pob?.trim() || isGeocoding} className="p-3 bg-amber-600 text-white rounded-md hover:bg-amber-500 disabled:bg-gray-600 flex-shrink-0" title="Auto-detect coordinates">
                        {isGeocoding ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <SearchIcon className="w-5 h-5" />}
                    </button>
                </div>
                {geocodingError && <p className="text-xs text-red-400 mt-1">{geocodingError}</p>}
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Latitude</label>
                    <input type="number" step="any" value={details.lat !== undefined ? details.lat : ''} onChange={(e) => onDetailsChange({...details, lat: e.target.value === '' ? undefined : parseFloat(e.target.value)})} placeholder="e.g., 28.6139" className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Longitude</label>
                    <input type="number" step="any" value={details.lon !== undefined ? details.lon : ''} onChange={(e) => onDetailsChange({...details, lon: e.target.value === '' ? undefined : parseFloat(e.target.value)})} placeholder="e.g., 77.2090" className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Timezone</label>
                    <input type="number" step="any" value={details.tzone !== undefined ? details.tzone : ''} onChange={(e) => onDetailsChange({...details, tzone: e.target.value === '' ? undefined : parseFloat(e.target.value)})} placeholder="e.g., 5.5" className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500" required />
                </div>
            </div>
        </div>
    );
};


interface PublicKundliViewProps {
    personas: PublicKundliPersona[];
    onCreatePersona: (details: KundliDetails) => Promise<{id: string, summary: string}>;
    onCreateAnshPersona: (detailsA: KundliDetails, detailsB: KundliDetails) => Promise<{id: string, summary: string}>;
    onUpdatePersona: (persona: PublicKundliPersona) => void;
    onChatWithPersona: (id: string) => void;
}

const PublicKundliView: React.FC<PublicKundliViewProps> = ({ personas, onCreatePersona, onCreateAnshPersona, onUpdatePersona, onChatWithPersona }) => {
    const [viewState, setViewState] = useState<ViewState>('welcome');
    const [newPersona, setNewPersona] = useState<{id: string, summary: string} | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [parentADetails, setParentADetails] = useState<Partial<KundliDetails>>({});
    const [parentBDetails, setParentBDetails] = useState<Partial<KundliDetails>>({});

    const handleCreate = async (details: KundliDetails) => {
        setViewState('creating');
        try {
            const result = await onCreatePersona(details);
            setNewPersona(result);
            setViewState('success');
        } catch (error) {
            alert(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
            setViewState('create');
        }
    };

    const handleCreateAnsh = async () => {
        const isAValid = parentADetails.name && parentADetails.dob && parentADetails.tob && parentADetails.pob && parentADetails.lat !== undefined && parentADetails.lon !== undefined && parentADetails.tzone !== undefined;
        const isBValid = parentBDetails.name && parentBDetails.dob && parentBDetails.tob && parentBDetails.pob && parentBDetails.lat !== undefined && parentBDetails.lon !== undefined && parentBDetails.tzone !== undefined;
        if (isAValid && isBValid) {
            setViewState('creating_ansh');
            try {
                const result = await onCreateAnshPersona(parentADetails as KundliDetails, parentBDetails as KundliDetails);
                setNewPersona(result);
                setViewState('success');
            } catch (error) {
                alert(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
                setViewState('create_ansh');
            }
        }
    };
    
    const handleCopyToClipboard = () => {
        if (newPersona?.id) {
            navigator.clipboard.writeText(newPersona.id).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        }
    };

    const resetView = () => {
        setViewState('welcome');
        setNewPersona(null);
        setParentADetails({});
        setParentBDetails({});
    };

    const renderContent = () => {
        switch(viewState) {
            case 'welcome':
                return (
                     <div className="animate-fade-in-slide-up space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <button onClick={() => setViewState('create')} className="w-full flex-1 p-4 bg-gray-700 rounded-lg text-left hover:bg-gray-600 transition-colors shadow-lg">
                                <h3 className="text-lg font-semibold flex items-center gap-2"><LinkIcon className="w-5 h-5" />Create AI Persona</h3>
                                <p className="text-sm text-gray-400 mt-1">Generate a chat-capable AI persona from your birth chart. Interact with your astrological self.</p>
                            </button>
                             <button onClick={() => setViewState('create_ansh')} className="w-full flex-1 p-4 bg-amber-600 rounded-lg text-left hover:bg-amber-500 transition-colors shadow-lg">
                                <h3 className="text-lg font-semibold flex items-center gap-2"><DnaIcon className="w-5 h-5" />Synthesize Digital Ansh</h3>
                                <p className="text-sm text-amber-200 mt-1">Combine two birth charts to generate and chat with a synthesized 'Ansh' persona.</p>
                            </button>
                        </div>
                         <button onClick={() => setViewState('gallery')} className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-lg text-left hover:bg-gray-700 transition-colors shadow-lg">
                            <h3 className="text-lg font-semibold flex items-center gap-2"><UserIcon className="w-5 h-5" />Persona Database</h3>
                            <p className="text-sm text-gray-400 mt-1">View and chat with your saved Kundli personas.</p>
                        </button>
                    </div>
                );
            case 'gallery':
                return (
                    <div className="animate-fade-in-slide-up w-full">
                        <button onClick={resetView} className="text-sm text-amber-400 mb-4">&larr; Back to Dashboard</button>
                        <h3 className="text-2xl font-bold text-white mb-4">Persona Database</h3>
                        {personas.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No personas found in the database.</p>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {personas.map(p => (
                                    <div key={p.id} className="bg-gray-900/50 p-4 rounded-lg flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white truncate flex items-center gap-2">
                                                {p.parents ? <DnaIcon className="w-4 h-4 text-amber-300 flex-shrink-0" /> : <UserIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                                                {p.details.name}
                                            </p>
                                            {p.parents && <p className="text-xs text-amber-300 truncate font-semibold ml-6">Synthesis of {p.parents.nameA} & {p.parents.nameB}</p>}
                                            <p className="text-xs text-gray-400 truncate italic ml-6">"{p.personalitySummary}"</p>
                                        </div>
                                        <button onClick={() => onChatWithPersona(p.id)} className="px-4 py-2 text-sm font-semibold bg-amber-600 text-white rounded-md hover:bg-amber-500 transition-colors flex-shrink-0">
                                            Chat
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'create':
                 const isCreateFormValid = parentADetails.name && parentADetails.dob && parentADetails.tob && parentADetails.pob && parentADetails.lat !== undefined && parentADetails.lon !== undefined && parentADetails.tzone !== undefined;
                 return (
                    <div className="animate-fade-in-slide-up">
                        <button onClick={resetView} className="text-sm text-amber-400 mb-4">&larr; Back to Dashboard</button>
                        <KundliSubForm title="Input Parameters" details={parentADetails} onDetailsChange={setParentADetails} />
                        <button onClick={() => handleCreate(parentADetails as KundliDetails)} disabled={!isCreateFormValid} className="mt-4 w-full px-5 py-3 text-base font-semibold bg-amber-600 text-white rounded-md hover:bg-amber-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                            Generate Analytical Persona
                        </button>
                    </div>
                );
            case 'create_ansh':
                const isAnshFormValid = parentADetails.name && parentADetails.dob && parentADetails.tob && parentADetails.pob && parentADetails.lat !== undefined && parentADetails.lon !== undefined && parentADetails.tzone !== undefined &&
                                      parentBDetails.name && parentBDetails.dob && parentBDetails.tob && parentBDetails.pob && parentBDetails.lat !== undefined && parentBDetails.lon !== undefined && parentBDetails.tzone !== undefined;
                return (
                     <div className="animate-fade-in-slide-up">
                        <button onClick={resetView} className="text-sm text-amber-400 mb-4">&larr; Back to Dashboard</button>
                        <div className="flex flex-col lg:flex-row items-start gap-4">
                            <div className="w-full"><KundliSubForm title="Dataset A" details={parentADetails} onDetailsChange={setParentADetails} /></div>
                            <div className="self-center text-amber-400 p-4 hidden lg:block"><PlusIcon className="w-8 h-8"/></div>
                            <div className="w-full"><KundliSubForm title="Dataset B" details={parentBDetails} onDetailsChange={setParentBDetails} /></div>
                        </div>
                        <button onClick={handleCreateAnsh} disabled={!isAnshFormValid} className="mt-4 w-full px-5 py-3 text-base font-semibold bg-amber-600 text-white rounded-md hover:bg-amber-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                            Synthesize Integrated Persona
                        </button>
                    </div>
                );
             case 'creating':
             case 'creating_ansh':
                return (
                     <div className="text-center p-6 animate-fade-in-slide-up">
                        <BotIcon className="w-12 h-12 text-amber-400 mx-auto animate-pulse-icon" />
                        <h3 className="text-xl font-bold text-white mt-4">{viewState === 'creating_ansh' ? 'Synthesizing Integrated Persona...' : 'Generating Analytical Profile...'}</h3>
                        <p className="text-gray-400 mt-2">{viewState === 'creating_ansh' ? 'Deep learning algorithms are merging astrological datasets.' : 'Analyzing planetary positions to construct personality matrix.'}</p>
                     </div>
                );
            case 'success':
                 if (!newPersona) return null;
                 return (
                    <div className="text-center p-6 bg-green-900/50 border border-green-500 rounded-lg animate-fade-in-slide-up">
                        <h3 className="text-xl font-bold text-green-300">Persona Generation Complete</h3>
                        <div className="my-4 p-4 bg-gray-900/50 rounded-lg">
                           <p className="text-sm text-gray-400 mb-2">Analysis Summary:</p>
                           <p className="text-white italic">"{newPersona.summary}"</p>
                        </div>
                        <p className="text-gray-300 mt-4">The persona has been saved to your database. You can now chat with it.</p>
                        <div className="flex flex-col md:flex-row gap-3 mt-4">
                             <button onClick={() => onChatWithPersona(newPersona.id)} className="w-full px-6 py-3 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-500">
                                Chat Now
                            </button>
                            <button onClick={resetView} className="w-full md:w-auto px-6 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500">
                                Return
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="p-4 md:p-6 h-full flex flex-col items-center justify-center text-white bg-gray-900">
            <div className="w-full max-w-4xl bg-gray-800/50 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-700">
                <div className="text-center mb-6">
                    <OmIcon className="w-12 h-12 text-amber-300 mx-auto mb-3" />
                    <h2 className="text-3xl font-bold neon-text-gold">Predictive Analytics (Kundli)</h2>
                    <p className="text-gray-400 mt-1">Data-driven astrological computations and persona synthesis using deep learning on planetary data.</p>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default PublicKundliView;
