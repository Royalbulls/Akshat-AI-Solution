
import React from 'react';
import { BotIcon, ShieldCheckIcon, SparklesIcon, BriefcaseIcon, GlobeAltIcon } from './Icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeatureRow: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
    <div className="flex gap-4 items-start">
        <div className="p-2 bg-gray-700/50 rounded-lg text-amber-400 flex-shrink-0">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-white text-sm">{title}</h4>
            <p className="text-sm text-gray-400 leading-relaxed">{text}</p>
        </div>
    </div>
);

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center bg-gradient-to-b from-gray-800 to-gray-900 border-b border-gray-700">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <BotIcon className="w-10 h-10 text-amber-400" />
            </div>
            <h2 id="about-modal-title" className="text-2xl font-bold text-white neon-text-gold">
                Akshat AI
            </h2>
            <p className="text-amber-500 font-medium text-sm uppercase tracking-widest mt-1">Enterprise Solution</p>
            <p className="text-gray-400 text-sm mt-3">Your all-in-one intelligent partner for business, creativity, and personal growth.</p>
        </div>
        
        <div className="p-6 space-y-6 bg-gray-900">
            <FeatureRow 
                icon={<BriefcaseIcon className="w-5 h-5" />}
                title="Business Intelligence"
                text="Create pitch decks, analyze markets, and plan your career with expert strategy tools."
            />
            <FeatureRow 
                icon={<SparklesIcon className="w-5 h-5" />}
                title="Creative Studio"
                text="Write books, generate comics, and design 3D concepts instantly."
            />
            <FeatureRow 
                icon={<GlobeAltIcon className="w-5 h-5" />}
                title="Smart Analysis"
                text="Deep insights via Predictive Analytics (Kundli) and real-time Vision."
            />
            <FeatureRow 
                icon={<ShieldCheckIcon className="w-5 h-5" />}
                title="Private & Secure"
                text="Built with a local-first architecture. Your data stays on your device."
            />
        </div>

        <footer className="p-4 bg-gray-800 border-t border-gray-700 flex justify-center">
            <button onClick={onClose} className="w-full py-2.5 text-sm font-bold text-gray-900 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors">
                Close
            </button>
        </footer>
      </div>
    </div>
  );
};

export default AboutModal;
