
import React from 'react';
import { ShieldCheckIcon } from './Icons';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-5 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-7 h-7 text-amber-400"/>
            <h2 id="privacy-modal-title" className="text-xl font-bold text-white">
                Privacy Policy
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold" aria-label="Close modal">&times;</button>
        </header>
        
        <div className="p-6 space-y-4 overflow-y-auto text-gray-300">
            <p className="text-sm">Last Updated: August 2, 2024</p>

            <h3 className="text-lg font-semibold text-white pt-2">1. Introduction</h3>
            <p>Welcome to Akshat. We are committed to protecting your privacy. This Privacy Policy explains how your personal information is handled within the Akshat application. Your privacy is our priority, and we have designed Akshat to be a private and secure space for you.</p>

            <h3 className="text-lg font-semibold text-white pt-2">2. Data Storage: Your Data Stays on Your Device</h3>
            <p>Akshat operates on a principle of local-first data storage. This means that all of your data, including but not limited to:</p>
            <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
                <li>Your chat history and conversations with Akshat.</li>
                <li>Your custom-created personas.</li>
                <li>Your journal entries and mood logs.</li>
                <li>Your application settings and preferences.</li>
                <li>Your Kundli details and timeline history.</li>
            </ul>
            <p className="mt-2 font-semibold">...is stored exclusively on your local device within your web browser's local storage. We do not have a server, and we do not collect, see, or store any of this personal data.</p>

            <h3 className="text-lg font-semibold text-white pt-2">3. Data Sent to APIs</h3>
            <p>To provide its AI capabilities, Akshat sends relevant contextual data from your current session to the Google Gemini API. This includes:</p>
             <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
                <li>The text you type for chat responses, image generation, etc.</li>
                <li>Your conversation history (for context).</li>
                <li>The active persona's instructions.</li>
            </ul>
            <p className="mt-2">This data is processed by Google to generate a response. We encourage you to review the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Google Privacy Policy</a> to understand how they handle data.</p>
            
            <h3 className="text-lg font-semibold text-white pt-2">4. Your Control and Responsibility</h3>
            <p>You have complete control over your data. You can clear your chat history, delete personas, or wipe all application data at any time from the settings menu. Please be aware that since your data is stored locally:</p>
             <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
                <li>Clearing your browser's cache or local storage will permanently delete all your Akshat data.</li>
                <li>Your data will not sync across different devices or browsers.</li>
             </ul>

            <h3 className="text-lg font-semibold text-white pt-2">5. Changes to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy within the application. You are advised to review this Privacy Policy periodically for any changes.</p>
        </div>
        <footer className="p-4 flex-shrink-0 flex justify-end">
            <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-500">
                Close
            </button>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
