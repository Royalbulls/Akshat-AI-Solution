
import React, { useState, useRef } from 'react';
import { ComicPanel, CustomPersona } from '../types';
import { BookOpenIcon, SparklesIcon, DownloadIcon, ImageIcon, PlusIcon, UserIcon, TrashIcon, FaceSmileIcon, OmIcon } from './Icons';
import { generateComicScript, generateImage, analyzeCharacterFromImage } from '../services/geminiService';

const COMIC_GENRES = {
    "Cinematic & Artistic": ["Film Noir", "Watercolor", "Oil Painting", "Sketch", "Gothic", "Surrealism"],
    "Modern & Sci-Fi": ["Cyberpunk", "Steampunk", "Space Opera", "Post-Apocalyptic", "Solarpunk", "Retro-Futurism"],
    "Comics & Animation": ["Classic Superhero", "Manga", "Anime", "Graphic Novel", "Pixel Art", "Voxel Art", "Claymation"],
    "Cultural & Mythic": ["Indian Mythology", "Greek Mythology", "Norse Saga", "Samurai/Feudal Japan", "Medieval Fantasy", "Tribal Art"],
    "3D & Realistic": ["3D Render (Unreal Engine 5)", "Digital Sculpture", "Isometric 3D", "Photorealistic", "Hyper-Realistic"]
};

interface MultiverseComicViewProps {
    customPersonas?: CustomPersona[];
}

const MultiverseComicView: React.FC<MultiverseComicViewProps> = ({ customPersonas = [] }) => {
    const [premise, setPremise] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('Classic Superhero');
    const [customGenre, setCustomGenre] = useState('');
    const [language, setLanguage] = useState('English');
    const [panelCount, setPanelCount] = useState<number>(4);
    const [isGeneratingScript, setIsGeneratingScript] = useState(false);
    const [isBatchGenerating, setIsBatchGenerating] = useState(false);
    const [panels, setPanels] = useState<ComicPanel[]>([]);
    
    // Casting State
    const [heroImage, setHeroImage] = useState<File | null>(null);
    const [costarImage, setCostarImage] = useState<File | null>(null);
    const [selectedHeroPersonaId, setSelectedHeroPersonaId] = useState<string>('');
    const [selectedCostarPersonaId, setSelectedCostarPersonaId] = useState<string>('');
    
    const heroInputRef = useRef<HTMLInputElement>(null);
    const costarInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (f: File | null) => void) => {
        if (e.target.files?.[0]) setFile(e.target.files[0]);
    };

    const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });

    const handleGenerateScript = async () => {
        if (!premise.trim()) return;
        setIsGeneratingScript(true);
        setPanels([]); // Clear previous
        const finalStyle = customGenre.trim() ? customGenre : selectedGenre;
        
        try {
            let heroDesc = undefined;
            let costarDesc = undefined;
            let heroPersonaInstruction = undefined;
            let costarPersonaInstruction = undefined;

            // Process Hero (Persona OR Image)
            if (selectedHeroPersonaId) {
                const persona = customPersonas.find(p => p.id === selectedHeroPersonaId);
                if (persona) {
                    heroPersonaInstruction = persona.instruction;
                    // Use persona avatar description or name/summary if available
                    heroDesc = persona.avatarDescription || `A character embodying the persona: ${persona.name}. Visual style matches: ${finalStyle}`;
                }
            } 
            if (heroImage) {
                const base64 = await fileToBase64(heroImage);
                // Image analysis overrides generic persona description for visuals to match the photo
                heroDesc = await analyzeCharacterFromImage(base64);
            }

            // Process Co-Star (Persona OR Image)
            if (selectedCostarPersonaId) {
                const persona = customPersonas.find(p => p.id === selectedCostarPersonaId);
                if (persona) {
                    costarPersonaInstruction = persona.instruction;
                    costarDesc = persona.avatarDescription || `A character embodying the persona: ${persona.name}. Visual style matches: ${finalStyle}`;
                }
            }
            if (costarImage) {
                const base64 = await fileToBase64(costarImage);
                costarDesc = await analyzeCharacterFromImage(base64);
            }

            const script = await generateComicScript(
                premise, 
                finalStyle, 
                panelCount, 
                language, 
                heroDesc, 
                costarDesc, 
                heroPersonaInstruction, 
                costarPersonaInstruction
            );
            setPanels(script);
        } catch (error) {
            alert("Failed to generate script. Please try again.");
            console.error(error);
        } finally {
            setIsGeneratingScript(false);
        }
    };

    const handleGeneratePanelImage = async (panelId: number) => {
        const panel = panels.find(p => p.id === panelId);
        if (!panel) return;

        setPanels(prev => prev.map(p => p.id === panelId ? { ...p, imageStatus: 'generating' } : p));
        
        try {
            const imageUrl = await generateImage(panel.description);
            setPanels(prev => prev.map(p => p.id === panelId ? { ...p, imageUrl, imageStatus: 'done' } : p));
        } catch (error: any) {
            const msg = error?.message || "Generation failed";
            setPanels(prev => prev.map(p => p.id === panelId ? { ...p, imageStatus: 'error' } : p));
            if(!isBatchGenerating) alert(msg);
        }
    };

    const handleGenerateAllImages = async () => {
        if (panels.length === 0) return;
        setIsBatchGenerating(true);
        
        // Process sequentially to avoid heavy rate limiting issues
        for (const panel of panels) {
            if (!panel.imageUrl && panel.imageStatus !== 'generating') {
                await handleGeneratePanelImage(panel.id);
                // Small delay between requests to be polite to the API
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        setIsBatchGenerating(false);
    };

    const handleExportComic = () => {
        if (panels.length === 0) return;
        
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Comic Export</title>
                <style>
                    body { font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif; background: #f0f0f0; padding: 20px; }
                    h1 { text-align: center; }
                    .comic-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
                    .panel { background: white; border: 3px solid #000; box-shadow: 5px 5px 0px rgba(0,0,0,0.2); display: flex; flex-direction: column; }
                    .panel-image { width: 100%; height: auto; border-bottom: 2px solid #000; }
                    .panel-content { padding: 15px; flex: 1; }
                    .caption { background: #fff3cd; border: 1px solid #ffeeba; padding: 5px 10px; margin-bottom: 10px; font-style: italic; font-size: 0.9em; }
                    .dialogue { font-weight: bold; }
                    @media print { body { background: white; } .panel { break-inside: avoid; } }
                </style>
            </head>
            <body>
                <h1>Comic Strip</h1>
                <div class="comic-grid">
                    ${panels.map(panel => `
                        <div class="panel">
                            ${panel.imageUrl ? `<img src="${panel.imageUrl}" class="panel-image" alt="Panel ${panel.id}" />` : `<div style="height:200px; background:#ccc; display:flex; align-items:center; justify-content:center;">[Image Pending]</div>`}
                            <div class="panel-content">
                                ${panel.caption ? `<div class="caption">${panel.caption}</div>` : ''}
                                <div class="dialogue">"${panel.dialogue}"</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </body>
            </html>
        `;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Comic_Strip_${Date.now()}.html`;
        a.click();
    };

    return (
        <div className="h-full bg-gray-900 text-white p-4 md:p-6 overflow-y-auto animate-fade-in-slide-up">
            <header className="mb-8 border-b border-purple-500/30 pb-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-900/30 rounded-lg border border-purple-500/30">
                        <BookOpenIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-purple-100 tracking-wide">Multiverse Comic Creator</h1>
                        <p className="text-xs text-purple-400 uppercase tracking-widest">Powered by Gemini 3 Pro & Imagen 3</p>
                    </div>
                </div>
                {panels.length > 0 && (
                    <button 
                        onClick={handleExportComic}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 flex items-center gap-2 transition-colors"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        Export Comic (HTML)
                    </button>
                )}
            </header>

            {/* Configuration Panel */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8 shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Left Column: Story Details */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Story Premise / Idea</label>
                            <textarea 
                                value={premise}
                                onChange={(e) => setPremise(e.target.value)}
                                placeholder="e.g. A robot detective solves a mystery on Mars during a solar storm..."
                                rows={4}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Art Style</label>
                                <select 
                                    value={selectedGenre}
                                    onChange={(e) => { setSelectedGenre(e.target.value); setCustomGenre(''); }}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    {Object.entries(COMIC_GENRES).map(([category, genres]) => (
                                        <optgroup key={category} label={category}>
                                            {genres.map(g => <option key={g} value={g}>{g}</option>)}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                                <select 
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi (हिंदी)</option>
                                    <option value="Hinglish">Hinglish</option>
                                    <option value="Sanskrit">Sanskrit</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="Japanese">Japanese</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Length: {panelCount} Panels</label>
                            <input 
                                type="range" 
                                min="4" 
                                max="10" 
                                step="2"
                                value={panelCount}
                                onChange={(e) => setPanelCount(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>
                    </div>

                    {/* Right Column: Casting Call */}
                    <div className="bg-black/30 rounded-xl p-5 border border-purple-500/30 shadow-inner">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-purple-300 flex items-center gap-2">
                                <FaceSmileIcon className="w-6 h-6" /> 
                                Face-to-Comic Casting
                            </h3>
                            <span className="text-[10px] bg-purple-900 text-purple-200 px-2 py-1 rounded uppercase font-bold tracking-wider">Persona & Avatar Tech</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* Hero Section */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase">Main Hero</label>
                                {customPersonas.length > 0 && (
                                    <select
                                        value={selectedHeroPersonaId}
                                        onChange={(e) => setSelectedHeroPersonaId(e.target.value)}
                                        className="w-full bg-gray-800 text-xs text-white rounded border border-gray-600 p-1 mb-2"
                                    >
                                        <option value="">Select Persona (Optional)</option>
                                        {customPersonas.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                )}
                                <div className="relative group h-32">
                                    <input type="file" ref={heroInputRef} onChange={(e) => handleFileChange(e, setHeroImage)} accept="image/*" className="hidden" />
                                    <div 
                                        onClick={() => heroInputRef.current?.click()}
                                        className={`w-full h-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden ${heroImage ? 'border-green-500 bg-green-900/20' : 'border-gray-600 hover:border-purple-500 hover:bg-gray-800'}`}
                                    >
                                        {heroImage ? (
                                            <>
                                                <img src={URL.createObjectURL(heroImage)} alt="Hero" className="w-full h-full object-cover opacity-60" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                                                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md mb-1">Face Locked</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {selectedHeroPersonaId ? <OmIcon className="w-6 h-6 text-amber-400 mb-1" /> : <PlusIcon className="w-6 h-6 text-gray-400 mb-1" />}
                                                <span className="text-xs text-gray-300 text-center px-1">
                                                    {selectedHeroPersonaId ? "Using Persona Data" : "Upload Selfie"}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {heroImage && <button onClick={(e) => {e.stopPropagation(); setHeroImage(null)}} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white shadow-md hover:bg-red-600"><TrashIcon className="w-3 h-3"/></button>}
                                </div>
                            </div>

                            {/* Co-Star Section */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase">Co-Star / Villain</label>
                                {customPersonas.length > 0 && (
                                    <select
                                        value={selectedCostarPersonaId}
                                        onChange={(e) => setSelectedCostarPersonaId(e.target.value)}
                                        className="w-full bg-gray-800 text-xs text-white rounded border border-gray-600 p-1 mb-2"
                                    >
                                        <option value="">Select Persona (Optional)</option>
                                        {customPersonas.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                )}
                                <div className="relative group h-32">
                                    <input type="file" ref={costarInputRef} onChange={(e) => handleFileChange(e, setCostarImage)} accept="image/*" className="hidden" />
                                    <div 
                                        onClick={() => costarInputRef.current?.click()}
                                        className={`w-full h-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden ${costarImage ? 'border-green-500 bg-green-900/20' : 'border-gray-600 hover:border-purple-500 hover:bg-gray-800'}`}
                                    >
                                        {costarImage ? (
                                            <>
                                                <img src={URL.createObjectURL(costarImage)} alt="Co-Star" className="w-full h-full object-cover opacity-60" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                                                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md mb-1">Face Locked</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {selectedCostarPersonaId ? <OmIcon className="w-6 h-6 text-amber-400 mb-1" /> : <UserIcon className="w-6 h-6 text-gray-400 mb-1" />}
                                                <span className="text-xs text-gray-300 text-center px-1">
                                                    {selectedCostarPersonaId ? "Using Persona Data" : "Upload Photo"}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {costarImage && <button onClick={(e) => {e.stopPropagation(); setCostarImage(null)}} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white shadow-md hover:bg-red-600"><TrashIcon className="w-3 h-3"/></button>}
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-purple-200/70 mt-4 text-center italic">
                            "Select a Persona to infuse their personality into the dialogue, or upload a photo to lock their visual appearance."
                        </p>
                    </div>
                </div>

                <button 
                    onClick={handleGenerateScript}
                    disabled={isGeneratingScript || !premise.trim()}
                    className="mt-8 w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/30 text-lg"
                >
                    {isGeneratingScript ? (
                        <>
                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>{heroImage || costarImage || selectedHeroPersonaId ? 'Integrating Characters & Writing Script...' : 'Weaving the Narrative...'}</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-6 h-6" />
                            <span>Generate Comic Storyboard</span>
                        </>
                    )}
                </button>
            </div>

            {/* Action Bar for Panels */}
            {panels.length > 0 && (
                <div className="flex justify-between items-center mb-6 bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                    <h2 className="text-lg font-semibold text-white">Storyboard Preview</h2>
                    <button 
                        onClick={handleGenerateAllImages}
                        disabled={isBatchGenerating}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isBatchGenerating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <ImageIcon className="w-4 h-4" />}
                        {isBatchGenerating ? 'Rendering Panels...' : 'Generate All Panels'}
                    </button>
                </div>
            )}

            {/* Panels Grid */}
            {panels.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
                    {panels.map((panel) => (
                        <div key={panel.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden flex flex-col shadow-xl hover:border-purple-500/40 transition-colors">
                            <div className="relative aspect-[4/3] bg-black group">
                                {panel.imageUrl ? (
                                    <>
                                        <img src={panel.imageUrl} alt={`Panel ${panel.id}`} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                            <span className="text-xs text-white bg-purple-600 px-1.5 py-0.5 rounded">Panel {panel.id}</span>
                                        </div>
                                        <a 
                                            href={panel.imageUrl} 
                                            download={`comic-panel-${panel.id}.png`}
                                            className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                                        >
                                            <DownloadIcon className="w-5 h-5" />
                                        </a>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-6 text-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                                        <span className="absolute top-2 left-2 text-xs font-bold text-gray-600 border border-gray-700 px-2 py-1 rounded">Panel {panel.id}</span>
                                        {panel.imageStatus === 'generating' ? (
                                            <>
                                                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                                <p className="text-sm text-purple-300 animate-pulse">Dreaming up pixels...</p>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                                                <p className="text-xs max-w-xs opacity-50 italic line-clamp-3">{panel.description}</p>
                                            </>
                                        )}
                                    </div>
                                )}
                                {!panel.imageUrl && panel.imageStatus !== 'generating' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/40 transition-colors">
                                        <button 
                                            onClick={() => handleGeneratePanelImage(panel.id)}
                                            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform scale-95 group-hover:scale-100 transition-all opacity-80 group-hover:opacity-100"
                                        >
                                            Generate Art
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col bg-gray-800">
                                {panel.caption && (
                                    <div className="bg-yellow-100/10 border border-yellow-500/30 p-2 rounded mb-3">
                                        <p className="text-xs text-yellow-200 italic font-serif uppercase tracking-wide">{panel.caption}</p>
                                    </div>
                                )}
                                <div className="bg-white text-black p-3 rounded-lg border-2 border-black mb-3 flex-1 relative shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                                    {/* Speech bubble tail hack */}
                                    <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white border-b-2 border-r-2 border-black transform rotate-45"></div>
                                    <p className="text-sm font-bold font-sans leading-tight">"{panel.dialogue}"</p>
                                </div>
                                <div className="mt-auto pt-2 border-t border-gray-700">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Visual Prompt:</p>
                                    <p className="text-xs text-gray-400 line-clamp-2" title={panel.description}>
                                        {panel.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiverseComicView;
