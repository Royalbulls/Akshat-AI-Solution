
import React, { useEffect, useRef } from 'react';
import { TranscriptionPart } from '../types';
import { StopIcon } from './Icons';

type SessionStatus = 'idle' | 'connecting' | 'active' | 'error';

interface VisionViewProps {
    stream: MediaStream | null;
    status: SessionStatus;
    transcript: TranscriptionPart[];
    onEndSession: () => void;
}

const statusMessages: Record<SessionStatus, string> = {
    idle: 'Starting...',
    connecting: 'Connecting to Akshat...',
    active: 'Live Conversation Active',
    error: 'Connection Error',
};

const VisionView: React.FC<VisionViewProps> = ({ stream, status, transcript, onEndSession }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const transcriptRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            // Explicitly attempt to play, though autoplay prop should handle it.
            // Muted is critical for autoplay policy on many browsers if no user interaction occurred
            videoRef.current.muted = true; 
            videoRef.current.play().catch(e => console.error("Video play failed:", e));
        }
    }, [stream]);

    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [transcript]);

    return (
        <div className="relative w-full h-full bg-black">
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-between p-4">
                <div className="text-center">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${status === 'active' ? 'bg-green-500/50 animate-pulse' : status === 'error' ? 'bg-red-500/50' : 'bg-gray-500/50'}`}>
                        {statusMessages[status]}
                    </span>
                </div>

                <div className="flex flex-col items-center">
                     <div ref={transcriptRef} className="w-full max-w-4xl h-40 overflow-y-auto p-3 bg-black/50 rounded-lg backdrop-blur-sm mb-4">
                        {transcript.length === 0 ? (
                            <p className="text-gray-400 italic text-center text-sm">Listening...</p>
                        ) : (
                            transcript.map((part, index) => (
                                <p key={index} className="text-white text-lg mb-1">
                                    <span className={part.role === 'user' ? 'font-bold text-amber-300' : 'font-semibold text-cyan-300'}>
                                        {part.role === 'user' ? 'You: ' : 'Akshat: '}
                                    </span>
                                    {part.text}
                                </p>
                            ))
                        )}
                    </div>

                    <button
                        onClick={onEndSession}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-500 transition-colors shadow-lg"
                    >
                        <StopIcon className="w-6 h-6" />
                        End Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VisionView;
