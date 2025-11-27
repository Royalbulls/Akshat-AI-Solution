import React, { useState } from 'react';
import { PersonaSpaceContent, PersonaProjectIdea, CustomPersona } from '../types';
import { BotIcon, BriefcaseIcon, LightBulbIcon, BeakerIcon, SparklesIcon, GlobeAltIcon, SendIcon } from './Icons';

interface PersonaSpaceViewProps {
    persona: CustomPersona;
    content: PersonaSpaceContent | null;
    isLoading: boolean;
    isSendingMessage: boolean;
    onRefresh: () => void;
    onSendMessage: (prompt: string) => void;
}

const ProjectIcon: React.FC<{icon: PersonaProjectIdea['icon']}> = ({ icon }) => {
    switch (icon) {
        case 'briefcase': return <BriefcaseIcon className="w-6 h-6 text-blue-300" />;
        case 'lightbulb': return <LightBulbIcon className="w-6 h-6 text-yellow-300" />;
        case 'beaker': return <BeakerIcon className="w-6 h-6 text-green-300" />;
        default: return <SparklesIcon className="w-6 h-6 text-amber-300" />;
    }
};

const PersonaSpaceView: React.FC<PersonaSpaceViewProps> = ({ persona, content, isLoading, isSendingMessage, onRefresh, onSendMessage }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isSendingMessage) {
            onSendMessage(prompt);
            setPrompt('');
        }
    };
    
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
                <BotIcon className="w-16 h-16 text-amber-400 animate-pulse-icon" />
                <h2 className="text-2xl font-bold text-white mt-4">{persona.name} is designing their space...</h2>
                <p>This might take a moment.</p>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
                <GlobeAltIcon className="w-16 h-16 text-amber-500 mb-4" />
                <h2 className="text-2xl font-bold text-white">Welcome to {persona.name}'s Space</h2>
                <p className="max-w-md mt-2">This is a personal page designed and curated by {persona.name}. Something went wrong while loading the content.</p>
                <button
                    onClick={onRefresh}
                    className="mt-6 px-6 py-2 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-500 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-900">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in-slide-up">
                <header className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <BotIcon className="w-8 h-8 text-amber-400" />
                            <div>
                                <h1 className="text-3xl font-bold text-white">{persona.name}'s Space</h1>
                                <p className="text-sm text-gray-400">{content.greeting}</p>
                            </div>
                        </div>
                        <p className="text-md text-gray-400 italic mt-3 ml-11">"{content.thoughtOfTheDay}"</p>
                    </div>
                    <button
                        onClick={onRefresh}
                        className="px-4 py-2 text-sm bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2 flex-shrink-0"
                        aria-label="Refresh page content"
                    >
                        <SparklesIcon className="w-4 h-4" />
                        Regenerate
                    </button>
                </header>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">Project Blueprints</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {content.projectIdeas.map((idea, index) => (
                                <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex items-start gap-4">
                                    <div className="flex-shrink-0 pt-1"><ProjectIcon icon={idea.icon} /></div>
                                    <div>
                                        <h3 className="font-bold text-white">{idea.title}</h3>
                                        <p className="text-sm text-gray-400 mt-1">{idea.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">Creative Corner</h2>
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 h-full">
                                <h3 className="font-bold text-white capitalize">{content.creativeCorner.title} <span className="text-xs text-gray-500">({content.creativeCorner.type.replace('_', ' ')})</span></h3>
                                <p className="text-sm text-gray-300 mt-2 whitespace-pre-wrap font-serif italic">{content.creativeCorner.content}</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">Learning Module</h2>
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 h-full">
                                <h3 className="font-bold text-white">{content.learningModule.topic}</h3>
                                <p className="text-sm text-gray-300 mt-2">{content.learningModule.summary}</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <footer className="flex-shrink-0 p-3 bg-gray-900 border-t border-gray-700">
                <form onSubmit={handleSubmit} className="flex items-center bg-gray-800 p-2 rounded-full">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={`Chat with ${persona.name} about their space...`}
                        className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none px-3"
                        disabled={isSendingMessage}
                    />
                    <button
                        type="submit"
                        disabled={isSendingMessage || !prompt.trim()}
                        className="p-3 rounded-full bg-amber-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        aria-label="Send message"
                    >
                        {isSendingMessage ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <SendIcon className="w-6 h-6" />
                        )}
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default PersonaSpaceView;