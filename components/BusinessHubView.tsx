
import React from 'react';
import { BriefcaseIcon, ChartPieIcon, MegaphoneIcon, LightBulbIcon, PresentationChartBarIcon, CurrencyDollarIcon, FingerPrintIcon, MapPinIcon, EnvelopeIcon, FlagIcon, SearchIcon, ShieldCheckIcon, UserIcon } from './Icons';

interface BusinessHubViewProps {
  onStartTask: (prompt: string, goal: string) => void;
}

interface BusinessTool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'strategy' | 'marketing' | 'operations' | 'finance_career';
  promptTemplate: (input: string) => string;
}

const businessTools: BusinessTool[] = [
  // Strategy Tools
  {
    id: 'business_plan',
    title: 'Business Plan Outline',
    description: 'Generate a comprehensive, structured outline for your business plan.',
    icon: <BriefcaseIcon className="w-8 h-8 text-blue-400" />,
    category: 'strategy',
    promptTemplate: (input) => `Act as my strategic co-founder. My business idea is: "${input}". Please generate a comprehensive business plan outline for it. Include sections for Executive Summary, Company Description, Market Analysis, Organization and Management, Service or Product Line, Marketing and Sales Strategy, and Financial Projections. For each section, provide a brief summary of what should be included specific to my idea.`
  },
  {
    id: 'swot_analysis',
    title: 'SWOT Analysis',
    description: 'Identify key Strengths, Weaknesses, Opportunities, and Threats.',
    icon: <ChartPieIcon className="w-8 h-8 text-green-400" />,
    category: 'strategy',
    promptTemplate: (input) => `Act as a senior business consultant. Analyze my business idea: "${input}". Please conduct a detailed SWOT analysis. For each Strength, Weakness, Opportunity, and Threat, provide a bulleted list of factors. Conclude with a strategic recommendation on how to leverage strengths to capture opportunities.`
  },
  {
    id: 'pitch_deck',
    title: 'Investor Pitch Deck (Enterprise)',
    description: 'Generate a 15-slide enterprise-grade deck strategy.',
    icon: <PresentationChartBarIcon className="w-8 h-8 text-amber-400" />,
    category: 'strategy',
    promptTemplate: (input) => `Act as a top-tier Venture Capital consultant and Akshat AI strategic partner. Structure a comprehensive 15-slide 'Enterprise Grade' investor pitch deck for my business: "${input}". 
    
    Use the following high-standard 'Akshat AI Enterprise' framework for the slides:
    1. **Vision & Market Opportunity:** Mission, Total Addressable Market (TAM), Serviceable Obtainable Market (SOM), and the specific gap in the market (focus on Bharat Scale opportunity).
    2. **Problem Identification:** Clear, quantifiable pain points and the inefficiencies of current solutions (mis-selling, low trust, fragmentation).
    3. **Solution Overview:** The product/service description and how it solves the problem (The "Second Soul Model" - emotional + strategic).
    4. **Core Technology Stack:** The AI/Tech architecture, scalability, multi-language capabilities, and failsafe mechanisms.
    5. **Unique Value Proposition (UVP):** Why this solution is 10x better (e.g., Complete life advisory, Trust layer, Bharat-optimized).
    6. **Product Features:** Key differentiators, user benefits, and B2B/B2C utility.
    7. **Business Model & Revenue Streams:** Revenue streams (Subscription, B2B Licensing, Micro-services).
    8. **Traction & Early Validation:** Metrics, pilot results, existing customer data, and retention scores.
    9. **Go-To-Market Strategy:** Distribution channels (WhatsApp, Partnerships, Influencers, Campus outreach).
    10. **Competitive Advantage:** Landscape mapping and unfair advantages (Data, Trust, Speed, Deep India-centric training).
    11. **Financial Projections:** 3-5 year forecast (Revenue, CAC vs LTV, Profitability timeline).
    12. **Team & Leadership:** Founder vision, key expertise, and advisory board.
    13. **Funding Requirements:** Total ask, utilization plan, and runway.
    14. **Risk Mitigation:** Compliance guardrails, safety filters, and redundancy plans.
    15. **Final Impression:** "Why We Will Win" - A closing power statement.

    For each slide, provide a strong Headline and 3-4 bullet points of specific content tailored to the business idea provided.`
  },
  {
    id: 'competitor_analysis',
    title: 'Competitor Analysis Framework',
    description: 'Analyze potential rivals and define your competitive advantage.',
    icon: <FlagIcon className="w-8 h-8 text-red-400" />,
    category: 'strategy',
    promptTemplate: (input) => `Act as a market researcher. My business is: "${input}". Help me conduct a competitor analysis. Identify 3 potential types of direct or indirect competitors. For each, list likely strengths and weaknesses. Then, define my "Unfair Advantage" or Unique Value Proposition (UVP) that differentiates me from them.`
  },

  // Marketing Tools
  {
    id: 'marketing_slogans',
    title: 'Marketing Slogans',
    description: 'Brainstorm catchy and memorable slogans for your brand.',
    icon: <MegaphoneIcon className="w-8 h-8 text-purple-400" />,
    category: 'marketing',
    promptTemplate: (input) => `Act as a creative director. My business is: "${input}". Generate a list of 10 catchy and memorable marketing slogans or taglines. Provide a mix of styles: descriptive, emotional, witty, and short/punchy.`
  },
  {
    id: 'brand_identity',
    title: 'Brand Identity Workshop',
    description: 'Define your Mission, Vision, Values, and Brand Voice.',
    icon: <FingerPrintIcon className="w-8 h-8 text-pink-400" />,
    category: 'marketing',
    promptTemplate: (input) => `Act as a brand strategist. I need to define the core identity for my business: "${input}". Please draft a Mission Statement (why we exist), a Vision Statement (where we are going), 4 Core Values (what we stand for), and describe our Brand Voice (how we speak to customers).`
  },
  {
    id: 'elevator_pitch',
    title: 'Elevator Pitch Crafter',
    description: 'Create a compelling 30-second pitch to attract interest.',
    icon: <LightBulbIcon className="w-8 h-8 text-yellow-400" />,
    category: 'marketing',
    promptTemplate: (input) => `Help me craft a compelling 30-second elevator pitch for my business idea: "${input}". The pitch should clearly hook the listener, explain the problem, present my solution, describe the target market, and state the unique value proposition.`
  },
  
  // Operations & Finance
  {
    id: 'financial_projections',
    title: 'Financial Modeling Assistant',
    description: 'Estimate revenue streams and key cost drivers.',
    icon: <CurrencyDollarIcon className="w-8 h-8 text-emerald-400" />,
    category: 'operations',
    promptTemplate: (input) => `Act as a CFO. My business model is: "${input}". Help me build a mental model for financial projections. List the primary Revenue Streams (how we make money) and the major Cost Drivers (fixed and variable costs). Provide a rough formula or logic for how I should calculate my break-even point.`
  },
  {
    id: 'product_roadmap',
    title: 'Product Roadmap',
    description: 'Plan key milestones for your MVP and future growth.',
    icon: <MapPinIcon className="w-8 h-8 text-orange-400" />,
    category: 'operations',
    promptTemplate: (input) => `Act as a Product Manager. My product/service is: "${input}". Create a high-level product roadmap for the next 12 months. Break it down into 3 phases: MVP (Minimum Viable Product) Launch, Post-Launch Iteration, and Growth/Scale. List key features or milestones for each phase.`
  },
  {
    id: 'cold_outreach',
    title: 'Cold Outreach Writer',
    description: 'Draft professional emails to partners or leads.',
    icon: <EnvelopeIcon className="w-8 h-8 text-cyan-400" />,
    category: 'operations',
    promptTemplate: (input) => `Act as a Sales Development Rep. My business is "${input}". Write a cold outreach email template to potential B2B partners or early customers. The subject line should be high-converting. The body should be concise, focus on the value for them, and have a clear Call to Action (CTA).`
  },
  {
    id: 'launch_readiness',
    title: 'Public Launch Readiness',
    description: 'Validate your product against enterprise stability and UX standards.',
    icon: <FlagIcon className="w-8 h-8 text-indigo-400" />,
    category: 'operations',
    promptTemplate: (input) => `Act as a Chief Product Officer ensuring a "Public Ready" launch for: "${input}". Generate a rigorous validation checklist based on the 'Aksht AI - Public Ready Launch Checklist' standards.
    
    The checklist must cover these 8 domains with specific "Yes/No" audit questions:
    1. **Core System Stability:** Uptime, load testing (10k+ users), latency (<1s), multi-language support, fallback systems.
    2. **Domain Intelligence Quality:** Finance-grade accuracy, compliance checks, deep knowledge of relevant ecosystems.
    3. **User Experience Layer:** Human-like flow, zero confusion, consistent tone, instant summaries.
    4. **Safety, Compliance & Privacy:** Financial safety filters, no medical/illegal misuse, privacy compliance, clear AI disclosure.
    5. **Infrastructure & Scalability:** Auto-scaling, monitoring dashboards, crash recovery.
    6. **Continuous Improvement Loop:** Bug reporting, feedback integration, model improvements.
    7. **Branding, Identity & Persona:** Clear mission, communication style, visual identity.
    8. **Final Battlefield Test:** Blind tests with real users, common mistake simulations, stress tests.
    
    For each domain, provide a list of critical items to check off.`
  },

  // Finance & Career Tools
  {
    id: 'career_roadmap',
    title: 'Career Path Strategist',
    description: 'Design a step-by-step career growth plan tailored for India.',
    icon: <UserIcon className="w-8 h-8 text-teal-400" />,
    category: 'finance_career',
    promptTemplate: (input) => `Act as a Senior Career Coach & Strategist for the Indian market. My current role/goal is: "${input}". Create a detailed Career Roadmap. Include: 
    1. **Skill Gap Analysis** (focusing on high-demand skills in India). 
    2. **Certification/Education** recommendations (Global & Indian). 
    3. **Networking Strategy** (LinkedIn & Local Communities). 
    4. A **1-Year, 3-Year, and 5-Year progression plan**. 
    5. **Salary expectations** in Tier 1 vs Tier 2 cities for this role.`
  },
  {
    id: 'loan_advisor',
    title: 'Smart Loan Navigator',
    description: 'Analyze loan eligibility and find the best schemes (Mudra/Personal).',
    icon: <CurrencyDollarIcon className="w-8 h-8 text-lime-400" />,
    category: 'finance_career',
    promptTemplate: (input) => `Act as a Financial Loan Advisor specialized in the Indian banking system. I need a loan for: "${input}". Analyze the best loan types available (e.g., Personal Loan, Mudra Loan, MSME schemes, Home Loan). For each type, list: 
    1. **Eligibility Criteria** (Age, Income, CIBIL Score requirements). 
    2. **Typical Interest Rates** & Tenure. 
    3. **Documentation Required** (KYC, ITR, Bank Statements). 
    4. **Pros & Cons** of each option. 
    
    If the user is looking for a personal loan, specifically mention they can check eligibility with partners like Fi Money.`
  },
  {
    id: 'insurance_guide',
    title: 'Insurance Policy Decoder',
    description: 'Understand complex insurance terms and find the right coverage.',
    icon: <ShieldCheckIcon className="w-8 h-8 text-rose-400" />,
    category: 'finance_career',
    promptTemplate: (input) => `Act as an Insurance Expert for the Indian market. My profile/need is: "${input}". Recommend the types of insurance coverage I should consider (Term Life, Health/Mediclaim, General). 
    
    Explain key terms I should look for in a policy (e.g., **IDV, No Claim Bonus, Waiting Period, Copay, Room Rent Capping**). 
    Provide a checklist for comparing policies from Indian insurers (LIC, HDFC, ICICI, etc.).`
  }
];

const BusinessHubView: React.FC<BusinessHubViewProps> = ({ onStartTask }) => {
    
    const handleToolClick = (tool: BusinessTool) => {
        const goal = window.prompt(`Enter details for the "${tool.title}" task:\n(e.g., your goals, specific industry, or requirements)`, "");
        if (goal && goal.trim()) {
            const fullPrompt = tool.promptTemplate(goal.trim());
            onStartTask(fullPrompt, goal);
        }
    };

    const renderCategory = (title: string, categoryId: string) => {
        const tools = businessTools.filter(t => t.category === categoryId);
        if (tools.length === 0) return null;

        return (
            <div className="mb-8 w-full max-w-5xl">
                <h3 className="text-xl font-semibold text-amber-500 mb-4 border-b border-gray-700 pb-2 text-left flex items-center gap-2 uppercase tracking-wider text-sm">
                    {title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map(tool => (
                        <button
                            key={tool.id}
                            onClick={() => handleToolClick(tool)}
                            className="text-left p-5 bg-gray-800/50 rounded-xl hover:bg-gray-700/80 transition-all duration-200 transform hover:-translate-y-1 shadow-lg border border-gray-700/50 hover:border-amber-500/30 group"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-2 bg-gray-900 rounded-lg group-hover:scale-110 transition-transform">
                                    {tool.icon}
                                </div>
                               <h3 className="font-bold text-md text-gray-100 group-hover:text-white leading-tight">{tool.title}</h3>
                            </div>
                            <p className="text-sm text-gray-400 group-hover:text-gray-300">{tool.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 h-full flex flex-col items-center text-white text-center animate-fade-in-slide-up bg-gray-900 overflow-y-auto">
            <header className="mb-8 max-w-2xl">
                <div className="inline-block p-3 bg-amber-500/10 rounded-full mb-4">
                    <BriefcaseIcon className="w-12 h-12 text-amber-500" />
                </div>
                <h2 className="text-4xl font-bold neon-text-gold mb-2">Business Intelligence Hub</h2>
                <p className="text-gray-400 text-lg">
                    A dedicated module for startups and SMEs to generate pitch decks, SWOT analyses, and financial roadmaps instantly.
                </p>
            </header>

            {renderCategory("Strategy & Planning", "strategy")}
            {renderCategory("Marketing & Brand", "marketing")}
            {renderCategory("Operations & Execution", "operations")}
            {renderCategory("Finance & Career Growth", "finance_career")}
            
            <footer className="mt-8 text-sm text-gray-500 pb-8">
                Powered by Akshat's specialized business intelligence models.
            </footer>
        </div>
    );
};

export default BusinessHubView;
