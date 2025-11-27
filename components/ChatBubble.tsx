
import React, { useState, useRef, useEffect } from 'react';
import { Message, Role } from '../types';
import { UserIcon, BotIcon, ThumbsUpIcon, ThumbsDownIcon, VideoCameraIcon, ClipboardIcon, DownloadIcon, FileTxtIcon, FileDocIcon, FileCsvIcon, SpeakerWaveIcon, SpeakerXMarkIcon, PlayIcon, PauseIcon, InfoIcon, ImageIcon, ShareIcon } from './Icons';

interface ChatBubbleProps {
  message: Message;
  onSelectApiKey: () => void;
  onFeedback: (messageId: number, feedback: 'good' | 'bad') => void;
  onPlayAudio: (messageId: number) => void;
}

const loadingMessages = [
    "Dreaming up your scene...",
    "Setting the stage...",
    "Directing the actors...",
    "Rendering pixels...",
    "Polishing the frames...",
    "Adding movie magic...",
    "Almost there..."
];

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onSelectApiKey, onFeedback, onPlayAudio }) => {
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [showFeedbackToast, setShowFeedbackToast] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  const isUser = message.role === Role.USER;
  const isError = message.isError || message.text.startsWith("Error:");

  const bubbleClasses = isUser
    ? 'bg-gray-800 rounded-br-none'
    : isError 
        ? 'bg-red-900/20 border border-red-500/50 rounded-bl-none'
        : 'bg-gray-700 rounded-bl-none';

  const wrapperClasses = isUser ? 'justify-end' : 'justify-start';
  const icon = isUser ? <UserIcon className="w-6 h-6 text-gray-400" /> : isError ? <InfoIcon className="w-6 h-6 text-red-400" /> : <BotIcon className="w-6 h-6 text-amber-400" />;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setIsDownloadMenuOpen(false);
      }
    };
    if (isDownloadMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDownloadMenuOpen]);

  useEffect(() => {
      if (message.videoState === 'generating') {
          const interval = setInterval(() => {
              setLoadingMsgIndex(prev => (prev + 1) % loadingMessages.length);
          }, 3000);
          return () => clearInterval(interval);
      }
  }, [message.videoState]);

  const handleCopy = () => {
    if (showCopyMessage || !navigator.clipboard) return;
    navigator.clipboard.writeText(message.text).then(() => {
      setShowCopyMessage(true);
      setTimeout(() => {
        setShowCopyMessage(false);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text to clipboard: ', err);
    });
  };

  const handleFeedbackClick = (type: 'good' | 'bad') => {
      onFeedback(message.id, type);
      setShowFeedbackToast(true);
      setTimeout(() => setShowFeedbackToast(false), 2500);
  };

  const handleShare = async () => {
      try {
          const shareData: any = {
              title: 'Akshat AI Output',
              text: message.text
          };

          let fileToShare: File | null = null;

          if (message.imageUrl) {
              const res = await fetch(message.imageUrl);
              const blob = await res.blob();
              fileToShare = new File([blob], "generated-image.png", { type: blob.type });
          } else if (message.videoUrl && message.videoState === 'done') {
               const res = await fetch(message.videoUrl);
               const blob = await res.blob();
               fileToShare = new File([blob], "generated-video.mp4", { type: 'video/mp4' });
          }

          if (fileToShare) {
              shareData.files = [fileToShare];
          }

          if (navigator.canShare && navigator.canShare(shareData)) {
              await navigator.share(shareData);
          } else {
              // Fallback
              if (fileToShare) {
                  const url = URL.createObjectURL(fileToShare);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = fileToShare.name;
                  a.click();
                  URL.revokeObjectURL(url);
                  alert("Sharing files not supported on this device. Content downloaded.");
              } else {
                  // Fallback for text: Open Twitter intent
                  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message.text.substring(0, 200))}...`;
                  window.open(twitterUrl, '_blank');
              }
          }
      } catch (error) {
          console.error("Sharing failed", error);
      }
  };

  const handleDownload = (format: 'txt' | 'doc' | 'csv') => {
    const text = message.text;
    const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, -5);
    let blob;
    let filename;

    switch (format) {
      case 'doc':
        filename = `Akshat-Export-${timestamp}.doc`;
        const contentHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
            </head>
            <body>
              ${text.replace(/\n/g, '<br>')}
            </body>
          </html>`;
        blob = new Blob([contentHtml], { type: 'application/msword' });
        break;
      case 'csv':
        filename = `Akshat-Export-${timestamp}.csv`;
        const csvContent = '"' + text.replace(/"/g, '""').split('\n').join('"\n"') + '"';
        blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        break;
      case 'txt':
      default:
        filename = `Akshat-Export-${timestamp}.txt`;
        blob = new Blob([text], { type: 'text/plain' });
        break;
    }
    
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    
    setIsDownloadMenuOpen(false);
  };

  const renderAudioButton = () => {
    if (message.isGeneratingAudio) {
      return (
        <div className="p-1.5 rounded-full text-gray-400" title="Generating audio...">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
    if (message.isPlayingAudio) {
      return (
        <button
          onClick={() => onPlayAudio(message.id)}
          className="p-1.5 rounded-full text-red-400 bg-red-500/20"
          aria-label="Stop audio"
          title="Stop"
        >
          <SpeakerXMarkIcon className="w-4 h-4" />
        </button>
      );
    }
    return (
      <button
        onClick={() => onPlayAudio(message.id)}
        className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
        aria-label="Play audio"
        title="Play"
      >
        <SpeakerWaveIcon className="w-4 h-4" />
      </button>
    );
  };

  // Video control handlers
    const togglePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
        setProgress(newTime);
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setProgress(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

  return (
    <div className={`flex items-start gap-3 my-4 ${wrapperClasses} animate-bubble-pop-in`}>
      <div className={`flex-shrink-0 ${isUser ? 'order-2' : 'order-1'}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}>
          {icon}
        </div>
      </div>
      
      <div className={`flex flex-col gap-1 max-w-xs md:max-w-md lg:max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl ${bubbleClasses} shadow-md text-white relative group`}>
            
            {/* Image */}
            {message.imageUrl && (
                <div className="mb-3 rounded-lg overflow-hidden border border-gray-600">
                    <img src={message.imageUrl} alt="Generated or uploaded" className="w-full h-auto" />
                </div>
            )}

            {/* Video */}
            {message.videoUrl && message.videoState === 'done' && (
                <div className="mb-3 rounded-lg overflow-hidden border border-gray-600 relative group/video">
                    <video 
                        ref={videoRef}
                        src={message.videoUrl}
                        className="w-full h-auto"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onClick={togglePlayPause}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover/video:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 mb-1">
                            <button onClick={togglePlayPause} className="text-white hover:text-amber-400">
                                {videoRef.current?.paused ? <PlayIcon className="w-4 h-4" /> : <PauseIcon className="w-4 h-4" />}
                            </button>
                            <input 
                                type="range" 
                                min="0" 
                                max={duration} 
                                value={progress} 
                                onChange={handleProgressChange} 
                                className="flex-grow h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                            <span className="text-[10px] font-mono text-gray-300">{formatTime(progress)} / {formatTime(duration)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Generating */}
            {message.videoState === 'generating' && (
                <div className="mb-3 bg-gray-800 rounded-lg p-4 border border-gray-600 flex flex-col items-center text-center gap-3">
                    {message.placeholderImageUrl ? (
                        <div className="w-full h-32 mb-2 overflow-hidden rounded-md opacity-50">
                            <img src={message.placeholderImageUrl} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center animate-pulse">
                            <VideoCameraIcon className="w-6 h-6 text-gray-400" />
                        </div>
                    )}
                    <div>
                        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm font-bold text-amber-400 animate-pulse">{loadingMessages[loadingMsgIndex]}</p>
                    </div>
                </div>
            )}

            {/* File Attachment */}
            {message.fileName && (
                <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-600 mb-2">
                    <div className="p-2 bg-gray-800 rounded">
                        {message.fileType?.includes('image') ? <ImageIcon className="w-5 h-5 text-purple-400" /> :
                         message.fileType?.includes('pdf') ? <FileDocIcon className="w-5 h-5 text-red-400" /> :
                         message.fileType?.includes('csv') ? <FileCsvIcon className="w-5 h-5 text-green-400" /> :
                         <FileTxtIcon className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{message.fileName}</p>
                        <p className="text-xs text-gray-400 uppercase">{message.fileType?.split('/')[1] || 'FILE'}</p>
                    </div>
                </div>
            )}

            {/* Audio Message (Input) */}
            {message.audioUrl && (
                <div className="flex items-center gap-2 mb-2 bg-gray-900/30 p-2 rounded-full border border-gray-600/50">
                    <audio src={message.audioUrl} controls className="h-8 w-64" />
                </div>
            )}

            {/* Text Content */}
            <div className="prose prose-invert max-w-none text-sm md:text-base break-words whitespace-pre-wrap leading-relaxed">
                {message.text}
            </div>

            {/* Needs API Key Warning */}
            {message.needsApiKey && (
                <div className="mt-3 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                    <p className="text-sm text-red-200 mb-2">This feature requires a paid API key.</p>
                    <button 
                        onClick={onSelectApiKey}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-500 transition-colors"
                    >
                        Select API Key
                    </button>
                </div>
            )}

            {/* Sources */}
            {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-600/50">
                    <p className="text-xs font-bold text-gray-400 mb-1.5">Sources:</p>
                    <div className="flex flex-wrap gap-2">
                        {message.sources.map((source, idx) => (
                            <a 
                                key={idx} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noreferrer"
                                className="px-2 py-1 bg-gray-800/50 hover:bg-gray-800 rounded text-xs text-blue-300 truncate max-w-[150px] border border-gray-600 hover:border-blue-400 transition-colors"
                            >
                                {source.title || source.uri}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Bar (Model messages only) */}
            {!isUser && !isError && (
                <div className="absolute -bottom-9 left-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button onClick={handleCopy} className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" title="Copy">
                        {showCopyMessage ? <span className="text-[10px] font-bold text-green-400">Copied!</span> : <ClipboardIcon className="w-4 h-4" />}
                    </button>
                    
                    <button onClick={handleShare} className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" title="Share">
                        <ShareIcon className="w-4 h-4" />
                    </button>

                    {/* TTS Button */}
                    {renderAudioButton()}

                    <div className="relative" ref={downloadMenuRef}>
                        <button onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)} className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" title="Download">
                            <DownloadIcon className="w-4 h-4" />
                        </button>
                        {isDownloadMenuOpen && (
                            <div className="absolute bottom-full left-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-20 min-w-[120px]">
                                <button onClick={() => handleDownload('txt')} className="block w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"><FileTxtIcon className="w-3 h-3"/> Text (.txt)</button>
                                <button onClick={() => handleDownload('doc')} className="block w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"><FileDocIcon className="w-3 h-3"/> Word (.doc)</button>
                                <button onClick={() => handleDownload('csv')} className="block w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"><FileCsvIcon className="w-3 h-3"/> CSV (.csv)</button>
                            </div>
                        )}
                    </div>

                    <div className="w-px h-4 bg-gray-700 mx-1"></div>

                    <button onClick={() => handleFeedbackClick('good')} className={`p-1.5 rounded-full transition-colors ${message.feedback === 'good' ? 'text-green-400 bg-green-900/20' : 'text-gray-400 hover:text-green-400 hover:bg-gray-700'}`} title="Good response">
                        <ThumbsUpIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleFeedbackClick('bad')} className={`p-1.5 rounded-full transition-colors ${message.feedback === 'bad' ? 'text-red-400 bg-red-900/20' : 'text-gray-400 hover:text-red-400 hover:bg-gray-700'}`} title="Bad response">
                        <ThumbsDownIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
            
            {/* Feedback Toast */}
            {showFeedbackToast && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg border border-gray-700 animate-fade-in-up">
                    Thanks for feedback!
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
