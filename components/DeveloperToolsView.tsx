
import React, { useState, useEffect } from 'react';
import { GitHubRepo, GitHubUser, CustomTask } from '../types';
import { GitHubIcon, LinkIcon, PencilIcon, TrashIcon, PlusIcon, BookOpenIcon, NewspaperIcon, BriefcaseIcon, BeakerIcon, WrenchScrewdriverIcon, LightBulbIcon } from './Icons';

interface DeveloperToolsViewProps {
    analyzedRepo: GitHubRepo | null;
    onAnalyzeRepo: (repoUrl: string) => void;
    onClearRepo: () => void;
    isLoading: boolean;
    githubUser: GitHubUser | null;
    onConnectGitHub: () => void;
    onDisconnectGitHub: () => void;
    customTasks: CustomTask[];
    onSaveTask: (task: CustomTask) => void;
    onDeleteTask: (taskId: string) => void;
}

// Pre-defined templates for creative and business automation
const AUTOMATION_TEMPLATES = [
    {
        id: 'novel_writer',
        title: 'Novel / Story Writer',
        description: 'Auto-draft a complete story outline, character profiles, and Chapter 1.',
        icon: <BookOpenIcon className="w-6 h-6 text-pink-400" />,
        category: 'Creative',
        prompt: "Act as a best-selling novelist. My story idea is: \"[INSERT IDEA]\". \n\nStep 1: Create a detailed plot outline with 3 acts.\nStep 2: Create detailed character profiles for the protagonist and antagonist.\nStep 3: Write the full First Chapter (at least 1000 words) setting the scene and inciting incident."
    },
    {
        id: 'epaper_generator',
        title: 'E-Paper / News Creator',
        description: 'Generate a formatted newspaper layout with headlines and articles.',
        icon: <NewspaperIcon className="w-6 h-6 text-blue-400" />,
        category: 'Journalism',
        prompt: "Act as a Chief Editor. Create a digital E-Paper (Newspaper) layout about: \"[INSERT TOPIC]\". \n\nOutput must be formatted in Markdown. Include:\n1. A Catchy Masthead/Title.\n2. Lead Story (Headline + In-depth Article).\n3. Two Side Columns (Brief news updates).\n4. An Editorial Opinion piece.\nEnsure the tone is professional and journalistic."
    },
    {
        id: 'business_analyst',
        title: 'Business Strategy Report',
        description: 'Generate a market analysis, SWOT, and execution roadmap.',
        icon: <BriefcaseIcon className="w-6 h-6 text-green-400" />,
        category: 'Business',
        prompt: "Act as a Senior Business Analyst. Analyze the business/product idea: \"[INSERT IDEA]\". \n\nProvide a comprehensive report including:\n1. Executive Summary.\n2. Target Market Analysis.\n3. SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats).\n4. A 3-Month Execution Roadmap."
    },
    {
        id: 'academic_researcher',
        title: 'Academic Research Paper',
        description: 'Draft a research paper structure with abstract and key points.',
        icon: <BeakerIcon className="w-6 h-6 text-yellow-400" />,
        category: 'Education',
        prompt: "Act as an Academic Researcher. I need to draft a paper on: \"[INSERT TOPIC]\". \n\nPlease generate:\n1. A formal Title.\n2. An Abstract (200 words).\n3. An Introduction covering background and thesis.\n4. Key Arguments/Sections outline.\n5. A Conclusion summary."
    },
    {
        id: 'content_script',
        title: 'Video/Movie Script',
        description: 'Write a screenplay or YouTube script with scene directions.',
        icon: <LightBulbIcon className="w-6 h-6 text-purple-400" />,
        category: 'Creative',
        prompt: "Act as a Screenwriter. Write a script for: \"[INSERT TOPIC/SCENE]\". \n\nFormat it properly with:\n- SCENE HEADINGS (INT/EXT)\n- ACTION lines describing the visual.\n- CHARACTER names centered.\n- DIALOGUE.\nInclude a beginning, middle, and end."
    }
];

const TaskEditor: React.FC<{
    task: CustomTask | null;
    template?: typeof AUTOMATION_TEMPLATES[0];
    onSave: (task: CustomTask) => void;
    onCancel: () => void;
}> = ({ task, template, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        if (task) {
            setName(task.name);
            setPrompt(task.prompt);
        } else if (template) {
            setName(template.title);
            setPrompt(template.prompt);
        } else {
            setName('');
            setPrompt('');
        }
    }, [task, template]);

    const handleSave = () => {
        if (name.trim() && prompt.trim()) {
            onSave({
                id: task?.id || `task-${Date.now()}`,
                name: name.trim(),
                prompt: prompt.trim(),
                trigger: 'manual',
            });
        }
    };

    return (
        <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700 space-y-4 animate-fade-in-slide-up">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">{task ? 'Edit Task' : template ? `New: ${template.title}` : 'Create Custom Task'}</h3>
                <button onClick={onCancel} className="text-gray-400 hover:text-white"><TrashIcon className="w-5 h-5" /></button>
            </div>
             <div>
                <label htmlFor="task-name" className="block text-sm font-medium text-gray-300 mb-1">Task Name</label>
                <input
                    id="task-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., My Sci-Fi Novel Generator"
                    className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500"
                    required
                />
            </div>
            <div>
                 <label htmlFor="task-prompt" className="block text-sm font-medium text-gray-300 mb-1">AI Instructions (The Prompt)</label>
                 <textarea
                    id="task-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe exactly what the AI agent should do..."
                    rows={10}
                    className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500 resize-y font-mono text-sm"
                    required
                 ></textarea>
                 <p className="text-xs text-amber-400/80 mt-1">Tip: Use [BRACKETS] to indicate where you will input specific details later.</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <button onClick={onCancel} className="px-4 py-2 text-sm font-medium bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-6 py-2 text-sm font-bold bg-amber-600 text-white rounded-md hover:bg-amber-500 shadow-lg transition-colors">
                    Save & Ready to Run
                </button>
            </div>
        </div>
    );
};

const AutomationHubView: React.FC<DeveloperToolsViewProps> = ({ analyzedRepo, onAnalyzeRepo, onClearRepo, isLoading, githubUser, onConnectGitHub, onDisconnectGitHub, customTasks, onSaveTask, onDeleteTask }) => {
    const [editingTask, setEditingTask] = useState<CustomTask | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<typeof AUTOMATION_TEMPLATES[0] | undefined>(undefined);
    const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');

    const handleEdit = (task: CustomTask) => {
        setEditingTask(task);
        setSelectedTemplate(undefined);
        setView('editor');
    };

    const handleCreateFromTemplate = (template: typeof AUTOMATION_TEMPLATES[0]) => {
        setEditingTask(null);
        setSelectedTemplate(template);
        setView('editor');
    };

    const handleCreateCustom = () => {
        setEditingTask(null);
        setSelectedTemplate(undefined);
        setView('editor');
    };

    const onSaveWrapper = (task: CustomTask) => {
        onSaveTask(task);
        setView('dashboard');
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-6 gap-6 animate-fade-in-slide-up bg-gray-900 overflow-y-auto">
            
            {/* Header */}
            <header className="flex-shrink-0 flex items-center gap-3 border-b border-gray-800 pb-6">
                <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <WrenchScrewdriverIcon className="w-8 h-8 text-green-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white neon-text-gold">Automation Hub</h1>
                    <p className="text-gray-400">Create autonomous agents to write stories, generate reports, or code for you.</p>
                </div>
            </header>

            {view === 'editor' ? (
                <div className="max-w-3xl mx-auto w-full">
                    <TaskEditor 
                        task={editingTask} 
                        template={selectedTemplate} 
                        onSave={onSaveWrapper} 
                        onCancel={() => setView('dashboard')} 
                    />
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Panel: Saved Tasks */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">My Active Agents</h3>
                            <button onClick={handleCreateCustom} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-gray-300 flex items-center gap-1 transition-colors">
                                <PlusIcon className="w-3 h-3" /> Custom
                            </button>
                        </div>
                        
                        <div className="flex-1 bg-gray-800/50 rounded-xl p-4 border border-gray-700 overflow-y-auto max-h-[600px]">
                            {customTasks.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <p>No active tasks.</p>
                                    <p className="text-xs mt-1">Select a template to start.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {customTasks.map(task => (
                                        <div key={task.id} className="bg-gray-700/80 p-4 rounded-lg border border-gray-600 hover:border-amber-500/50 transition-all group relative">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-white truncate pr-6">{task.name}</h4>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEdit(task)} className="text-gray-400 hover:text-amber-400"><PencilIcon className="w-4 h-4" /></button>
                                                    <button onClick={() => onDeleteTask(task.id)} className="text-gray-400 hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-400 line-clamp-2 font-mono bg-black/20 p-1.5 rounded">{task.prompt}</p>
                                            <button 
                                                className="mt-3 w-full py-2 bg-amber-600 text-white text-xs font-bold rounded uppercase tracking-wider hover:bg-amber-500 transition-colors shadow-lg"
                                                onClick={() => {
                                                    // Trigger logic handled in parent via chat, here we assume user copies or uses it in chat manually for now, 
                                                    // or ideally this view should emit an event to run it.
                                                    // For this UI, we will just show it's ready.
                                                    alert(`Task "${task.name}" is ready! Go to the Chat and type: "Run task: ${task.name}"`);
                                                }}
                                            >
                                                Run Agent
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Templates */}
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-4">Creative & Professional Studio</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {AUTOMATION_TEMPLATES.map(template => (
                                <button 
                                    key={template.id}
                                    onClick={() => handleCreateFromTemplate(template)}
                                    className="text-left bg-gray-800/40 p-5 rounded-xl border border-gray-700 hover:bg-gray-700/60 hover:border-gray-500 transition-all group"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-gray-900 rounded-lg group-hover:scale-110 transition-transform">
                                            {template.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{template.title}</h4>
                                            <span className="text-[10px] uppercase tracking-wider text-gray-500 border border-gray-600 px-1.5 py-0.5 rounded">{template.category}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed">{template.description}</p>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 p-6 bg-black/30 rounded-xl border border-gray-800">
                            <div className="flex items-center gap-3 mb-4">
                                <GitHubIcon className="w-6 h-6 text-white" />
                                <h3 className="text-lg font-bold text-white">Developer Tools (GitHub)</h3>
                            </div>
                            {!githubUser ? (
                                <button onClick={onConnectGitHub} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm">
                                    Connect GitHub Account
                                </button>
                            ) : (
                                <div className="text-sm text-gray-300">
                                    <p>Connected as <span className="font-semibold text-white">{githubUser.login}</span></p>
                                    <button onClick={onDisconnectGitHub} className="mt-2 text-red-400 hover:text-red-300 text-xs underline">Disconnect</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutomationHubView;
