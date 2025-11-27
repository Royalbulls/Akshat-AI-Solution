
import React from 'react';
import { BotIcon, MenuIcon, EyeIcon, DocumentTextIcon } from './Icons';
import { Mood, ChatMode } from '../types';
import MoodDisplay from './MoodDisplay';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleVisionMode: () => void;
  onSummarize: () => void;
  mood: Mood;
  chatMode: ChatMode;
  personaName: string;
  isSummarizing: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onToggleVisionMode, onSummarize, mood, chatMode, personaName, isSummarizing }) => {
  const modeIndicator = {
    smart: { text: 'Smart Core', classes: 'bg-blue-500/30 text-blue-300' },
    think: { text: 'Reasoning Engine', classes: 'bg-purple-500/30 text-purple-300' }
  };
  
  const currentMode = modeIndicator[chatMode];

  return (
    <header className="bg-gray-900/50 backdrop-blur-sm p-4 border-b border-gray-700 shadow-lg flex-shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleSidebar} 
            className="md:hidden p-2 text-gray-300 rounded-md hover:bg-gray-700"
            aria-label="Open sidebar menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <BotIcon className="w-8 h-8 text-amber-400"/>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white neon-text-gold">Akshat AI</h1>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${currentMode.classes}`}>
                  {currentMode.text}
                </span>
              </div>
              <p className="text-sm text-amber-400 truncate max-w-[200px] sm:max-w-xs">{`Enterprise Solution • ${personaName}`}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="hidden md:block">
                <MoodDisplay mood={mood} />
            </div>
            <button
                onClick={onSummarize}
                disabled={isSummarizing}
                className="p-2 text-gray-300 rounded-full hover:bg-gray-700/50 hover:text-amber-400 transition-colors relative"
                aria-label="Summarize Conversation"
                title="Save Context & Summarize Memory"
            >
                {isSummarizing ? (
                    <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <DocumentTextIcon className="w-6 h-6" />
                )}
            </button>
            <button
                onClick={onToggleVisionMode}
                className="p-2 text-gray-300 rounded-full hover:bg-gray-700/50 hover:text-amber-400 transition-colors"
                aria-label="Toggle Vision Mode"
                title="Activate Vision Core"
            >
                <EyeIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
