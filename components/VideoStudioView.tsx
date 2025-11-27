
import React, { useState, useRef } from 'react';
import { FilmIcon, VideoCameraIcon, TrashIcon, PlusIcon, DownloadIcon } from './Icons';
import { startVideoGeneration, getVideoOperation } from '../services/geminiService';
import { Operation } from '@google/genai';

const loadingMessages = [
    "Lights, camera, action! 🎬",
    "Setting the scene...",
    "Directing the AI actors...",
    "Rendering frames...",
    "Adding visual effects...",
    "Finalizing the cut...",
    "Almost ready for premiere..."
];

const VideoStudioView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
    const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setCurrentVideoUrl(null);
        
        // Start loading animation
        const interval = setInterval(() => {
            setLoadingMsgIndex(prev => (prev + 1) % loadingMessages.length);
        }, 3000);

        try {
            let imagePart;
            if (imageFile) {
                const base64 = await fileToBase64(imageFile);
                imagePart = { imageBytes: base64, mimeType: imageFile.type };
            }

            const operation = await startVideoGeneration(prompt, aspectRatio, imagePart);
            await pollVideoStatus(operation);
        } catch (error: any) {
            alert(`Generation Failed: ${error.message}`);
            setIsGenerating(false);
        } finally {
            clearInterval(interval);
        }
    };

    const pollVideoStatus = async (operation: Operation) => {
        const checkStatus = async () => {
            try {
                const updatedOp = await getVideoOperation(operation);
                if (updatedOp.done) {
                    if (updatedOp.error) {
                        throw new Error(updatedOp.error.message);
                    } else {
                        const videoUri = updatedOp.response?.generatedVideos?.[0]?.video?.uri;
                        if (videoUri) {
                            setCurrentVideoUrl(`${videoUri}&key=${process.env.API_KEY}`);
                        }
                        setIsGenerating(false);
                    }
                } else {
                    setTimeout(checkStatus, 5000);
                }
            } catch (e: any) {
                alert(`Video polling failed: ${e.message}`);
                setIsGenerating(false);
            }
        };
        checkStatus();
    };

    return (
        <div className="h-full bg-gray-900 text-white p-4 md:p-8 overflow-y-auto animate-fade-in-slide-up">
            <header className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-6">
                <div className="p-3 bg-red-900/30 rounded-xl border border-red-500/30">
                    <FilmIcon className="w-8 h-8 text-red-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Video Creation Studio</h1>
                    <p className="text-gray-400">Turn text and images into cinematic videos with Veo.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                
                {/* Left: Creation Panel */}
                <div className="space-y-6 bg-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-xl">
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Prompt</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the video you want to create... (e.g., A futuristic city with flying cars in neon rain)"
                            rows={4}
                            className="w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Reference Image (Optional)</label>
                        <div className="relative h-40 group">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                accept="image/*" 
                                className="hidden" 
                            />
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`w-full h-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden ${imageFile ? 'border-green-500 bg-green-900/20' : 'border-gray-600 hover:border-red-500 hover:bg-gray-900'}`}
                            >
                                {imageFile ? (
                                    <>
                                        <img src={URL.createObjectURL(imageFile)} alt="Reference" className="w-full h-full object-cover opacity-60" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md mb-1">Image Loaded</span>
                                        </div>
                                        <button 
                                            onClick={(e) => {e.stopPropagation(); setImageFile(null);}} 
                                            className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-500"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <PlusIcon className="w-8 h-8" />
                                        <span className="text-sm font-medium">Upload Start Frame</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Aspect Ratio</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setAspectRatio('16:9')}
                                className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${aspectRatio === '16:9' ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-gray-700 bg-gray-900 text-gray-500 hover:border-gray-500'}`}
                            >
                                Landscape (16:9)
                            </button>
                            <button
                                onClick={() => setAspectRatio('9:16')}
                                className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${aspectRatio === '9:16' ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-gray-700 bg-gray-900 text-gray-500 hover:border-gray-500'}`}
                            >
                                Portrait (9:16)
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <VideoCameraIcon className="w-6 h-6" />
                                <span>Generate Video</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Right: Preview Monitor */}
                <div className="bg-black rounded-2xl border-4 border-gray-800 shadow-2xl flex flex-col overflow-hidden relative min-h-[400px]">
                    <div className="absolute top-0 left-0 right-0 p-4 z-10 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-xs font-mono text-red-500 uppercase tracking-widest">REC</span>
                        </div>
                        <span className="text-xs font-mono text-gray-500">VEO-3.1-PREVIEW</span>
                    </div>

                    <div className="flex-1 flex items-center justify-center bg-gray-900 relative">
                        {isGenerating ? (
                            <div className="text-center p-8">
                                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                                <h3 className="text-xl font-bold text-white animate-pulse">{loadingMessages[loadingMsgIndex]}</h3>
                                <p className="text-gray-500 mt-2">This may take a minute or two.</p>
                            </div>
                        ) : currentVideoUrl ? (
                            <div className="relative w-full h-full flex items-center justify-center bg-black">
                                <video 
                                    src={currentVideoUrl} 
                                    controls 
                                    autoPlay 
                                    loop 
                                    className="max-w-full max-h-full shadow-2xl"
                                />
                                <a 
                                    href={currentVideoUrl} 
                                    download={`akshat-video-${Date.now()}.mp4`}
                                    className="absolute bottom-4 right-4 bg-gray-800/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                                    title="Download Video"
                                >
                                    <DownloadIcon className="w-6 h-6" />
                                </a>
                            </div>
                        ) : (
                            <div className="text-center text-gray-600">
                                <FilmIcon className="w-24 h-24 mx-auto mb-4 opacity-20" />
                                <p className="text-lg">Ready to create.</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-gray-900 p-4 border-t border-gray-800">
                        <div className="flex justify-between items-center text-xs font-mono text-gray-500">
                            <span>FRAME: 00:00:00</span>
                            <span>RES: 720p</span>
                            <span>FPS: 24</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoStudioView;
