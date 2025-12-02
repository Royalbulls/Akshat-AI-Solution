
import React, { useState, useEffect } from 'react';
import { CloseIcon, SparklesIcon, ImageIcon, SettingsIcon, BotIcon, PlusIcon, PencilIcon, TrashIcon, GitHubIcon, JournalIcon, AgentIcon, GlobeAltIcon, MapPinIcon, OmIcon, WrenchScrewdriverIcon, UserIcon, BriefcaseIcon, CpuChipIcon, BookOpenIcon, NewspaperIcon, ScaleIcon, MicrophoneIcon, ArrowRightOnRectangleIcon, DownloadIcon } from './Icons';
import { ChatMode, CustomPersona, ViewMode, PREDEFINED_PERSONAS, LEGENDARY_PERSONAS, AuthUser } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleGallery: () => void;
  onSelectKundliPersona: () => void;
  chatMode: ChatMode;
  setChatMode: (mode: ChatMode) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedPersonaId: string;
  setSelectedPersonaId: (id: string) => void;
  customPersonas: CustomPersona[];
  onShowPersonaModal: (persona?: CustomPersona) => void;
  onDeletePersona: (id: string) => void;
  authUser: AuthUser | null;
  onLogout: () => void;
}

const NavButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}> = ({ icon, label, isActive = false, onClick, children, className = '', disabled = false }) => {
    const activeClasses = 'bg-amber-600 text-white neon-glow-gold';
    const inactiveClasses = 'text-gray-300 hover:bg-gray-800 hover:text-white';
    const disabledClasses = 'text-gray-600 cursor-not-allowed';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 group ${isActive ? activeClasses : inactiveClasses} ${disabled ? disabledClasses : ''} ${className}`}
        >
            <div className="flex items-center">
                <span className="mr-3 opacity-80 group-hover:opacity-100 transition-opacity">{icon}</span>
                <span className="truncate">{label}</span>
            </div>
            <div>{children}</div>
        </button>
    );
};

const SidebarSection: React.FC<{
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => (
    <div className="border-b border-gray-800 pb-2 mb-2">
        <button 
            onClick={onToggle}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-amber-400 transition-colors focus:outline-none"
        >
            <span>{title}</span>
            <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
            </span>
        </button>
        <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            {children}
        </div>
    </div>
);


const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    onToggleGallery,
    onSelectKundliPersona,
    chatMode,
    setChatMode,
    viewMode,
    setViewMode,
    selectedPersonaId,
    setSelectedPersonaId,
    customPersonas,
    onShowPersonaModal,
    onDeletePersona,
    authUser,
    onLogout
}) => {
  // Force dark background for "Grey Black" look requested
  const sidebarClasses = `fixed inset-y-0 left-0 z-40 w-72 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`;
  
  // Collapsible sections state
  const [sections, setSections] = useState({
      modes: true,
      tools: true,
      media: true, // New section for Journalism
      experts: true, // New section for Experts
      legends: true, // New section for Legendary Personas
      core: false, // Collapsed by default
      custom: true,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const toggleSection = (section: keyof typeof sections) => {
      setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this persona? This will also remove its associated Kundli data.')) {
        onDeletePersona(id);
    }
  };

  // Filter Personas for Categories
  const mediaIds = ['bbc_news_ai', 'journalist_ai', 'crime_tak_ai', 'dainik_bhaskar_ai'];
  const expertIds = ['ai_business_cofounder', 'rba_advisor', 'legal_assistant_ai', 'medical_assistant', 'stock_market_guru_ai', 'bharat_ai_expert', 'historian_ai', 'space_explorer_ai', 'business_analyst', 'creative_writer', 'sanatan_dharm_expert'];
  const coreIds = ['creator', 'formal', 'creative', 'aura_companion'];

  const mediaPersonas = PREDEFINED_PERSONAS.filter(p => mediaIds.includes(p.id));
  const expertPersonas = PREDEFINED_PERSONAS.filter(p => expertIds.includes(p.id));
  const corePersonas = PREDEFINED_PERSONAS.filter(p => coreIds.includes(p.id));

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>}
      <aside className={sidebarClasses} aria-label="Sidebar">
        <div className="flex flex-col h-full text-gray-100 overflow-hidden">
            <div 
                className="flex items-center justify-between px-4 py-5 border-b border-gray-800 flex-shrink-0 cursor-pointer md:cursor-default hover:bg-gray-800/50 transition-colors"
                onClick={() => window.innerWidth < 768 && onClose()} // Touch header to close on mobile
                title="Tap to close menu on mobile"
            >
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-800 rounded-lg border border-gray-700">
                        <BotIcon className="w-6 h-6 text-amber-400"/>
                    </div>
                    <span className="text-lg font-bold text-white neon-text-gold tracking-wide">Akshat Platform</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-gray-400 hover:text-white md:hidden p-1 rounded-md hover:bg-gray-700 transition-colors" aria-label="Close sidebar">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
          
            <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <SidebarSection title="Modes" isOpen={sections.modes} onToggle={() => toggleSection('modes')}>
                    <NavButton icon={<SparklesIcon className="w-5 h-5 text-amber-400" />} label="Smart Mode" isActive={chatMode === 'smart' && viewMode === 'chat'} onClick={() => { setChatMode('smart'); setViewMode('chat'); }} />
                    <NavButton icon={<SparklesIcon className="w-5 h-5 text-purple-400" />} label="Deep Thinking" isActive={chatMode === 'think' && viewMode === 'chat'} onClick={() => { setChatMode('think'); setViewMode('chat'); }} />
                </SidebarSection>

                <SidebarSection title="Tools" isOpen={sections.tools} onToggle={() => toggleSection('tools')}>
                    <NavButton icon={<BriefcaseIcon className="w-5 h-5 text-blue-300" />} label="Strategic Advisory Hub" isActive={viewMode === 'business_hub'} onClick={() => setViewMode('business_hub')} />
                    <NavButton icon={<OmIcon className="w-5 h-5 text-amber-300" />} label="Predictive Analytics (Kundli)" isActive={viewMode === 'public_kundli'} onClick={() => setViewMode('public_kundli')} />
                    <NavButton icon={<BookOpenIcon className="w-5 h-5 text-purple-300" />} label="Multiverse Comics" isActive={viewMode === 'comic_creator'} onClick={() => setViewMode('comic_creator')} />
                    <NavButton icon={<AgentIcon className="w-5 h-5 text-green-300" />} label="Automation Studio" isActive={viewMode === 'agent'} onClick={() => setViewMode('agent')} />
                    <NavButton icon={<GlobeAltIcon className="w-5 h-5 text-indigo-300" />} label="Aura" isActive={viewMode === 'aura'} onClick={() => setViewMode('aura')} />
                    <NavButton icon={<CpuChipIcon className="w-5 h-5 text-cyan-300" />} label="Robotics & Wearables" isActive={viewMode === 'robotics'} onClick={() => setViewMode('robotics')} />
                    <NavButton icon={<ImageIcon className="w-5 h-5 text-pink-300" />} label="Image Library" onClick={onToggleGallery} />
                    <NavButton icon={<JournalIcon className="w-5 h-5 text-emerald-300" />} label="My Journal" isActive={viewMode === 'journal'} onClick={() => setViewMode('journal')} />
                    <div className="border-t border-gray-800 pt-1 mt-1">
                        <p className="px-3 py-1 text-xs font-bold text-gray-500 uppercase">Akshat Solution Platform</p>
                        <NavButton icon={<SettingsIcon className="w-5 h-5 text-gray-300" />} label="Settings" isActive={viewMode === 'settings'} onClick={() => setViewMode('settings')} />
                    </div>
                </SidebarSection>
                
                {/* Akshat Media House */}
                <SidebarSection title="Akshat Media House" isOpen={sections.media} onToggle={() => toggleSection('media')}>
                    {mediaPersonas.map(persona => (
                            <NavButton key={persona.id} icon={<NewspaperIcon className="w-5 h-5 text-red-400" />} label={persona.name} isActive={selectedPersonaId === persona.id} onClick={() => setSelectedPersonaId(persona.id)} />
                    ))}
                </SidebarSection>

                {/* Professional Experts */}
                <SidebarSection title="Professional Experts" isOpen={sections.experts} onToggle={() => toggleSection('experts')}>
                    {expertPersonas.map(persona => {
                        let icon = <ScaleIcon className="w-5 h-5" />; // Default
                        if (persona.id.includes('business') || persona.id.includes('rba') || persona.id.includes('stock')) icon = <BriefcaseIcon className="w-5 h-5 text-amber-300" />;
                        else if (persona.id.includes('medical')) icon = <PlusIcon className="w-5 h-5 text-red-300" />;
                        else if (persona.id.includes('historian') || persona.id.includes('writer')) icon = <BookOpenIcon className="w-5 h-5 text-yellow-300" />;
                        else if (persona.id.includes('sanatan')) icon = <OmIcon className="w-5 h-5 text-orange-400" />;
                        
                        return <NavButton key={persona.id} icon={icon} label={persona.name} isActive={selectedPersonaId === persona.id} onClick={() => setSelectedPersonaId(persona.id)} />
                    })}
                </SidebarSection>

                {/* Timeless Visionaries - NEW */}
                <SidebarSection title="Timeless Visionaries" isOpen={sections.legends} onToggle={() => toggleSection('legends')}>
                    {LEGENDARY_PERSONAS.map(persona => {
                        let icon = <BookOpenIcon className="w-5 h-5" />;
                        if (persona.id.includes('chanakya')) icon = <ScaleIcon className="w-5 h-5 text-orange-400" />;
                        if (persona.id.includes('kalam') || persona.id.includes('einstein')) icon = <SparklesIcon className="w-5 h-5 text-cyan-400" />;
                        if (persona.id.includes('vivekananda')) icon = <OmIcon className="w-5 h-5 text-yellow-400" />;
                        return (
                            <NavButton 
                                key={persona.id}
                                icon={icon} 
                                label={persona.name} 
                                isActive={selectedPersonaId === persona.id}
                                onClick={() => setSelectedPersonaId(persona.id)}
                            />
                        );
                    })}
                </SidebarSection>

                {/* Core Companions */}
                <SidebarSection title="Core Companions" isOpen={sections.core} onToggle={() => toggleSection('core')}>
                    {corePersonas.map(persona => {
                        const isAura = persona.id === 'aura_companion';
                        return (
                            <NavButton 
                                key={persona.id} 
                                icon={isAura ? <SparklesIcon className="w-5 h-5 text-pink-400" /> : <BotIcon className="w-5 h-5" />} 
                                label={persona.name} 
                                isActive={selectedPersonaId === persona.id} 
                                onClick={() => setSelectedPersonaId(persona.id)} 
                            />
                        );
                    })}
                </SidebarSection>

                <SidebarSection title="Your Personas" isOpen={sections.custom} onToggle={() => toggleSection('custom')}>
                    <div className="space-y-1">
                         {customPersonas.map(persona => {
                            const isKundliPersona = persona.id.startsWith('kundli-');
                            const icon = isKundliPersona ? <OmIcon className="w-5 h-5 text-amber-300" /> : <UserIcon className="w-5 h-5" />;
                            return (
                                <NavButton key={persona.id} icon={icon} label={persona.name} isActive={selectedPersonaId === persona.id} onClick={() => setSelectedPersonaId(persona.id)}>
                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/80 rounded">
                                        {isKundliPersona ? (
                                             <button onClick={(e) => { e.stopPropagation(); onSelectKundliPersona(); }} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded" aria-label={`Edit ${persona.name} Kundli Details`}><PencilIcon className="w-4 h-4" /></button>
                                        ) : (
                                             <button onClick={(e) => { e.stopPropagation(); onShowPersonaModal(persona); }} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded" aria-label={`Edit ${persona.name}`}><PencilIcon className="w-4 h-4" /></button>
                                        )}
                                       
                                        <button onClick={(e) => handleDelete(e, persona.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded" aria-label={`Delete ${persona.name}`}><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </NavButton>
                            );
                         })}
                         <button 
                            onClick={() => onShowPersonaModal()} 
                            className="w-full flex items-center justify-center gap-2 p-2 mt-2 text-sm text-gray-400 border border-dashed border-gray-700 rounded-md hover:text-white hover:border-gray-500 transition-all"
                         >
                            <PlusIcon className="w-4 h-4" />
                            <span>Create New Persona</span>
                         </button>
                    </div>
                </SidebarSection>
            </nav>

            {/* Install Prompt - Fixed at bottom if available */}
            {deferredPrompt && (
                <div className="px-4 py-2 border-t border-gray-800 bg-gray-900/50">
                     <button
                        onClick={handleInstallClick}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold text-amber-900 bg-gradient-to-r from-amber-500 to-amber-400 rounded-md hover:from-amber-400 hover:to-amber-300 transition-all shadow-lg animate-pulse"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        Install App
                    </button>
                </div>
            )}

            {/* User Profile & Logout */}
            {authUser && (
                <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">
                            {authUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{authUser.name}</p>
                            <p className="text-xs text-gray-500 truncate">{authUser.email}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/30 rounded-md hover:bg-red-500 hover:text-white transition-all"
                    >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
