import React from 'react';
import { TimelineEntry } from '../types';
import { MapPinIcon, TrashIcon } from './Icons';

interface TimelineViewProps {
    timeline: TimelineEntry[];
    isTracking: boolean;
    onClearTimeline: () => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ timeline, isTracking, onClearTimeline }) => {
    
    const groupedEntries = timeline.reduce((acc, entry) => {
        const date = new Date(entry.timestamp).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(entry);
        return acc;
    }, {} as Record<string, TimelineEntry[]>);
    
    // Sort dates chronologically
    const sortedDates = Object.keys(groupedEntries).sort((a, b) => {
        return new Date(b).getTime() - new Date(a).getTime();
    });

    return (
        <div className="p-4 h-full flex flex-col gap-4 text-white">
            <div className="flex-shrink-0 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Your Timeline</h2>
                    <p className="text-gray-400">A private log of your location history. Tracking is currently <span className={isTracking ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>{isTracking ? 'ON' : 'OFF'}</span>.</p>
                </div>
                {timeline.length > 0 && (
                    <button
                        onClick={onClearTimeline}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600/80 text-white rounded-md hover:bg-red-500 transition-colors"
                        title="This will permanently delete all location data."
                    >
                        <TrashIcon className="w-4 h-4" />
                        Clear History
                    </button>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 mt-4">
                {timeline.length === 0 ? (
                    <div className="text-center text-gray-500 py-16">
                        <MapPinIcon className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-lg">Your timeline is empty.</p>
                        <p className="mt-2">Enable location tracking in Settings to build your history.</p>
                    </div>
                ) : (
                    sortedDates.map(date => (
                        <div key={date}>
                            <h3 className="font-bold text-lg text-amber-300 mb-3">{date}</h3>
                            <div className="relative border-l-2 border-gray-700 ml-4 pl-8 space-y-6">
                                {groupedEntries[date].sort((a,b) => b.timestamp - a.timestamp).map(entry => (
                                    <div key={entry.id} className="relative">
                                        <div className="absolute -left-[38px] top-1 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                                            <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                                        </div>
                                        <p className="text-sm text-gray-400">{new Date(entry.timestamp).toLocaleTimeString()}</p>
                                        {entry.isResolvingAddress ? (
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-gray-500 italic">Identifying location...</p>
                                            </div>
                                        ) : (
                                            <p className="font-semibold text-white mt-1">{entry.address || 'Unknown Location'}</p>
                                        )}
                                    </div>
                                )) }
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TimelineView;