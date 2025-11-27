import React from 'react';
import { DocumentTextIcon } from './Icons';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
  isLoading: boolean;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, summary, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-modal-title"
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-5 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="w-6 h-6 text-amber-400"/>
            <h2 id="summary-modal-title" className="text-xl font-bold text-white">
                Conversation Summary
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold" aria-label="Close modal">&times;</button>
        </header>
        
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4">Generating summary...</p>
            </div>
          ) : (
            <div 
              className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-amber-400 prose-strong:text-white" 
              dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }}
            ></div>
          )}
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

export default SummaryModal;
