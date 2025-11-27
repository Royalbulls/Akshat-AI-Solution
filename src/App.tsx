
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Role, Source, CustomPersona, ChatMode, PREDEFINED_PERSONAS, ViewMode, JournalEntry, UserProfile, Mood, RelationshipDynamic, PersonalityTraits, AgentTask, AgentStep, PersonalityEvolution, PersonaSpaceContent, PersonaFeedback, VoiceName, TimelineEntry, KundliDetails, PublicKundliPersona, AppSettings, LEGENDARY_PERSONAS, TranscriptionPart, AuthUser } from './types';
import Header from './components/Header';
import ChatBubble from './components/ChatBubble';
import MessageInput from './components/MessageInput';
import ImageGallery from './components/ImageGallery';
import Sidebar from './components/Sidebar';
import PersonaModal from './components/PersonaModal';
import AboutModal from './components/AboutModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import KundliModal from './components/KundliModal';
import PersonaSpaceView from './components/AuraSpaceView';
import TimelineView from './components/TimelineView';
import SettingsView from './components/SettingsView';
import PublicKundliView from './components/PublicKundliView';
import VisionView from './components/VisionView';
import SummaryModal from './components/SummaryModal';
import BusinessHubView from './components/BusinessHubView';
import RoboticsView from './components/RoboticsView';
import MultiverseComicView from './components/MultiverseComicView';
import AutomationHubView from './components/AutomationHubView';
import AuthView from './components/AuthView';
import VideoStudioView from './components/VideoStudioView';
import { runSmartChat, generateImage, startVideoGeneration, getVideoOperation, runChatWithThinking, detectMood, getJournalFeedback, getCbtPrompt, createAgentTaskPlan, generateAgentTaskDraft, selfCorrectAgentResult, generatePersonaSpaceContent, generateSpeech, getAddressForCoordinates, fetchAstrologicalData, generateKundliPersonaInstruction, synthesizeAnshPersona, generateConversationSummary, editImageWithAvatar, generateConversationContext } from './services/geminiService';
import { BotIcon, SparklesIcon, AgentIcon, BriefcaseIcon, LightBulbIcon, BeakerIcon, NewspaperIcon, ScaleIcon, WrenchScrewdriverIcon, SearchIcon, MicrophoneIcon, DocumentTextIcon, DownloadIcon, ClipboardIcon, FileTxtIcon, FileDocIcon } from './components/Icons';
import { GoogleGenAI, Operation, Modality, LiveServerMessage, LiveSession, Blob as GenAI_Blob } from '@google/genai';

// Speech Recognition API Types
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}
interface SpeechRecognitionEvent extends Event { readonly results: SpeechRecognitionResultList; }
interface SpeechRecognitionResultList { readonly length: number; item(index: number): SpeechRecognitionResult; }
interface SpeechRecognitionResult { readonly isFinal: boolean; readonly length: number; item(index: number): SpeechRecognitionResult; }
interface SpeechRecognitionAlternative { readonly transcript: string; readonly confidence: number; }
interface SpeechRecognitionErrorEvent extends Event { readonly error: string; }
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
    // aistudio definition removed to avoid conflict with global type
  }
}

// Error Boundary Component
interface ErrorBoundaryProps {
  children?: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col h-screen bg-gray-900 text-white font-sans items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong.</h1>
            <p className="text-gray-300 mb-6">We've encountered an unexpected error. Please try reloading the page.</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-500 transition-colors">Reload Page</button>
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

// Helper for Vision Mode to convert Blob to Base64
const blobToBase64 = (blob: Blob): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            reject(new Error('Failed to read blob as Base64 string'));
        }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
});


const getImageDimensions = (file: File): Promise<{ width: number; height: number; }> => {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(url);
        };
        img.onerror = (error) => {
            reject(error);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    });
};

// TTS Audio Helpers
const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

async function decodePcmAudio(data: Uint8Array, ctx: AudioContext, sampleRate: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
}

// Vision Mode Audio Helpers
function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createPcmBlob(data: Float32Array): GenAI_Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encodeBase64(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

interface ImageHistoryItem {
  id: number;
  prompt: string;
  imageUrl: string;
}

const WELCOME_MESSAGES = [
    "Hey there! I'm Akshat, your friendly AI companion. 😊 I'm here to chat, listen, or help with anything on your mind.",
    "Namaste! 🙏 I am Akshat. Whether it's Business Strategy, Kundli analysis, or Creative writing, I'm ready to help.",
    "Hello! I'm Akshat. 🚀 Ready to turn your ideas into reality? You can upload images, ask about finance, or just talk.",
    "Welcome! I am Akshat, your Enterprise AI Solution. How can we drive growth or creativity today?",
    "Hi! Akshat here. 🌟 From generating comics to analyzing business plans, I'm your all-in-one intelligence partner."
];

const getInitialMessage = (): Message => {
    const randomText = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
    return {
        id: 1,
        role: Role.MODEL,
        text: randomText,
    };
};

const LoadingBubble: React.FC<{text?: string}> = ({ text = "Akshat is thinking..." }) => (
    <div className="flex items-start gap-3 my-4 justify-start animate-bubble-pop-in">
        <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <BotIcon className="w-6 h-6 text-amber-400" />
            </div>
        </div>
        <div className="max-w-xs md:max-w-md lg:max-w-2xl w-full">
            <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-gray-200 dark:bg-gray-700 shadow-md">
                <div className="space-y-2.5">
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded-full w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded-full w-1/2 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded-full w-5/6 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
            {text && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 pl-2 animate-pulse">{text}</p>}
        </div>
    </div>
);

const moodColors: { [key in Mood]: { text: string; bg: string; } } = {
  happy: { text: 'text-green-800 dark:text-green-300', bg: 'bg-green-500/20' },
  excited: { text: 'text-yellow-800 dark:text-yellow-300', bg: 'bg-yellow-500/20' },
  sad: { text: 'text-blue-800 dark:text-blue-300', bg: 'bg-blue-500/20' },
  anxious: { text: 'text-purple-800 dark:text-purple-300', bg: 'bg-purple-500/20' },
  angry: { text: 'text-red-800 dark:text-red-300', bg: 'bg-red-500/20' },
  neutral: { text: 'text-gray-800 dark:text-gray-300', bg: 'bg-gray-500/20' },
  reflective: { text: 'text-indigo-800 dark:text-indigo-300', bg: 'bg-indigo-500/20' },
};

const HighlightedText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
    if (!highlight.trim()) {
        return <>{text}</>;
    }
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i} className="bg-amber-500/40 text-inherit rounded-sm">
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </>
    );
};

const JournalView: React.FC<{
    entries: JournalEntry[];
    onAddEntry: (text: string) => Promise<void>;
    onGetFeedback: (id: string) => Promise<void>;
}> = ({ entries, onAddEntry, onGetFeedback }) => {
    const [newEntryText, setNewEntryText] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSave = async () => {
        if (!newEntryText.trim()) return;
        setIsSaving(true);
        await onAddEntry(newEntryText);
        setNewEntryText('');
        setIsSaving(false);
    };
    
    const handleGetPrompt = async () => {
        try {
            const prompt = await getCbtPrompt();
            setNewEntryText(prompt);
        } catch (error) {
            console.error("CBT prompt generation failed:", error);
            // Display a fallback prompt if the API fails
            setNewEntryText("Think about one thing you are grateful for today.");
        }
    };

    const filteredEntries = entries.filter(entry =>
        entry.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4 h-full flex flex-col gap-4">
            <div className="flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-100 dark:text-white">My Journal</h2>
                <p className="text-gray-500 dark:text-gray-400">A private space to reflect and grow with Akshat.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg flex-shrink-0 border border-gray-200 dark:border-gray-700">
                <textarea
                    value={newEntryText}
                    onChange={(e) => setNewEntryText(e.target.value)}
                    placeholder="How are you feeling today?"
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 p-3 resize-none"
                    rows={4}
                    disabled={isSaving}
                />
                <div className="flex justify-between items-center mt-3">
                    <button onClick={handleGetPrompt} className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Get a writing prompt
                    </button>
                    <button onClick={handleSave} disabled={isSaving || !newEntryText.trim()} className="px-5 py-2 text-sm font-semibold bg-amber-600 text-white rounded-md hover:bg-amber-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                        {isSaving ? 'Saving...' : 'Save Entry'}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mt-4 mb-3 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-100 dark:text-white">Past Entries</h3>
                    {entries.length > 0 && (
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <SearchIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search entries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 rounded-md border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 pl-9 pr-3 py-1.5 text-sm"
                                aria-label="Search journal entries"
                            />
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    {entries.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-500 py-8">Your journal is empty. Write your first entry above!</p>
                    ) : filteredEntries.length === 0 && searchQuery ? (
                        <p className="text-center text-gray-500 dark:text-gray-500 py-8">No entries match your search for "{searchQuery}".</p>
                    ) : (
                        filteredEntries.map(entry => (
                            <div key={entry.id} className="bg-white dark:bg-gray-800/50 p-4 rounded-lg animate-bubble-pop-in border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(entry.date).toLocaleString()}</p>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${moodColors[entry.mood]?.bg} ${moodColors[entry.mood]?.text}`}>
                                        {entry.mood}
                                    </span>
                                </div>
                                <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
                                     <HighlightedText text={entry.text} highlight={searchQuery} />
                                </p>
                                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    {entry.aiFeedback ? (
                                        <div className="flex items-start gap-2">
                                            <SparklesIcon className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-1" />
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{entry.aiFeedback}</p>
                                        </div>
                                    ) : (
                                        <button onClick={() => onGetFeedback(entry.id)} disabled={entry.isGeneratingFeedback} className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 disabled:opacity-50 disabled:cursor-wait">
                                            {entry.isGeneratingFeedback ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                                                    Getting reflection...
                                                </>
                                            ) : (
                                                <>
                                                    <SparklesIcon className="w-4 h-4" />
                                                    Get Akshat's Reflection
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export const App: React.FC = () => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [chatMode, setChatMode] = useState<ChatMode>('smart');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('aura_companion');
  const [customPersonas, setCustomPersonas] = useState<CustomPersona[]>([]);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [personaToEdit, setPersonaToEdit] = useState<CustomPersona | undefined>(undefined);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [imageHistory, setImageHistory] = useState<ImageHistoryItem[]>([]);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({ preferences: [], conversationSummary: '' });
  const [mood, setMood] = useState<Mood>('neutral');
  const [personaSpaceContent, setPersonaSpaceContent] = useState<PersonaSpaceContent | null>(null);
  const [isSpaceLoading, setIsSpaceLoading] = useState(false);
  const [isSpaceSending, setIsSpaceSending] = useState(false);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isKundliModalOpen, setIsKundliModalOpen] = useState(false);
  const [kundliDetails, setKundliDetails] = useState<KundliDetails | null>(null);
  const [publicPersonas, setPublicPersonas] = useState<PublicKundliPersona[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings>({ theme: 'dark', defaultVoice: 'Zephyr' });
  const [visionStream, setVisionStream] = useState<MediaStream | null>(null);
  const [visionStatus, setVisionStatus] = useState<'idle' | 'connecting' | 'active' | 'error'>('idle');
  const [visionTranscript, setVisionTranscript] = useState<TranscriptionPart[]>([]);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [conversationSummary, setConversationSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Use a ref to track video operations
  const videoOperations = useRef<{ [key: number]: Operation }>({});

  const currentPersona = [...PREDEFINED_PERSONAS, ...LEGENDARY_PERSONAS, ...customPersonas].find(p => p.id === selectedPersonaId) || PREDEFINED_PERSONAS[0];

  useEffect(() => {
    // Auth Check
    const storedUser = localStorage.getItem('akshat_auth_user');
    if (storedUser) {
        try {
            setAuthUser(JSON.parse(storedUser));
        } catch(e) { console.error("Failed to parse auth user"); }
    }

    const storedPersonas = localStorage.getItem('aura_custom_personas');
    if (storedPersonas) setCustomPersonas(JSON.parse(storedPersonas));

    const storedHistory = localStorage.getItem('aura_chat_history');
    if (storedHistory) setMessages(JSON.parse(storedHistory));

    const storedImages = localStorage.getItem('aura_image_history');
    if (storedImages) setImageHistory(JSON.parse(storedImages));

    const storedJournal = localStorage.getItem('aura_journal_entries');
    if (storedJournal) setJournalEntries(JSON.parse(storedJournal));

    const storedProfile = localStorage.getItem('aura_user_profile');
    if (storedProfile) setUserProfile(JSON.parse(storedProfile));
    else {
        const newProfile = { preferences: [], conversationSummary: '', universalUserID: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
        setUserProfile(newProfile);
        localStorage.setItem('aura_user_profile', JSON.stringify(newProfile));
    }

    const storedTimeline = localStorage.getItem('aura_timeline');
    if (storedTimeline) setTimeline(JSON.parse(storedTimeline));

    const storedTracking = localStorage.getItem('aura_tracking_enabled');
    if (storedTracking) setIsTracking(JSON.parse(storedTracking));

    const storedKundli = localStorage.getItem('aura_kundli_details');
    if (storedKundli) setKundliDetails(JSON.parse(storedKundli));

    const storedPublicPersonas = localStorage.getItem('aura_public_personas');
    if (storedPublicPersonas) setPublicPersonas(JSON.parse(storedPublicPersonas));

    const storedSettings = localStorage.getItem('aura_app_settings');
    if (storedSettings) setAppSettings(JSON.parse(storedSettings));

  }, []);

  const handleLogin = (user: AuthUser) => {
      setAuthUser(user);
      localStorage.setItem('akshat_auth_user', JSON.stringify(user));
      // Auto-update profile name
      setUserProfile(prev => ({ ...prev, name: user.name }));
  };

  const handleLogout = () => {
      setAuthUser(null);
      localStorage.removeItem('akshat_auth_user');
      // Optional: clear session data or keep it
  };

  useEffect(() => {
    localStorage.setItem('aura_custom_personas', JSON.stringify(customPersonas));
  }, [customPersonas]);

  useEffect(() => {
    localStorage.setItem('aura_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('aura_image_history', JSON.stringify(imageHistory));
  }, [imageHistory]);

  useEffect(() => {
      localStorage.setItem('aura_journal_entries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
      localStorage.setItem('aura_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
      localStorage.setItem('aura_timeline', JSON.stringify(timeline));
  }, [timeline]);

  useEffect(() => {
      localStorage.setItem('aura_tracking_enabled', JSON.stringify(isTracking));
  }, [isTracking]);
  
  useEffect(() => {
      if (kundliDetails) localStorage.setItem('aura_kundli_details', JSON.stringify(kundliDetails));
  }, [kundliDetails]);

  useEffect(() => {
      localStorage.setItem('aura_public_personas', JSON.stringify(publicPersonas));
  }, [publicPersonas]);
  
  useEffect(() => {
      localStorage.setItem('aura_app_settings', JSON.stringify(appSettings));
      // Apply theme
      if (appSettings.theme === 'light') {
          document.documentElement.classList.remove('dark');
      } else {
          document.documentElement.classList.add('dark');
      }
  }, [appSettings]);


  // Location Tracking Logic
  useEffect(() => {
      let watchId: number;
      if (isTracking && navigator.geolocation) {
          watchId = navigator.geolocation.watchPosition(
              async (position) => {
                  const { latitude, longitude } = position.coords;
                  const timestamp = Date.now();
                  const newEntry: TimelineEntry = {
                      id: timestamp.toString(),
                      lat: latitude,
                      lng: longitude,
                      timestamp,
                      isResolvingAddress: true
                  };
                  
                  setTimeline(prev => [newEntry, ...prev]);

                  try {
                      const address = await getAddressForCoordinates(latitude, longitude);
                      setTimeline(prev => prev.map(e => e.id === newEntry.id ? { ...e, address, isResolvingAddress: false } : e));
                  } catch (error) {
                      setTimeline(prev => prev.map(e => e.id === newEntry.id ? { ...e, address: 'Location unavailable', isResolvingAddress: false } : e));
                  }
              },
              (error) => console.error("Geolocation error:", error),
              { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
          );
      }
      return () => {
          if (watchId) navigator.geolocation.clearWatch(watchId);
      };
  }, [isTracking]);

  const handleSendMessage = async (text: string, file?: File, audio?: Blob) => {
    if ((!text.trim() && !file && !audio) || isLoading) return;

    const newMessage: Message = {
      id: Date.now(),
      role: Role.USER,
      text: text,
    };

    if (file && file.type.startsWith('image/')) {
         newMessage.imageUrl = URL.createObjectURL(file);
    } else if (file) {
        newMessage.fileName = file.name;
        newMessage.fileType = file.type;
    }
    
    if (audio) {
        newMessage.audioUrl = URL.createObjectURL(audio);
    }

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);
    setSelectedFile(null);

    // Mood Detection
    if (text.trim()) {
        detectMood(text).then(detectedMood => setMood(detectedMood));
    }

    // Personality Context Construction
    let systemInstruction = `You are Akshat, acting as '${currentPersona.name}'.\n${currentPersona.instruction}\n\n`;
    if (currentPersona.knowledgeFocus) systemInstruction += `Focus your knowledge on: ${currentPersona.knowledgeFocus}.\n`;
    if (currentPersona.toneStyle && currentPersona.toneStyle !== 'default') systemInstruction += `Adopt a ${currentPersona.toneStyle} tone.\n`;
    if (currentPersona.verbosity && currentPersona.verbosity !== 'default') systemInstruction += `Be ${currentPersona.verbosity}.\n`;
    if (currentPersona.relationshipDynamic && currentPersona.relationshipDynamic !== 'default') systemInstruction += `Relationship dynamic: ${currentPersona.relationshipDynamic}.\n`;
    
    // Inject Personality Traits
    if (currentPersona.personalityTraits) {
        const { humor, empathy, assertiveness } = currentPersona.personalityTraits;
        systemInstruction += `\nPersonality Matrix (0-100 Scale):\n- Humor: ${humor} (Adjust wit and joke frequency)\n- Empathy: ${empathy} (Adjust emotional warmth and validation)\n- Assertiveness: ${assertiveness} (Adjust directness and confidence)\n`;
    }

    // Inject Personality Evolution
    if (currentPersona.personalityEvolution?.dynamicGrowth) {
        systemInstruction += `\n**Evolution Mode: ENABLED**\nLearning Rate: ${currentPersona.personalityEvolution.learningRate}.\nPay close attention to the user's implicit feedback, tone, and preferences. Subtly shift your personality traits over time to better align with what the user responds positively to.\n`;
    }

    // --- HYPER-PERSONALIZATION INJECTION ---
    if (userProfile.name) systemInstruction += `\n**USER CONTEXT:**\nUser's name: ${userProfile.name}.\n`;
    if (userProfile.preferences.length > 0) systemInstruction += `User Preferences & Facts: ${userProfile.preferences.join(', ')}.\n`;
    if (userProfile.conversationSummary) systemInstruction += `Previous Conversation Context (Long-term Memory): ${userProfile.conversationSummary}\n`;
    // ----------------------------------------

    try {
        let responseText = '';
        let sources: Source[] | undefined;

        if (text.startsWith('/image ')) {
            const imagePrompt = text.replace('/image ', '');
             if (file && file.type.startsWith('image/')) {
                const base64Image = await fileToBase64(file);
                const imageUrl = await editImageWithAvatar({data: base64Image, mimeType: file.type}, currentPersona);
                 setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        role: Role.MODEL,
                        text: `Here is the edited image based on your request!`,
                        imageUrl: imageUrl
                    },