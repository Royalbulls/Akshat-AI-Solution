
import React, { useState, useRef, useEffect } from 'react';
import { Message, Role } from '../types';
import { UserIcon, BotIcon, ThumbsUpIcon, ThumbsDownIcon, VideoCameraIcon, ClipboardIcon, DownloadIcon, FileTxtIcon, FileDocIcon, FileCsvIcon, SpeakerWaveIcon, SpeakerXMarkIcon, PlayIcon, PauseIcon, DocumentTextIcon, InfoIcon } from './Icons';

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
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
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
    
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            videoRef.current.muted = newVolume === 0;
            setIsMuted(newVolume === 0);
        }
        setVolume(newVolume);
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const currentlyMuted = !videoRef.current.muted;
            videoRef.current.muted = currentlyMuted;
            setIsMuted(currentlyMuted);
            // If unmuting and volume was 0, set to a sensible default
            if (!currentlyMuted && videoRef.current.volume === 0) {
                const defaultVolume = 0.5;
                videoRef.current.volume = defaultVolume;
                setVolume(defaultVolume);
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
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-gray-700' : isError ? 'bg-red-900/30' : 'bg-gray-800'}`}>
          {icon}
        </div>
      </div>
      <div className={`max-w-xs md:max-w-md lg:max-w-2xl ${isUser ? 'order-1' : 'order-2'}`}>
        <div className="relative">
            {showCopyMessage && (
                <div 
                    className={`absolute z-10 -top-8 px-2 py-1 text-xs text-white bg-gray-600 rounded-md transition-opacity duration-300 ${isUser ? 'right-0' : 'left-0'}`}
                    role="alert"
                    aria-live="polite"
                >
                    Copied!
                </div>
            )}
            {showFeedbackToast && (
                <div 
                    className="absolute z-10 -top-10 left-0 right-0 mx-auto w-max px-3 py-1.5 text-xs font-medium text-green-100 bg-green-600/90 rounded-full shadow-lg animate-fade-in-slide-up"
                    role="status"
                >
                    Thanks for the feedback!
                </div>
            )}
            <div
              className={`px-4 py-3 rounded-2xl text-white shadow-md ${bubbleClasses}`}
              role="region"
              aria-label={isError ? "Error message" : "Chat message"}
            >
              {message.fileName && (
                <div className="flex items-center gap-3 p-2 mb-3 bg-black/20 rounded-lg border border-white/10">
                    <div className="p-2 bg-amber-600/30 rounded-md flex-shrink-0">
                        <DocumentTextIcon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{message.fileName}</p>
                        <p className="text-xs text-gray-400 uppercase">{message.fileType?.split('/')[1] || 'FILE'}</p>
                    </div>
                </div>
              )}

              {message.imageUrl && !isUser && (
                <div className="relative group mt-2 mb-2">
                    <img src={message.imageUrl} alt={message.text || 'Generated image'} className="max-w-full h-auto rounded-lg" />
                    <a 
                        href={message.imageUrl} 
                        download={`akshat-image-${message.id}.png`}
                        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Download image"
                        title="Download Image"
                    >
                        <DownloadIcon className="w-5 h-5" />
                    </a>
                </div>
              )}

              {message.text && <p className={`text-base break-words whitespace-pre-wrap ${isError ? 'text-red-200' : ''}`}>{message.text}</p>}

              {message.imageUrl && isUser && (
                <div className="mt-2">
                    <img src={message.imageUrl} alt={message.text || 'User uploaded image'} className="max-w-full h-auto rounded-lg" />
                </div>
              )}

              {message.audioUrl && (
                <div className="mt-1">
                  <audio src={message.audioUrl} controls className="w-full h-10" />
                </div>
              )}
              
              {message.videoState === 'generating' && (
                  <div className="relative mt-2 aspect-video w-full bg-gray-800 rounded-lg overflow-hidden">
                      {message.placeholderImageUrl && (
                          <img 
                              src={message.placeholderImageUrl} 
                              alt="Video generation source" 
                              className="w-full h-full object-cover opacity-50"
                          />
                      )}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          {!message.placeholderImageUrl && (
                              <VideoCameraIcon className="w-12 h-12 text-gray-500" />
                          )}
                          <div className="flex flex-col items-center gap-2 p-4 bg-black/60 rounded-xl backdrop-blur-sm">
                              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                              <p className="text-sm text-white font-semibold text-center animate-pulse">
                                {loadingMessages[loadingMsgIndex]}
                              </p>
                          </div>
                      </div>
                  </div>
              )}
              {message.videoUrl && (
                <div className="mt-2">
                  <video
                    ref={videoRef}
                    src={message.videoUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="max-w-full h-auto rounded-t-lg bg-black cursor-pointer"
                    onClick={togglePlayPause}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onVolumeChange={() => {
                        if (videoRef.current) {
                            setVolume(videoRef.current.volume);
                            setIsMuted(videoRef.current.muted || videoRef.current.volume === 0);
                        }
                    }}
                  />
                  <div className="bg-gray-800/80 backdrop-blur-sm p-2 flex items-center gap-2 rounded-b-lg text-white">
                    <button onClick={togglePlayPause} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
                      {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                    </button>
                    <div className="text-xs font-mono w-10 text-center">{formatTime(progress)}</div>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={progress}
                      onChange={handleProgressChange}
                      className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      aria-label="Video progress bar"
                    />
                    <div className="text-xs font-mono w-10 text-center">{formatTime(duration)}</div>
                    <div className="flex items-center gap-1">
                      <button onClick={toggleMute} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label={isMuted ? 'Unmute' : 'Mute'}>
                        {isMuted || volume === 0 ? <SpeakerXMarkIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        aria-label="Volume control"
                      />
                    </div>
                    <a
                      href={message.videoUrl}
                      download={`akshat-video-${message.id}.mp4`}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Download video"
                      title="Download Video"
                    >
                      <DownloadIcon className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              )}

              {message.needsApiKey && (
                  <div className="mt-3">
                      <button onClick={onSelectApiKey} className="px-4 py-2 text-sm bg-amber-600 text-white rounded-md hover:bg-amber-500 transition-colors">
                          Select API Key
                      </button>
                      <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 block mt-2 hover:underline">
                          Billing Information
                      </a>
                  </div>
              )}

              {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 border-t border-gray-600 pt-3">
                      <h4 className="text-xs font-bold text-gray-400 mb-2">Sources:</h4>
                      <ul className="space-y-1">
                          {message.sources.map((source, index) => (
                              <li key={index}>
                                  <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-400 hover:underline truncate block" title={source.uri}>
                                      {index + 1}. {source.title || source.uri}
                                  </a>
                              </li>
                          ))}
                      </ul>
                  </div>
              )}
            </div>
        </div>
        {!isUser && !message.videoState && message.text && !isError && (
          <div className="flex items-center gap-2 mt-2 pl-1">
            {renderAudioButton()}
            <button
              onClick={() => handleFeedbackClick('good')}
              className={`p-1.5 rounded-full transition-colors ${
                message.feedback === 'good'
                  ? 'text-amber-400 bg-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
              aria-label="Good response"
              title="Good response"
            >
              <ThumbsUpIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFeedbackClick('bad')}
              className={`p-1.5 rounded-full transition-colors ${
                message.feedback === 'bad'
                  ? 'text-red-400 bg-red-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
              aria-label="Bad response"
              title="Bad response"
            >
              <ThumbsDownIcon className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-gray-600 mx-1"></div>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
              aria-label="Copy message"
              title="Copy"
            >
              <ClipboardIcon className="w-4 h-4" />
            </button>
            <div className="relative" ref={downloadMenuRef}>
              <button
                onClick={() => setIsDownloadMenuOpen(prev => !prev)}
                className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
                aria-label="Download message options"
                aria-haspopup="true"
                aria-expanded={isDownloadMenuOpen}
                title="Download"
              >
                <DownloadIcon className="w-4 h-4" />
              </button>
              {isDownloadMenuOpen && (
                <div className="absolute bottom-full mb-2 -left-1/2 transform translate-x-1/4 w-40 bg-gray-600 rounded-md shadow-lg z-10 animate-fade-in-slide-up" style={{animationDuration: '0.2s'}}>
                  <button onClick={() => handleDownload('txt')} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-500 rounded-t-md">
                    <FileTxtIcon className="w-4 h-4" /> As Text (.txt)
                  </button>
                  <button onClick={() => handleDownload('doc')} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-500">
                    <FileDocIcon className="w-4 h-4" /> As Word (.doc)
                  </button>
                  <button onClick={() => handleDownload('csv')} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-500 rounded-b-md">
                    <FileCsvIcon className="w-4 h-4" /> As Excel (.csv)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
