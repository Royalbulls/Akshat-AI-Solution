
import React, { useState, useEffect, useRef } from 'react';
import { AutomationProject, AgentTask, AgentStep } from '../types';
import { BookOpenIcon, NewspaperIcon, BriefcaseIcon, BeakerIcon, SparklesIcon, ClipboardIcon, PlusIcon, DocumentTextIcon, CubeTransparentIcon, WrenchScrewdriverIcon, ImageIcon, DownloadIcon, AgentIcon, CheckCircleIcon, StopIcon } from './Icons';
import { generateStructuredProject, generateImage, createAgentTaskPlan, generateAgentTaskDraft, selfCorrectAgentResult } from '../services/geminiService';

interface AutomationHubViewProps {}

// Templates for the Automation Studio
const STUDIO_TEMPLATES = [
    {
        id: 'autonomous_agent',
        title: 'Autonomous Research Agent',
        description: 'Deploy an AI agent to plan, research, draft, and self-correct a complex task automatically.',
        icon: <AgentIcon className="w-8 h-8 text-red-400" />,
        category: 'Advanced',
        placeholder: 'e.g., Analyze the impact of Web3 on traditional banking and predict trends for 2030...'
    },
    {
        id: 'novel_writer',
        title: 'Book Printer & Novelist',
        description: 'Generate a complete illustrated story bible: Plot Outline, Character Profiles, and Chapter 1.',
        icon: <BookOpenIcon className="w-8 h-8 text-pink-400" />,
        category: 'Creative Writing',
        placeholder: 'e.g., A cyberpunk detective story set in Mumbai 2099...'
    },
    {
        id: 'news_generator',
        title: 'E-Paper / News Desk',
        description: 'Create a formatted newspaper layout with Headlines, Articles, and Editorials.',
        icon: <NewspaperIcon className="w-8 h-8 text-blue-400" />,
        category: 'Journalism',
        placeholder: 'e.g., The discovery of alien life on Mars...'
    },
    {
        id: 'business_report',
        title: 'Business Strategy Report',
        description: 'Draft a structured business report with Executive Summary, Market Analysis, and Roadmap.',
        icon: <BriefcaseIcon className="w-8 h-8 text-green-400" />,
        category: 'Business',
        placeholder: 'e.g., Launching a sustainable coffee brand in India...'
    },
    {
        id: '3d_concept',
        title: '3D Concept Designer',
        description: 'Create detailed visual descriptions for 3D assets, environments, and character models.',
        icon: <CubeTransparentIcon className="w-8 h-8 text-cyan-400" />,
        category: 'Design & 3D',
        placeholder: 'e.g., A futuristic sci-fi hoverbike with neon accents...'
    },
    {
        id: 'academic_research',
        title: 'Deep Research Paper',
        description: 'Draft an academic paper structure: Abstract, Introduction, Arguments, and Conclusion.',
        icon: <BeakerIcon className="w-8 h-8 text-yellow-400" />,
        category: 'Education',
        placeholder: 'e.g., The impact of AI on modern healthcare systems...'
    }
];

const AutomationHubView: React.FC<AutomationHubViewProps> = () => {
    // Project State
    const [activeProject, setActiveProject] = useState<AutomationProject | null>(null);
    // Agent State
    const [activeAgentTask, setActiveAgentTask] = useState<AgentTask | null>(null);
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<typeof STUDIO_TEMPLATES[0] | null>(null);
    const [copiedSectionIndex, setCopiedSectionIndex] = useState<number | null>(null);
    const [agentLog, setAgentLog] = useState<string[]>([]);

    const handleTemplateSelect = (template: typeof STUDIO_TEMPLATES[0]) => {
        setSelectedTemplate(template);
        setActiveProject(null);
        setActiveAgentTask(null);
        setUserInput('');
        setAgentLog([]);
    };

    const handleGenerate = async () => {
        if (!selectedTemplate || !userInput.trim()) return;
        
        setIsGenerating(true);

        // Route to specific handler
        if (selectedTemplate.id === 'autonomous_agent') {
            await handleRunAgent();
        } else {
            await handleGenerateProject();
        }
    };

    const handleGenerateProject = async () => {
        if (!selectedTemplate) return;
        try {
            const project = await generateStructuredProject(selectedTemplate.title, userInput);
            setActiveProject(project);
        } catch (error) {
            alert("Failed to generate project. Please try again.");
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRunAgent = async () => {
        const taskId = `agent-${Date.now()}`;
        const initialTask: AgentTask = {
            id: taskId,
            goal: userInput,
            plan: [],
            status: 'planning',
            progress: 0
        };
        setActiveAgentTask(initialTask);
        setAgentLog(prev => [...prev, "Initializing Agent..."]);

        try {
            // Step 1: Planning
            setAgentLog(prev => [...prev, "Step 1: Reasoning & Planning..."]);
            const plan = await createAgentTaskPlan(userInput);
            
            setActiveAgentTask(prev => prev ? { 
                ...prev, 
                plan, 
                status: 'running', 
                progress: 20 
            } : null);
            
            // Step 2: Execution (Drafting)
            setAgentLog(prev => [...prev, "Step 2: Perception & Action (Drafting)..."]);
            // Mark steps as in-progress/completed for visual effect
            const updatePlanStatus = (stepName: string, status: 'in-progress' | 'completed') => {
                setActiveAgentTask(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        plan: prev.plan.map(s => s.name === stepName ? { ...s, status } : s)
                    };
                });
            };

            // Simulate step progression
            updatePlanStatus('Reasoning', 'completed');
            updatePlanStatus('Perception', 'in-progress');
            await new Promise(r => setTimeout(r, 1000));
            updatePlanStatus('Perception', 'completed');
            updatePlanStatus('Action', 'in-progress');

            const draft = await generateAgentTaskDraft(userInput, plan);
            setActiveAgentTask(prev => prev ? { 
                ...prev, 
                finalResult: draft,
                status: 'finalizing',
                progress: 60
            } : null);
            updatePlanStatus('Action', 'completed');

            // Step 3: Self-Correction
            setAgentLog(prev => [...prev, "Step 3: Self-Correction & Refinement..."]);
            updatePlanStatus('Self-Correction', 'in-progress');
            
            const finalResult = await selfCorrectAgentResult(userInput, draft);
            
            updatePlanStatus('Self-Correction', 'completed');
            setActiveAgentTask(prev => prev ? { 
                ...prev, 
                finalResult: finalResult,
                status: 'completed',
                progress: 100
            } : null);
            setAgentLog(prev => [...prev, "Mission Complete."]);

        } catch (error: any) {
            setAgentLog(prev => [...prev, `Error: ${error.message}`]);
            setActiveAgentTask(prev => prev ? { ...prev, status: 'error', errorDetails: error.message } : null);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateImage = async (index: number) => {
        if (!activeProject) return;
        const section = activeProject.sections[index];
        if (!section.imagePrompt) return;

        const updatedSections = [...activeProject.sections];
        updatedSections[index] = { ...section, imageStatus: 'generating' };
        setActiveProject({ ...activeProject, sections: updatedSections });

        try {
            const imageUrl = await generateImage(section.imagePrompt);
            const finishedSections = [...activeProject.sections];
            finishedSections[index] = { ...section, imageUrl, imageStatus: 'done' };
            setActiveProject({ ...activeProject, sections: finishedSections });
        } catch (error) {
            const errorSections = [...activeProject.sections];
            errorSections[index] = { ...section, imageStatus: 'error' };
            setActiveProject({ ...activeProject, sections: errorSections });
            alert("Image generation failed for this section.");
        }
    };

    const handleCopySection = (content: string, index: number) => {
        navigator.clipboard.writeText(content);
        setCopiedSectionIndex(index);
        setTimeout(() => setCopiedSectionIndex(null), 2000);
    };

    const handleReset = () => {
        setActiveProject(null);
        setActiveAgentTask(null);
        setSelectedTemplate(null);
        setUserInput('');
        setAgentLog([]);
        setIsGenerating(false);
    };

    // --- RENDER: AGENT VIEW ---
    if (activeAgentTask) {
        return (
            <div className="h-full bg-gray-900 text-white p-4 md:p-6 overflow-y-auto animate-fade-in-slide-up">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-700 pb-4">
                    <div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <AgentIcon className="w-4 h-4 text-red-400" />
                            <span className="uppercase tracking-wider text-red-400 font-bold">Autonomous Agent</span>
                            <span>•</span>
                            <span className={`uppercase font-mono text-xs px-2 py-0.5 rounded ${activeAgentTask.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'}`}>
                                {activeAgentTask.status}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white neon-text-gold truncate max-w-3xl" title={activeAgentTask.goal}>
                            Mission: {activeAgentTask.goal}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleReset} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-colors flex items-center gap-2">
                            <StopIcon className="w-4 h-4" /> Abort / New
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
                    {/* Left Col: The Plan */}
                    <div className="space-y-6">
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 shadow-lg">
                            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Strategic Plan</h3>
                            {activeAgentTask.plan.length === 0 ? (
                                <div className="flex items-center gap-3 text-gray-400 italic">
                                    <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                    Formulating strategy...
                                </div>
                            ) : (
                                <div className="space-y-4 relative">
                                    {/* Connecting Line */}
                                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-700 z-0"></div>
                                    
                                    {activeAgentTask.plan.map((step, idx) => (
                                        <div key={idx} className="relative z-10 flex items-start gap-3">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                                                step.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                                                step.status === 'in-progress' ? 'bg-blue-900 border-blue-400 text-blue-200 animate-pulse' :
                                                'bg-gray-900 border-gray-600 text-gray-500'
                                            }`}>
                                                {step.status === 'completed' ? <CheckCircleIcon className="w-4 h-4" /> : <span className="text-xs font-mono">{idx + 1}</span>}
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-bold ${step.status === 'in-progress' ? 'text-blue-300' : 'text-gray-200'}`}>{step.name}</h4>
                                                <p className="text-xs text-gray-400">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Agent Logs */}
                        <div className="bg-black border border-gray-800 rounded-xl p-4 font-mono text-xs h-48 overflow-y-auto shadow-inner">
                            <p className="text-green-500 mb-2">$ tail -f agent_core.log</p>
                            {agentLog.map((log, i) => (
                                <p key={i} className="text-gray-400 border-l-2 border-gray-800 pl-2 mb-1">
                                    <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> {log}
                                </p>
                            ))}
                            {activeAgentTask.status === 'running' && <span className="inline-block w-2 h-4 bg-green-500 animate-pulse"></span>}
                        </div>
                    </div>

                    {/* Right Col: Output */}
                    <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl flex flex-col min-h-[600px]">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50 rounded-t-xl">
                            <h3 className="font-bold text-gray-200 flex items-center gap-2">
                                <DocumentTextIcon className="w-5 h-5 text-amber-400" />
                                Agent Output
                            </h3>
                            {activeAgentTask.finalResult && (
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(activeAgentTask.finalResult || '');
                                        alert("Copied!");
                                    }}
                                    className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded text-white flex items-center gap-1 transition-colors"
                                >
                                    <ClipboardIcon className="w-3 h-3" /> Copy
                                </button>
                            )}
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto bg-gray-900/30">
                            {!activeAgentTask.finalResult ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <SparklesIcon className="w-6 h-6 text-blue-400 animate-pulse" />
                                        </div>
                                    </div>
                                    <p className="animate-pulse">Synthesizing intelligence...</p>
                                </div>
                            ) : (
                                <div className="prose prose-invert max-w-none prose-headings:text-amber-400 prose-a:text-blue-400 prose-strong:text-white">
                                    {activeAgentTask.status === 'finalizing' && (
                                        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded text-blue-300 text-sm flex items-center gap-2 animate-pulse">
                                            <WrenchScrewdriverIcon className="w-4 h-4" />
                                            Self-Correction in progress. Refining draft...
                                        </div>
                                    )}
                                    {/* Simple Markdown rendering (replace \n with br for basic view) */}
                                    <div dangerouslySetInnerHTML={{ __html: activeAgentTask.finalResult.replace(/\n/g, '<br/>') }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER: PROJECT VIEW (Existing) ---
    if (activeProject) {
        return (
            <div className="h-full bg-gray-900 text-white p-4 md:p-6 overflow-y-auto animate-fade-in-slide-up">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-700 pb-4">
                    <div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <span className="uppercase tracking-wider text-amber-500 font-bold">{activeProject.type}</span>
                            <span>•</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white neon-text-gold">{activeProject.title}</h1>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => {
                                const fullText = activeProject.sections.map(s => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n');
                                const blob = new Blob([fullText], { type: 'text/markdown' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${activeProject.title.replace(/\s+/g, '_')}.md`;
                                a.click();
                            }}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-colors flex items-center gap-2"
                        >
                            <DocumentTextIcon className="w-4 h-4" />
                            Export Full Doc
                        </button>
                        <button 
                            onClick={handleReset}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold transition-colors flex items-center gap-2"
                        >
                            <PlusIcon className="w-4 h-4" />
                            New Project
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
                    {activeProject.sections.map((section, index) => (
                        <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg flex flex-col h-full hover:border-amber-500/30 transition-colors group">
                            <div className="relative aspect-video bg-black/40 border-b border-gray-700/50 overflow-hidden rounded-t-xl group-hover:bg-black/60 transition-colors">
                                {section.imageUrl ? (
                                    <div className="relative w-full h-full group/image">
                                        <img src={section.imageUrl} alt={section.title} className="w-full h-full object-cover" />
                                        <a 
                                            href={section.imageUrl} 
                                            download={`illustration-${index}.png`}
                                            className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-black/80"
                                        >
                                            <DownloadIcon className="w-4 h-4" />
                                        </a>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        {section.imageStatus === 'generating' ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-xs text-amber-500 animate-pulse">Painting...</span>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleGenerateImage(index)}
                                                className="flex flex-col items-center gap-2 text-gray-500 hover:text-amber-400 transition-colors opacity-60 hover:opacity-100"
                                            >
                                                <ImageIcon className="w-8 h-8" />
                                                <span className="text-xs font-semibold">Generate Illustration</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-b border-gray-700/50 bg-gray-900/30 flex justify-between items-center">
                                <h3 className="font-bold text-amber-400 truncate pr-2">{section.title}</h3>
                                <button 
                                    onClick={() => handleCopySection(section.content, index)}
                                    className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
                                    title="Copy to clipboard"
                                >
                                    {copiedSectionIndex === index ? (
                                        <span className="text-xs text-green-400 font-bold">Copied!</span>
                                    ) : (
                                        <ClipboardIcon className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            <div className="p-5 flex-1">
                                <div className="prose prose-sm prose-invert max-w-none text-gray-300 whitespace-pre-wrap font-serif leading-relaxed line-clamp-[10] hover:line-clamp-none transition-all duration-300">
                                    {section.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- RENDER: DASHBOARD (Template Selection) ---
    return (
        <div className="h-full bg-gray-900 text-white p-4 md:p-8 overflow-y-auto animate-fade-in-slide-up flex flex-col items-center w-full">
            <header className="text-center mb-10 max-w-2xl w-full">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
                        <WrenchScrewdriverIcon className="w-12 h-12 text-amber-500" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold neon-text-gold mb-3">Automation Studio</h1>
                <p className="text-gray-400 text-lg">Deploy Autonomous Agents or use Templates to build books, reports, and projects.</p>
            </header>

            {!selectedTemplate ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full pb-10">
                    {STUDIO_TEMPLATES.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => handleTemplateSelect(template)}
                            className={`flex flex-col items-start p-6 bg-gray-800/50 border rounded-xl transition-all duration-200 text-left group shadow-lg h-full hover:-translate-y-1 ${
                                template.id === 'autonomous_agent' 
                                ? 'border-red-500/30 hover:bg-red-900/10 hover:border-red-500/60' 
                                : 'border-gray-700 hover:bg-gray-700/80 hover:border-amber-500/50'
                            }`}
                        >
                            <div className="flex items-center gap-4 mb-4 w-full">
                                <div className={`p-3 rounded-lg group-hover:scale-110 transition-transform shadow-inner border ${template.id === 'autonomous_agent' ? 'bg-red-900/20 border-red-500/30' : 'bg-gray-900 border-gray-800'}`}>
                                    {template.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-lg font-bold transition-colors truncate ${template.id === 'autonomous_agent' ? 'text-red-100 group-hover:text-red-400' : 'text-white group-hover:text-amber-400'}`}>
                                        {template.title}
                                    </h3>
                                    <span className={`text-[10px] uppercase tracking-wider font-bold border px-1.5 py-0.5 rounded mt-1 inline-block ${template.id === 'autonomous_agent' ? 'border-red-800 text-red-400' : 'border-gray-600 text-gray-500'}`}>
                                        {template.category}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">{template.description}</p>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="max-w-3xl w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl animate-fade-in-slide-up backdrop-blur-sm mb-10">
                    <button onClick={handleReset} className="mb-6 text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-colors px-3 py-2 rounded-lg hover:bg-gray-700/50 w-fit">
                        <span>←</span> Back to Studio
                    </button>
                    
                    <div className="flex items-center gap-4 mb-6 border-b border-gray-700 pb-6">
                        <div className="p-4 bg-gray-900 rounded-xl border border-gray-700">
                            {selectedTemplate.icon}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{selectedTemplate.title}</h2>
                            <p className="text-gray-400">{selectedTemplate.id === 'autonomous_agent' ? 'Define the mission for your AI agent.' : 'Ready to build your project.'}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                {selectedTemplate.id === 'autonomous_agent' ? 'Mission Goal:' : 'Describe your idea in detail:'}
                            </label>
                            <textarea 
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder={selectedTemplate.placeholder}
                                rows={6}
                                className="w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none text-lg shadow-inner"
                                autoFocus
                            />
                        </div>

                        <button 
                            onClick={handleGenerate}
                            disabled={isGenerating || !userInput.trim()}
                            className={`w-full py-4 text-white font-bold text-lg rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 ${
                                selectedTemplate.id === 'autonomous_agent'
                                ? 'bg-red-600 hover:bg-red-500 hover:shadow-red-500/20'
                                : 'bg-amber-600 hover:bg-amber-500 hover:shadow-amber-500/20'
                            }`}
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>{selectedTemplate.id === 'autonomous_agent' ? 'Deploying Agent...' : 'Architecting Project...'}</span>
                                </>
                            ) : (
                                <>
                                    {selectedTemplate.id === 'autonomous_agent' ? <AgentIcon className="w-6 h-6" /> : <SparklesIcon className="w-6 h-6" />}
                                    <span>{selectedTemplate.id === 'autonomous_agent' ? 'Start Mission' : 'Generate Pages & Panels'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutomationHubView;
