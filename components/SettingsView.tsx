
import React, { useState, useEffect } from 'react';
import { AppSettings, UserProfile, VoiceName, ViewMode, AVAILABLE_VOICES } from '../types';
import { TrashIcon, UserIcon, SparklesIcon, SpeakerWaveIcon, MapPinIcon, InfoIcon, ShieldCheckIcon, HistoryIcon, SettingsIcon, BotIcon, PencilIcon } from './Icons';

interface SettingsViewProps {
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  appSettings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  isTracking: boolean;
  onToggleTracking: () => void;
  onClearAllData: () => void;
  onClearChat: () => void;
  setViewMode: (mode: ViewMode) => void;
  onToggleAboutModal: () => void;
  onTogglePrivacyModal: () => void;
}

const SettingsSection: React.FC<{ title: string; description: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, description, icon, children }) => (
  <section className="bg-gray-900/60 p-6 rounded-xl border border-amber-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm hover:border-amber-500/40 transition-colors duration-300">
    <div className="flex items-start gap-4 mb-4">
      <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 flex-shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
          {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
    </div>
    <div className="space-y-5 border-t border-gray-700/50 pt-5 mt-2">
      {children}
    </div>
  </section>
);

const SettingsRow: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
    <div className="flex items-center justify-between">
        <label className="font-medium text-gray-200">{label}</label>
        {children}
    </div>
);

const SettingsView: React.FC<SettingsViewProps> = ({ userProfile, onSaveProfile, appSettings, onSaveSettings, isTracking, onToggleTracking, onClearAllData, onClearChat, setViewMode, onToggleAboutModal, onTogglePrivacyModal }) => {
  const [name, setName] = useState(userProfile.name || '');
  // Editable preferences list
  const [preferences, setPreferences] = useState(userProfile.preferences.join('\n'));
  const [summary, setSummary] = useState(userProfile.conversationSummary || '');
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSaveProfile = () => {
    setSaveStatus('saving');
    // Simulate a brief network/processing delay for better UX
    setTimeout(() => {
        onSaveProfile({
            ...userProfile,
            name: name,
            preferences: preferences.split('\n').filter(p => p.trim() !== ''),
            conversationSummary: summary
        });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  const handleClearMemory = () => {
      if (window.confirm("Are you sure you want to clear the Learned Preferences and Conversation Summary? This will reset Akshat's long-term memory of you.")) {
          setPreferences('');
          setSummary('');
          onSaveProfile({
              ...userProfile,
              name: name,
              preferences: [],
              conversationSummary: ''
          });
      }
  };

  const handleClearData = () => {
    if (window.confirm("Are you absolutely sure you want to delete ALL of Akshat's data? This includes chat history, personas, journal entries, and all settings. This action cannot be undone.")) {
      onClearAllData();
      alert("All data has been cleared. The application will now reload.");
      window.location.reload();
    }
  };

  const handleCopyId = () => {
    if (!userProfile.universalUserID || copySuccess) return;
    navigator.clipboard.writeText(userProfile.universalUserID).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="p-4 md:p-6 h-full text-white animate-fade-in-slide-up bg-black/40 overflow-y-auto">
      <header className="mb-8 border-b border-gray-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/20 rounded-full border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <SettingsIcon className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold text-white neon-text-gold">Settings</h2>
        </div>
        <p className="text-gray-400 ml-1">Customize your Akshat experience and manage data.</p>
      </header>

      <div className="space-y-8 max-w-4xl mx-auto pb-12">
        <SettingsSection title="Profile & Memory" description="Manage what Akshat remembers about you for a hyper-personalized experience." icon={<UserIcon className="w-6 h-6" />}>
          <div>
            <label htmlFor="user-name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
            <input
              id="user-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How should Akshat address you?"
              className="w-full bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all p-2.5 shadow-inner"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="user-preferences" className="block text-sm font-medium text-gray-300 mb-1">Learned Preferences</label>
                <p className="text-xs text-gray-500 mb-2">Akshat extracts these facts from your chats. Edit them to correct the AI. One per line.</p>
                <textarea
                  id="user-preferences"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g. Loves sci-fi movies&#10;Working on a startup&#10;Prefer concise answers"
                  rows={6}
                  className="w-full bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-y transition-all p-2.5 shadow-inner font-mono text-sm"
                />
              </div>
              <div>
                <label htmlFor="user-summary" className="block text-sm font-medium text-gray-300 mb-1">Context Summary</label>
                <p className="text-xs text-gray-500 mb-2">A long-term memory summary of your ongoing conversations.</p>
                <textarea
                  id="user-summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Summary of previous chats..."
                  rows={6}
                  className="w-full bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-y transition-all p-2.5 shadow-inner font-mono text-sm"
                />
              </div>
          </div>

           <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Your Unique ID</label>
              <div className="flex items-center gap-2">
                  <input
                      type="text"
                      readOnly
                      value={userProfile.universalUserID || 'Generating...'}
                      className="w-full bg-gray-900 text-gray-400 rounded-lg border border-gray-700 font-mono text-xs p-2.5"
                      aria-label="Your unique anonymous user ID"
                  />
                  <button onClick={handleCopyId} className="px-4 py-2.5 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 border border-gray-600 transition-colors flex-shrink-0 font-medium">
                      {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">This anonymous ID helps Akshat remember you. Keep it safe if you want to restore your profile on a new device.</p>
          </div>
          <div className="flex justify-between items-center pt-2">
            <button onClick={handleClearMemory} className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors">
                Clear Context Memory
            </button>
            <button 
                onClick={handleSaveProfile} 
                disabled={saveStatus === 'saving'}
                className={`px-6 py-2.5 text-sm font-semibold text-white rounded-lg shadow-lg transition-all duration-200 ${saveStatus === 'saved' ? 'bg-green-600 hover:bg-green-500' : 'bg-amber-600 hover:bg-amber-500 hover:shadow-amber-500/20'}`}
            >
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Profile & Memory'}
            </button>
          </div>
        </SettingsSection>
        
        <SettingsSection title="Application" description="Customize appearance, voice, and information." icon={<SparklesIcon className="w-6 h-6" />}>
            <SettingsRow label="Theme">
              <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-lg border border-gray-700">
                  <button onClick={() => onSaveSettings({...appSettings, theme: 'light'})} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${appSettings.theme === 'light' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>Light</button>
                  <button onClick={() => onSaveSettings({...appSettings, theme: 'dark'})} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${appSettings.theme === 'dark' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>Dark</button>
              </div>
            </SettingsRow>
             <div>
                <label htmlFor="default-voice" className="block text-sm font-medium text-gray-300 mb-1">Default Voice</label>
                <select
                    id="default-voice"
                    value={appSettings.defaultVoice}
                    onChange={(e) => onSaveSettings({...appSettings, defaultVoice: e.target.value as VoiceName})}
                    className="w-full bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 p-2.5"
                >
                    {AVAILABLE_VOICES.map(voice => (
                        <option key={voice.name} value={voice.name}>{voice.description}</option>
                    ))}
                </select>
            </div>
            <div className="text-right pt-2">
                <button onClick={onTogglePrivacyModal} className="text-sm text-gray-400 hover:text-white font-medium hover:underline transition-colors">Privacy Policy</button>
            </div>
        </SettingsSection>

        <SettingsSection title="Privacy & Data" description="Manage your personal data and location settings." icon={<ShieldCheckIcon className="w-6 h-6" />}>
            <SettingsRow label="Location History (Timeline)">
              <label htmlFor="tracking-toggle" className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="tracking-toggle" className="sr-only peer" checked={isTracking} onChange={onToggleTracking} />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </SettingsRow>
            <SettingsRow label="View Your Timeline">
              <button onClick={() => setViewMode('timeline')} className="text-sm text-amber-400 hover:text-amber-300 font-medium hover:underline transition-colors flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" /> View History
              </button>
            </SettingsRow>
        </SettingsSection>

        <section className="bg-red-950/20 p-6 rounded-xl border border-red-500/30 shadow-[0_0_15px_rgba(220,38,38,0.05)]">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-red-500/10 rounded-lg text-red-400 border border-red-500/20">
                 <HistoryIcon className="w-6 h-6" />
             </div>
             <h3 className="text-lg font-bold text-red-400">Danger Zone</h3>
          </div>
          <p className="text-sm text-gray-400 mb-6 border-b border-red-900/30 pb-4">These actions are irreversible. Please be certain before proceeding.</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-200">Clear Chat History</p>
                  <p className="text-xs text-gray-500">Deletes the current conversation from your browser.</p>
                </div>
                <button
                  onClick={onClearChat}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600/10 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-600 hover:text-white transition-all font-semibold"
                >
                  Clear Chat
                </button>
            </div>
            <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-200">Clear All Application Data</p>
                  <p className="text-xs text-gray-500">Deletes chat history, personas, journal, timeline, and all settings.</p>
                </div>
                <button
                  onClick={handleClearData}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-500 shadow-lg hover:shadow-red-500/20 transition-all font-semibold"
                >
                  <TrashIcon className="w-4 h-4" />
                  Clear All Data
                </button>
            </div>
          </div>
        </section>

        <footer className="mt-12 text-center border-t border-gray-800 pt-8 pb-4">
            <BotIcon className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <h3 className="text-gray-500 font-semibold">Akshat AI Solution</h3>
            <p className="text-xs text-gray-600 mt-1 mb-4">Enterprise Intelligence Platform</p>
            <button 
                onClick={onToggleAboutModal}
                className="px-6 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 hover:text-white transition-all text-sm font-medium border border-gray-700 shadow-sm"
            >
                About Akshat
            </button>
        </footer>
      </div>
    </div>
  );
};

export default SettingsView;
