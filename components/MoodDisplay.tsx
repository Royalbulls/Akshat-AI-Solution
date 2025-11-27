
import React from 'react';
import { Mood } from '../types';
import { FaceSmileIcon, FaceFrownIcon, FaceAnxiousIcon, FaceNeutralIcon, FaceAngryIcon, FaceExcitedIcon, FaceReflectiveIcon } from './Icons';

interface MoodDisplayProps {
  mood: Mood;
}

const moodData: { [key in Mood]: { text: string; bg: string; icon: React.FC<{className?: string}> } } = {
  happy: { text: 'text-green-300', bg: 'bg-green-500/20', icon: FaceSmileIcon },
  excited: { text: 'text-yellow-300', bg: 'bg-yellow-500/20', icon: FaceExcitedIcon },
  sad: { text: 'text-blue-300', bg: 'bg-blue-500/20', icon: FaceFrownIcon },
  anxious: { text: 'text-purple-300', bg: 'bg-purple-500/20', icon: FaceAnxiousIcon },
  angry: { text: 'text-red-300', bg: 'bg-red-500/20', icon: FaceAngryIcon },
  neutral: { text: 'text-gray-400', bg: 'bg-gray-500/20', icon: FaceNeutralIcon },
  reflective: { text: 'text-indigo-300', bg: 'bg-indigo-500/20', icon: FaceReflectiveIcon },
};

const MoodDisplay: React.FC<MoodDisplayProps> = ({ mood }) => {
    const display = moodData[mood] || moodData.neutral;

    return (
        <div 
            className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-500 ${display.bg}`}
            title={`Akshat detects your current mood as: ${mood}`}
        >
            <display.icon className={`w-5 h-5 ${display.text}`} />
            <span className={`text-sm font-medium capitalize ${display.text}`}>{mood}</span>
        </div>
    );
};

export default MoodDisplay;
