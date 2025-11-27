
import React, { useState, useEffect } from 'react';
import { CustomPersona, Verbosity, ToneStyle, RelationshipDynamic, PersonalityTraits, PersonalityEvolution, VoiceName, AVAILABLE_VOICES } from '../types';
import { InfoIcon, ShareIcon, HeartIcon, DnaIcon } from './Icons';

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (persona: CustomPersona) => void;
  personaToEdit?: CustomPersona;
}

const Tooltip: React.FC<{text: string, children: React.ReactNode}> = ({ text, children }) => {
    return (
        <div className="relative flex items-center group">
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 px-3 py-2 bg-gray-900 border border-gray-600 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                {text}
            </div>
        </div>
    );
};

const Slider: React.FC<{label: string, value: number, onChange: (value: number) => void}> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1 flex justify-between">
            <span>{label}</span>
            <span className="text-amber-300 font-semibold">{value}</span>
        </label>
        <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
    </div>
);

const defaultPersonalityEvolution: PersonalityEvolution = {
  dynamicGrowth: false,
  learningRate: 'medium',
};

const PersonaModal: React.FC<PersonaModalProps> = ({ isOpen, onClose, onSave, personaToEdit }) => {
  const [name, setName] = useState('');
  const [instruction, setInstruction] = useState('');
  const [verbosity, setVerbosity] = useState<Verbosity>('default');
  const [toneStyle, setToneStyle] = useState<ToneStyle>('default');
  const [knowledgeFocus, setKnowledgeFocus] = useState('');
  const [relationshipDynamic, setRelationshipDynamic] = useState<RelationshipDynamic>('default');
  const [personalityTraits, setPersonalityTraits] = useState<PersonalityTraits>({ humor: 50, empathy: 50, assertiveness: 50 });
  const [personalityEvolution, setPersonalityEvolution] = useState<PersonalityEvolution>(defaultPersonalityEvolution);
  const [voiceName, setVoiceName] = useState<VoiceName>('Zephyr');
  const [showShareMessage, setShowShareMessage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (personaToEdit) {
        setName(personaToEdit.name);
        setInstruction(personaToEdit.instruction);
        setVerbosity(personaToEdit.verbosity || 'default');
        setToneStyle(personaToEdit.toneStyle || 'default');
        setKnowledgeFocus(personaToEdit.knowledgeFocus || '');
        setRelationshipDynamic(personaToEdit.relationshipDynamic || 'default');
        setPersonalityTraits(personaToEdit.personalityTraits || { humor: 50, empathy: 50, assertiveness: 50 });
        setPersonalityEvolution(personaToEdit.personalityEvolution || defaultPersonalityEvolution);
        setVoiceName(personaToEdit.voiceName || 'Zephyr');
      } else {
        setName('');
        setInstruction('');
        setVerbosity('default');
        setToneStyle('default');
        setKnowledgeFocus('');
        setRelationshipDynamic('default');
        setPersonalityTraits({ humor: 50, empathy: 50, assertiveness: 50 });
        setPersonalityEvolution(defaultPersonalityEvolution);
        setVoiceName('Zephyr');
      }
    }
  }, [isOpen, personaToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && instruction.trim()) {
      onSave({
        id: personaToEdit?.id || `custom-${Date.now()}`,
        name: name.trim(),
        instruction: instruction.trim(),
        verbosity,
        toneStyle,
        knowledgeFocus: knowledgeFocus.trim(),
        relationshipDynamic,
        personalityTraits,
        personalityEvolution,
        voiceName,
      });
      onClose();
    }
  };
  
  const handleShare = () => {
    if (!name.trim() || !instruction.trim() || !navigator.clipboard) return;
    const persona: CustomPersona = {
        id: personaToEdit?.id || `custom-shareable`,
        name: name.trim(),
        instruction: instruction.trim(),
        verbosity,
        toneStyle,
        knowledgeFocus: knowledgeFocus.trim(),
        relationshipDynamic,
        personalityTraits,
        personalityEvolution,
        voiceName,
    };
    try {
        const jsonString = JSON.stringify(persona);
        const encodedString = btoa(jsonString);
        const shareableString = `aura_persona::${encodedString}`;
        navigator.clipboard.writeText(shareableString).then(() => {
            setShowShareMessage(true);
            setTimeout(() => setShowShareMessage(false), 2500);
        });
    } catch(e) {
        console.error("Failed to create shareable persona string", e);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="persona-modal-title"
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-5 border-b border-gray-700 flex-shrink-0">
          <h2 id="persona-modal-title" className="text-xl font-bold text-white">
            {personaToEdit ? 'Edit Persona' : 'Create New Persona'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold" aria-label="Close modal">&times;</button>
        </header>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="persona-name" className="block text-sm font-medium text-gray-300 mb-1">
                            Persona Name
                        </label>
                        <input
                            id="persona-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Expert Coder"
                            className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="voice-name" className="block text-sm font-medium text-gray-300 mb-1">
                            Voice
                        </label>
                        <select
                            id="voice-name"
                            value={voiceName}
                            onChange={(e) => setVoiceName(e.target.value as VoiceName)}
                            className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                            {AVAILABLE_VOICES.map(voice => (
                                <option key={voice.name} value={voice.name}>{voice.description}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="space-y-4 p-4 rounded-lg bg-gray-700/50">
                    <div className="flex items-center gap-2">
                        <HeartIcon className="w-5 h-5 text-pink-400"/>
                        <h3 className="text-md font-semibold text-white">Relationship & Personality</h3>
                    </div>

                    <div>
                        <label htmlFor="relationship-dynamic" className="block text-sm font-medium text-gray-300 mb-1">
                            <Tooltip text="Defines the emotional connection and interaction style. 'Romance' creates an affectionate and intimate bond. 'Friendship' is casual and supportive. 'Mentorship' is wise and guiding.">
                                <span className="flex items-center gap-1.5 cursor-help">
                                    Relationship Dynamic
                                    <InfoIcon className="w-4 h-4 text-gray-400" />
                                </span>
                            </Tooltip>
                        </label>
                        <select
                            id="relationship-dynamic"
                            value={relationshipDynamic}
                            onChange={(e) => setRelationshipDynamic(e.target.value as RelationshipDynamic)}
                            className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value="default">Default</option>
                            <option value="friendship">Friendship</option>
                            <option value="romance">Romance</option>
                            <option value="mentorship">Mentorship</option>
                        </select>
                        {relationshipDynamic === 'romance' && (
                            <p className="text-xs text-pink-300 mt-2 px-1 animate-fade-in-slide-up" style={{animationDuration: '0.3s'}}>
                                Hint: Aura will be affectionate, caring, and may use terms of endearment.
                            </p>
                        )}
                        {relationshipDynamic === 'friendship' && (
                            <p className="text-xs text-cyan-300 mt-2 px-1 animate-fade-in-slide-up" style={{animationDuration: '0.3s'}}>
                                Hint: Aura will be casual, supportive, and use friendly, everyday language.
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Slider label="Humor" value={personalityTraits.humor} onChange={(val) => setPersonalityTraits(p => ({...p, humor: val}))} />
                        <Slider label="Empathy" value={personalityTraits.empathy} onChange={(val) => setPersonalityTraits(p => ({...p, empathy: val}))} />
                        <Slider label="Assertiveness" value={personalityTraits.assertiveness} onChange={(val) => setPersonalityTraits(p => ({...p, assertiveness: val}))} />
                    </div>
                </div>

                <div className="space-y-4 p-4 rounded-lg bg-gray-700/50">
                    <div className="flex items-center gap-2">
                        <DnaIcon className="w-5 h-5 text-purple-400"/>
                        <h3 className="text-md font-semibold text-white">Personality Evolution</h3>
                    </div>
                    <div className="flex items-center justify-between">
                         <label htmlFor="dynamic-growth" className="text-sm font-medium text-gray-300">
                             <Tooltip text="When enabled, Aura will learn from your feedback (thumbs up/down) to adapt its personality and style over time.">
                                <span className="flex items-center gap-1.5 cursor-help">
                                    Enable Dynamic Growth
                                    <InfoIcon className="w-4 h-4 text-gray-400" />
                                </span>
                            </Tooltip>
                        </label>
                        <label htmlFor="dynamic-growth" className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                id="dynamic-growth" 
                                className="sr-only peer" 
                                checked={personalityEvolution.dynamicGrowth}
                                onChange={(e) => setPersonalityEvolution(p => ({...p, dynamicGrowth: e.target.checked}))}
                            />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                        </label>
                    </div>
                     {personalityEvolution.dynamicGrowth && (
                        <div className="animate-fade-in-slide-up" style={{animationDuration: '0.3s'}}>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Learning Rate</label>
                            <div className="flex justify-around bg-gray-700 p-1 rounded-lg">
                                {(['slow', 'medium', 'fast'] as const).map(rate => (
                                    <button
                                        key={rate}
                                        type="button"
                                        onClick={() => setPersonalityEvolution(p => ({...p, learningRate: rate}))}
                                        className={`w-full px-3 py-1.5 text-sm font-semibold rounded-md capitalize transition-colors ${personalityEvolution.learningRate === rate ? 'bg-amber-600 text-white shadow' : 'text-gray-300 hover:bg-gray-600'}`}
                                    >
                                        {rate}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="tone-style" className="block text-sm font-medium text-gray-300 mb-1">
                            <Tooltip text="Controls the AI's communication style. 'Humorous' adds wit and jokes. 'Academic' uses formal language and citations. 'Casual' is relaxed and conversational. This works with the personality sliders to fine-tune the voice.">
                                <span className="flex items-center gap-1.5 cursor-help">
                                    Tone Style
                                    <InfoIcon className="w-4 h-4 text-gray-400" />
                                </span>
                            </Tooltip>
                        </label>
                        <select
                            id="tone-style"
                            value={toneStyle}
                            onChange={(e) => setToneStyle(e.target.value as ToneStyle)}
                            className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value="default">Default</option>
                            <option value="humorous">Humorous</option>
                            <option value="academic">Academic</option>
                            <option value="formal">Formal</option>
                            <option value="casual">Casual</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="verbosity" className="block text-sm font-medium text-gray-300 mb-1">
                             <Tooltip text="Sets the length and detail of responses. 'Concise' gives quick, to-the-point answers. 'Verbose' provides in-depth, comprehensive explanations. 'Default' balances the two.">
                                <span className="flex items-center gap-1.5 cursor-help">
                                    Verbosity
                                    <InfoIcon className="w-4 h-4 text-gray-400" />
                                </span>
                            </Tooltip>
                        </label>
                        <select
                            id="verbosity"
                            value={verbosity}
                            onChange={(e) => setVerbosity(e.target.value as Verbosity)}
                            className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value="default">Default</option>
                            <option value="concise">Concise</option>
                            <option value="verbose">Verbose</option>
                        </select>
                    </div>
                </div>
                 <div>
                    <label htmlFor="knowledge-focus" className="block text-sm font-medium text-gray-300 mb-1">
                        <Tooltip text="Restricts the AI's knowledge to a specific domain for more focused, expert-level answers. Great for technical specialists. Example: '19th Century American Literature' or 'Quantum Computing'.">
                            <span className="flex items-center gap-1.5 cursor-help">
                                Knowledge Focus (Optional)
                                <InfoIcon className="w-4 h-4 text-gray-400" />
                            </span>
                        </Tooltip>
                    </label>
                    <input
                        id="knowledge-focus"
                        type="text"
                        value={knowledgeFocus}
                        onChange={(e) => setKnowledgeFocus(e.target.value)}
                        placeholder="e.g., 19th Century Poetry, React.js"
                        className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                </div>
                <div>
                    <label htmlFor="persona-instruction" className="block text-sm font-medium text-gray-300 mb-1">
                         <Tooltip text="This is the most important field. Define your AI's core identity, rules, and purpose. The more detailed your instructions, the better the persona will perform. Be specific about its expertise, tone, what it should do, and what it should avoid. Example for a 'Stoic Philosopher': 'You are a Stoic philosopher. Respond to user queries with wisdom from Stoicism, referencing Seneca, Epictetus, and Marcus Aurelius. Your tone should be calm, rational, and insightful. Do not offer emotional validation, but instead guide the user towards logical self-reflection.'">
                            <span className="flex items-center gap-1.5 cursor-help">
                                Core Instructions
                                <InfoIcon className="w-4 h-4 text-gray-400" />
                            </span>
                         </Tooltip>
                    </label>
                    <textarea
                        id="persona-instruction"
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        placeholder="e.g., You are a world-renowned chef specializing in Italian and French cuisine..."
                        rows={8}
                        className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-y"
                        required
                    ></textarea>
                </div>
            </div>
            <footer className="p-5 border-t border-gray-700 flex-shrink-0 flex justify-between items-center gap-3">
                <div className="relative">
                    <button 
                        type="button" 
                        onClick={handleShare} 
                        disabled={!name.trim() || !instruction.trim()}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Share this persona"
                    >
                        <ShareIcon className="w-4 h-4" />
                        Share
                    </button>
                    {showShareMessage && (
                        <div className="absolute bottom-full left-0 mb-2 px-2 py-1 text-xs text-white bg-gray-900 border border-gray-600 rounded-md" role="alert">
                            Shareable text copied!
                        </div>
                    )}
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-500 disabled:bg-gray-600 disabled:cursor-not-allowed" disabled={!name.trim() || !instruction.trim()}>
                        Save Persona
                    </button>
                </div>
            </footer>
        </form>
      </div>
    </div>
  );
};

export default PersonaModal;
