
import React from 'react';
import { ShareIcon } from './Icons';

interface ImageHistoryItem {
  id: number;
  prompt: string;
  imageUrl: string;
}

interface ImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  history: ImageHistoryItem[];
  onRegenerate: (prompt: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ isOpen, onClose, history, onRegenerate }) => {
  if (!isOpen) return null;

  const handleShare = async (item: ImageHistoryItem) => {
      try {
          const res = await fetch(item.imageUrl);
          const blob = await res.blob();
          const file = new File([blob], "image.png", { type: blob.type });
          
          const shareData = {
              title: 'Shared from Akshat AI',
              text: `Generated Image: "${item.prompt}"`,
              files: [file]
          };

          if (navigator.canShare && navigator.canShare(shareData)) {
              await navigator.share(shareData);
          } else {
              alert("Sharing not supported on this device.");
          }
      } catch (e) {
          console.error("Error sharing image", e);
      }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-title"
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 id="gallery-title" className="text-xl font-bold text-white">Image Library</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-3xl font-bold transition-colors"
            aria-label="Close image library"
          >
            &times;
          </button>
        </header>
        
        <div className="overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              <p className="text-lg">Your generated images will appear here.</p>
              <p className="text-sm mt-2">Try using the `/image` command in the chat!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.slice().reverse().map((item) => (
                <div key={item.id} className="group relative bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={item.imageUrl} 
                    alt={item.prompt} 
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs text-gray-300 line-clamp-3 mb-2">{item.prompt}</p>
                    <div className="flex gap-2">
                        <button
                        onClick={() => onRegenerate(item.prompt)}
                        className="flex-1 text-center text-xs font-semibold bg-amber-600 text-white py-1.5 rounded-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400"
                        >
                        Re-generate
                        </button>
                        <button
                            onClick={() => handleShare(item)}
                            className="p-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                            title="Share Image"
                        >
                            <ShareIcon className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
