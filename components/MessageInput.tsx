
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, MicrophoneIcon, PaperClipIcon, StopIcon, TrashIcon, CloseIcon, DocumentTextIcon } from './Icons';

interface MessageInputProps {
  onSendMessage: (message: string, file?: File, audio?: Blob) => void;
  isLoading: boolean;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, selectedFile, onFileSelect }) => {
  const [input, setInput] = useState('');
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [recordedAudio, setRecordedAudio] = useState<{ url: string; blob: Blob } | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio({ url: audioUrl, blob: audioBlob });
        setRecordingStatus('recorded');
        stream.getTracks().forEach(track => track.stop()); // Release microphone
      };

      mediaRecorder.start();
      setRecordingStatus('recording');
      setRecordingTime(0);
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      setMicError("Microphone access was denied. Please allow it in your browser settings.");
      setRecordingStatus('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === 'recording') {
      mediaRecorderRef.current.stop();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const handleMicClick = () => {
    if (micError) setMicError(null);
    if (recordingStatus === 'idle') {
      startRecording();
    } else if (recordingStatus === 'recording') {
      stopRecording();
    }
  };
  
  const handleDiscardAudio = () => {
    if (recordedAudio) {
      URL.revokeObjectURL(recordedAudio.url);
    }
    setRecordedAudio(null);
    setRecordingStatus('idle');
    setRecordingTime(0);
  };

  const handleSendAudio = () => {
    if (recordedAudio) {
      onSendMessage('', undefined, recordedAudio.blob);
      handleDiscardAudio();
    }
  };

  const handleSuggestionClick = (command: string) => {
    setInput(`${command} `);
    textareaRef.current?.focus();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onFileSelect(file || null);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyzeImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || selectedFile) && !isLoading) {
      onSendMessage(input.trim(), selectedFile || undefined);
      setInput('');
      handleRemoveFile();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const micButtonClasses = recordingStatus === 'recording'
    ? "text-red-500 animate-pulse-icon"
    : "text-gray-400 hover:text-white";

  const renderContent = () => {
    if (recordingStatus === 'recording') {
      return (
        <div className="flex-grow flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-gray-300 font-mono text-sm">{formatTime(recordingTime)}</span>
            </div>
            <button
                type="button"
                onClick={stopRecording}
                className="p-3 rounded-full bg-red-600 text-white"
                aria-label="Stop recording"
            >
                <StopIcon className="w-6 h-6" />
            </button>
        </div>
      );
    }

    if (recordingStatus === 'recorded' && recordedAudio) {
        return (
            <div className="flex-grow flex items-center gap-2 px-2">
                <button
                    type="button"
                    onClick={handleDiscardAudio}
                    className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    aria-label="Discard recording"
                >
                    <TrashIcon className="w-6 h-6" />
                </button>
                <audio src={recordedAudio.url} controls className="flex-grow w-full h-10" />
                <button
                    type="button"
                    onClick={handleSendAudio}
                    className="p-3 rounded-full bg-amber-600 text-white hover:bg-amber-500 transition-colors"
                    aria-label="Send audio message"
                >
                    <SendIcon className="w-6 h-6" />
                </button>
            </div>
        );
    }
    
    return (
      <>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*,application/pdf,text/plain,text/csv,application/json,text/javascript,text/html,text/css,text/markdown,application/xml,text/xml" 
          className="hidden" 
        />
        <input 
          type="file" 
          ref={imageInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        <button
          type="button"
          onClick={handleAttachClick}
          disabled={isLoading}
          className="p-3 rounded-full text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:text-gray-600 disabled:cursor-not-allowed"
          aria-label="Attach file"
          title="Attach file (PDF, Text, Code, Image)"
        >
          <PaperClipIcon className="w-6 h-6" />
        </button>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedFile ? "Add a message about this file..." : "Chat with Akshat..."}
          className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none px-2 resize-none max-h-24"
          rows={1}
          disabled={isLoading}
        />
        <button
            type="button"
            onClick={handleMicClick}
            disabled={isLoading || !!selectedFile}
            className={`p-3 rounded-full ${micButtonClasses} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:text-gray-600 disabled:cursor-not-allowed`}
            aria-label="Record audio message"
        >
            <MicrophoneIcon className="w-6 h-6" />
        </button>
        <button
          type="submit"
          disabled={isLoading || (!input.trim() && !selectedFile)}
          className="p-3 rounded-full bg-amber-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 neon-glow-gold"
          aria-label="Send message"
        >
          {isLoading ? (
             <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
             <SendIcon className="w-6 h-6" />
          )}
        </button>
      </>
    );
  };


  return (
    <div className="bg-gray-900 px-4 pt-2 pb-3 border-t border-gray-700">
      {recordingStatus === 'idle' && !selectedFile && !micError && (
        <div className="px-2 pb-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={handleAnalyzeImageClick}
            className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 hover:text-white transition-colors whitespace-nowrap flex items-center gap-1"
            aria-label="Analyze image"
          >
            Analyze 📷
          </button>
          <button
            type="button"
            onClick={() => handleSuggestionClick('/image')}
            className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 hover:text-white transition-colors whitespace-nowrap"
            aria-label="Use image generation command"
          >
            /image ✨
          </button>
           <button
            type="button"
            onClick={() => handleSuggestionClick('/video')}
            className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 hover:text-white transition-colors whitespace-nowrap"
            aria-label="Use video generation command"
          >
            /video 🎥
          </button>
        </div>
      )}
      {selectedFile && (
        <div className="relative p-2 animate-fade-in-slide-up">
            <div className="relative inline-block bg-gray-800 rounded-lg border border-gray-700 p-1">
                {selectedFile.type.startsWith('image/') ? (
                   <img src={URL.createObjectURL(selectedFile)} alt="Selected file preview" className="h-20 w-auto rounded-lg" />
                ) : (
                   <div className="flex items-center gap-3 p-2 pr-4 bg-gray-700/50 rounded-lg">
                      <div className="p-2 bg-amber-900/50 rounded-md">
                         <DocumentTextIcon className="w-8 h-8 text-amber-500" />
                      </div>
                      <div>
                          <p className="text-sm font-medium text-white truncate max-w-[200px]">{selectedFile.name}</p>
                          <p className="text-xs text-gray-400 uppercase">{selectedFile.name.split('.').pop()} • {(selectedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                   </div>
                )}
                <button 
                    onClick={handleRemoveFile} 
                    className="absolute -top-2 -right-2 p-1 bg-gray-700 text-white rounded-full hover:bg-gray-600 border border-gray-500"
                    aria-label="Remove attached file"
                >
                    <CloseIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-gray-800 p-2 rounded-full"
      >
        {renderContent()}
      </form>
      {micError && (
        <p className="text-xs text-red-400 text-center px-4 pt-1 animate-fade-in-slide-up">{micError}</p>
      )}
    </div>
  );
};

export default MessageInput;
