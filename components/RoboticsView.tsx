
import React, { useState, useEffect } from 'react';
import { CpuChipIcon, WifiIcon, BoltIcon, CubeTransparentIcon, SearchIcon, SendIcon } from './Icons';

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'scanning';
  battery: number;
  lastSync: string;
}

const RoboticsView: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Akshat Vision Pro', type: 'AR Glasses', status: 'connected', battery: 82, lastSync: 'Just now' },
    { id: '2', name: 'Gemini Rover Mk.II', type: 'Drone', status: 'disconnected', battery: 0, lastSync: '2 hours ago' },
    { id: '3', name: 'Neural Link Alpha', type: 'BCI', status: 'connected', battery: 95, lastSync: '1 min ago' },
  ]);
  const [commandLog, setCommandLog] = useState<{ time: string, type: 'input' | 'system', text: string }[]>([
      { time: new Date().toLocaleTimeString(), type: 'system', text: 'System initialized. Neural handshake complete.' }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleConnect = (id: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'connected' ? 'disconnected' : 'connected' } : d));
    addLog(`Device ${id} connection status changed.`);
  };

  const handleScan = () => {
    setIsScanning(true);
    addLog('Scanning for nearby Gemini-compatible devices...');
    setTimeout(() => {
        setIsScanning(false);
        addLog('Scan complete. No new devices found.');
    }, 3000);
  };

  const addLog = (text: string, type: 'input' | 'system' = 'system') => {
      setCommandLog(prev => [...prev, { time: new Date().toLocaleTimeString(), type, text }]);
  };

  const handleSendCommand = (e: React.FormEvent) => {
      e.preventDefault();
      if (!commandInput.trim()) return;
      addLog(commandInput, 'input');
      
      // Simulate AI processing command
      setTimeout(() => {
          const responses = [
              "Command received. Executing sequence...",
              "Analyzing telemetry data...",
              "Route plotted. Engaging autonomous navigation.",
              "Diagnostic complete. Systems nominal.",
              "Visual feed synchronized."
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          addLog(randomResponse);
      }, 800);
      
      setCommandInput('');
  };

  // Scroll log to bottom
  const logEndRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commandLog]);

  return (
    <div className="h-full bg-gray-950 text-cyan-50 p-4 md:p-6 overflow-y-auto animate-fade-in-slide-up font-mono">
      <header className="mb-8 border-b border-cyan-900/50 pb-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-900/30 rounded-lg border border-cyan-500/30">
                <CpuChipIcon className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-cyan-100 tracking-wider">GEMINI ROBOTICS HUB</h1>
                <p className="text-xs text-cyan-600 uppercase tracking-widest">Future Vision Integration System v3.1</p>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Status & Devices */}
        <div className="space-y-6">
            {/* System Status */}
            <div className="bg-gray-900/50 border border-cyan-800/50 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                    <CubeTransparentIcon className="w-24 h-24 text-cyan-400" />
                </div>
                <h2 className="text-sm font-semibold text-cyan-400 mb-4 uppercase">System Status</h2>
                <div className="space-y-4 relative z-10">
                    <div>
                        <div className="flex justify-between text-xs mb-1 text-gray-400">
                            <span>Neural Link Stability</span>
                            <span className="text-green-400">98%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full w-[98%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-1 text-gray-400">
                            <span>CPU Load (Gemini Core)</span>
                            <span className="text-amber-400">42%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full w-[42%] shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                        </div>
                    </div>
                     <div>
                        <div className="flex justify-between text-xs mb-1 text-gray-400">
                            <span>Bandwidth</span>
                            <span className="text-cyan-400">2.4 GB/s</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-cyan-500 h-full w-[75%] shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Device List */}
            <div className="bg-gray-900/50 border border-cyan-800/50 rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-semibold text-cyan-400 uppercase">Connected Nodes</h2>
                    <button onClick={handleScan} disabled={isScanning} className="p-2 bg-cyan-900/50 rounded-md hover:bg-cyan-800 transition-colors disabled:opacity-50">
                         {isScanning ? <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div> : <SearchIcon className="w-4 h-4 text-cyan-300" />}
                    </button>
                </div>
                <div className="space-y-3">
                    {devices.map(device => (
                        <div key={device.id} className={`p-3 rounded-lg border ${device.status === 'connected' ? 'bg-cyan-950/30 border-cyan-700/50' : 'bg-gray-900 border-gray-800'} transition-all`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={`text-sm font-bold ${device.status === 'connected' ? 'text-white' : 'text-gray-500'}`}>{device.name}</h3>
                                    <p className="text-xs text-gray-500">{device.type}</p>
                                </div>
                                <button onClick={() => handleConnect(device.id)} className={`p-1.5 rounded-md ${device.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/10 text-red-500/50'}`}>
                                    <WifiIcon className="w-4 h-4" />
                                </button>
                            </div>
                            {device.status === 'connected' && (
                                <div className="mt-3 flex items-center gap-3 text-xs text-gray-400 border-t border-cyan-900/30 pt-2">
                                    <div className="flex items-center gap-1">
                                        <BoltIcon className="w-3 h-3 text-yellow-500" />
                                        <span>{device.battery}%</span>
                                    </div>
                                    <div>Sync: {device.lastSync}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column: Command Interface */}
        <div className="lg:col-span-2 flex flex-col h-[600px] lg:h-auto bg-black border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-gray-900 p-3 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-gray-500 font-mono">Gemini_Core_Terminal_v9</div>
            </div>
            
            {/* Logs */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2 font-mono text-sm bg-opacity-50 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                 {commandLog.map((log, i) => (
                     <div key={i} className={`${log.type === 'input' ? 'text-cyan-300 text-right' : 'text-green-400 text-left'} animate-fade-in-slide-up`}>
                         <span className="text-gray-600 text-xs mr-2">[{log.time}]</span>
                         {log.type === 'input' && <span className="mr-2 text-purple-400">USER&gt;</span>}
                         {log.text}
                     </div>
                 ))}
                 <div ref={logEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendCommand} className="p-4 bg-gray-900 border-t border-gray-800 flex gap-3">
                <span className="text-green-500 py-3">&gt;</span>
                <input 
                    type="text" 
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="Enter command sequence..."
                    className="flex-1 bg-transparent border-none outline-none text-green-400 placeholder-gray-600 font-mono"
                    autoFocus
                />
                <button type="submit" className="text-cyan-500 hover:text-cyan-300 disabled:opacity-50">
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default RoboticsView;
