
import React, { useState, useEffect } from 'react';
import { ActivityIcon, ServerIcon, CheckCircleIcon, XCircleIcon, SignalIcon, ShieldCheckIcon, CpuChipIcon, MegaphoneIcon } from './Icons';

const SystemHealthView: React.FC = () => {
    const [scanProgress, setScanProgress] = useState(0);
    const [isScanning, setIsScanning] = useState(true);
    const [launchStatus, setLaunchStatus] = useState<'standby' | 'launching' | 'live'>('standby');
    const [launchLog, setLaunchLog] = useState<string[]>([]);

    useEffect(() => {
        // Initial System Scan
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    return 100;
                }
                return prev + 5;
            });
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const handleLaunch = () => {
        setLaunchStatus('launching');
        const steps = [
            "Initializing Core Neural Engine...",
            "Connecting to Mumbai Region Servers...",
            "Optimizing Hindi/Hinglish Language Models...",
            "Syncing Kundli Planetary Database...",
            "Securing Financial Advisory Gateways...",
            "Verifying Google Cloud Partner Credentials...",
            "Deploying to 'Bharat Scale' Infrastructure...",
            "Establishing Uplink..."
        ];

        let stepIndex = 0;
        const launchInterval = setInterval(() => {
            if (stepIndex >= steps.length) {
                clearInterval(launchInterval);
                setLaunchStatus('live');
                setLaunchLog(prev => [...prev, "🚀 LAUNCH SUCCESSFUL. SYSTEM IS LIVE."]);
            } else {
                setLaunchLog(prev => [...prev, steps[stepIndex]]);
                stepIndex++;
            }
        }, 800);
    };

    const services = [
        { name: 'Text Generation Core', status: 'Operational', latency: '24ms', version: 'Gemini 2.5-Flash' },
        { name: 'Thinking Engine', status: 'Operational', latency: '450ms', version: 'Gemini 2.5-Pro' },
        { name: 'Visual Processing Unit', status: 'Operational', latency: '110ms', version: 'Vision Pro' },
        { name: 'Image Synthesis Module', status: 'Operational', latency: '2.1s', version: 'Imagen 3.0' },
        { name: 'Video Rendering Pipeline', status: 'Standby', latency: 'High', version: 'Veo 3.1' },
        { name: 'Audio/Speech Bridge', status: 'Operational', latency: '35ms', version: 'TTS-V2' }
    ];

    return (
        <div className="h-full bg-gray-950 text-white p-6 overflow-y-auto animate-fade-in-slide-up font-mono">
            
            <header className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-900/20 rounded-lg border border-green-500/30">
                        <ActivityIcon className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-wider uppercase">Mission Control</h1>
                        <p className="text-xs text-gray-500">Akshat Solution Health Check • Region: Asia-South1 (Mumbai)</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${launchStatus === 'live' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'} shadow-[0_0_8px_rgba(34,197,94,0.8)]`}></span>
                    <span className={`text-sm font-bold ${launchStatus === 'live' ? 'text-green-400' : 'text-amber-400'}`}>
                        {launchStatus === 'live' ? 'LIVE GLOBALLY' : 'SYSTEM READY'}
                    </span>
                </div>
            </header>

            {isScanning ? (
                <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
                    <div className="w-full max-w-md bg-gray-900 rounded-full h-4 overflow-hidden border border-gray-700">
                        <div 
                            className="bg-amber-500 h-full transition-all duration-75 shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                            style={{ width: `${scanProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-amber-400 font-mono animate-pulse">Running System Verification... {scanProgress}%</p>
                    <div className="text-xs text-gray-500 space-y-1 text-center">
                        <p>Verifying API Handshake...</p>
                        <p>Checking Neural Pathways...</p>
                        <p>Auditing Local Storage Vault...</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    
                    {/* Launch Control Panel */}
                    <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        
                        {launchStatus === 'standby' && (
                            <div className="relative z-10 flex flex-col items-center justify-center py-8 gap-4">
                                <h2 className="text-2xl font-bold text-white text-center">READY FOR DEPLOYMENT</h2>
                                <p className="text-gray-400 text-center max-w-lg">All systems go. Enterprise modules loaded. Safety protocols active.</p>
                                <button 
                                    onClick={handleLaunch}
                                    className="group relative px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full text-xl shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-all transform hover:scale-105"
                                >
                                    <span className="flex items-center gap-3">
                                        <MegaphoneIcon className="w-6 h-6 animate-pulse" />
                                        INITIATE PUBLIC LAUNCH
                                    </span>
                                    <div className="absolute inset-0 rounded-full border-4 border-white/10 animate-ping"></div>
                                </button>
                            </div>
                        )}

                        {(launchStatus === 'launching' || launchStatus === 'live') && (
                            <div className="relative z-10">
                                <div className="h-48 overflow-y-auto font-mono text-sm bg-black/50 p-4 rounded-lg border border-gray-700 mb-4 shadow-inner">
                                    {launchLog.map((log, i) => (
                                        <p key={i} className="text-green-400 border-l-2 border-green-600 pl-2 mb-1 animate-fade-in-slide-up">
                                            <span className="text-gray-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                            {log}
                                        </p>
                                    ))}
                                </div>
                                {launchStatus === 'live' && (
                                    <div className="text-center bg-green-500/20 border border-green-500/50 p-4 rounded-lg animate-bubble-pop-in">
                                        <h3 className="text-xl font-bold text-green-300">✨ AKSHAT AI IS NOW LIVE ✨</h3>
                                        <p className="text-green-200/80 text-sm">Serving users at Bharat Scale.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Top Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-900/60 border border-green-500/30 p-6 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircleIcon className="w-6 h-6 text-green-400" />
                                <h3 className="text-lg font-bold text-green-100">System Status</h3>
                            </div>
                            <p className="text-3xl font-bold text-white">OPERATIONAL</p>
                            <p className="text-xs text-green-400 mt-1">99.9% Uptime (Last 24h)</p>
                        </div>

                        <div className="bg-gray-900/60 border border-gray-700 p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <SignalIcon className="w-6 h-6 text-amber-400" />
                                <h3 className="text-lg font-bold text-gray-100">Network Latency</h3>
                            </div>
                            <p className="text-3xl font-bold text-white">42<span className="text-lg text-gray-500 ml-1">ms</span></p>
                            <p className="text-xs text-gray-400 mt-1">Optimal Connection</p>
                        </div>

                        <div className="bg-gray-900/60 border border-gray-700 p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <ShieldCheckIcon className="w-6 h-6 text-blue-400" />
                                <h3 className="text-lg font-bold text-gray-100">Security Protocol</h3>
                            </div>
                            <p className="text-xl font-bold text-white">LOCAL-FIRST</p>
                            <p className="text-xs text-gray-400 mt-1">End-to-End Encrypted</p>
                        </div>
                    </div>

                    {/* Service Grid */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">
                        <div className="p-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
                            <h3 className="font-bold text-gray-300 flex items-center gap-2">
                                <ServerIcon className="w-5 h-5" /> Active Services
                            </h3>
                            <span className="text-xs text-gray-500">Last Check: Just Now</span>
                        </div>
                        <div className="divide-y divide-gray-800">
                            {services.map((service, idx) => (
                                <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${service.status === 'Operational' ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]' : 'bg-yellow-500'}`}></div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-200">{service.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">{service.version}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs text-gray-500 font-mono">{service.latency}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${service.status === 'Operational' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                                            {service.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Certification Badge */}
                    <div className="flex justify-center mt-8">
                        <div className="px-6 py-3 bg-gradient-to-r from-amber-600/20 to-amber-500/10 border border-amber-500/30 rounded-full flex items-center gap-3">
                            <CpuChipIcon className="w-5 h-5 text-amber-400" />
                            <span className="text-sm font-bold text-amber-200 tracking-wider">GOOGLE CLOUD PARTNER READY</span>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default SystemHealthView;
