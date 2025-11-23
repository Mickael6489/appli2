
import React, { useState } from 'react';
import { 
  ArrowLeftIcon, 
  UserGroupIcon, 
  LightBulbIcon, 
  CakeIcon, 
  FaceSmileIcon, 
  LanguageIcon, 
  VideoCameraIcon,
  PaperAirplaneIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { askBrain } from '../services/geminiService';

// --- SHARED LAYOUT FOR SIMPLE AI APPS ---
interface SimpleAIAppProps {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  inputLabel: string;
  placeholder: string;
  onBack: () => void;
  contextInputs?: React.ReactNode;
  getContextData?: () => string;
}

const SimpleAIApp: React.FC<SimpleAIAppProps> = ({ 
  id, name, icon: Icon, color, inputLabel, placeholder, onBack, contextInputs, getContextData 
}) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    const ctx = getContextData ? getContextData() : "";
    const result = await askBrain(id, input, ctx);
    setResponse(result);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className={`text-xl font-bold flex items-center gap-2 ${color}`}>
          <Icon className="w-6 h-6" />
          {name}
        </h1>
      </div>

      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full flex flex-col gap-6">
        
        {/* Input Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          {contextInputs && <div className="mb-4 space-y-4">{contextInputs}</div>}
          
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{inputLabel}</label>
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
          </div>
          <div className="flex justify-end mt-2">
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl transition-colors flex items-center gap-2 font-bold"
            >
              {isLoading ? 'Thinking...' : <><PaperAirplaneIcon className="w-5 h-5" /> Send to AI</>}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 min-h-[300px] flex flex-col">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <SparklesIcon className="w-4 h-4" /> AI Response
          </h2>
          {response ? (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
              {response}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center">
               <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-full mb-4">
                 <Icon className="w-12 h-12 opacity-50" />
               </div>
               <p>Enter your details above to get expert advice.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- INDIVIDUAL APPS ---

export const LifeBrainApp: React.FC<{onBack:()=>void}> = (props) => (
  <SimpleAIApp 
    id="life-brain" name="LifeBrain" icon={UserGroupIcon} color="text-pink-500"
    inputLabel="What's on your mind?"
    placeholder="e.g., How do I handle a disagreement with my partner about finances?"
    onBack={props.onBack}
  />
);

export const BizBrainApp: React.FC<{onBack:()=>void}> = (props) => (
  <SimpleAIApp 
    id="biz-brain" name="BizBrain" icon={LightBulbIcon} color="text-amber-500"
    inputLabel="Describe your business idea"
    placeholder="e.g., A subscription service for organic dog food delivered weekly."
    onBack={props.onBack}
  />
);

export const FoodBrainApp: React.FC<{onBack:()=>void}> = (props) => (
  <SimpleAIApp 
    id="food-brain" name="FoodBrain" icon={CakeIcon} color="text-orange-500"
    inputLabel="What ingredients do you have?"
    placeholder="e.g., Chicken breast, spinach, heavy cream, pasta."
    onBack={props.onBack}
  />
);

export const MindBrainApp: React.FC<{onBack:()=>void}> = (props) => (
  <SimpleAIApp 
    id="mind-brain" name="MindBrain" icon={FaceSmileIcon} color="text-teal-500"
    inputLabel="How are you feeling?"
    placeholder="e.g., I'm feeling overwhelmed with work and anxious about deadlines."
    onBack={props.onBack}
  />
);

export const LinguaBrainApp: React.FC<{onBack:()=>void}> = (props) => {
  const [lang, setLang] = useState('Spanish');
  return (
    <SimpleAIApp 
      id="lingua-brain" name="LinguaBrain" icon={LanguageIcon} color="text-purple-500"
      inputLabel={`Text to Translate/Explain (Target: ${lang})`}
      placeholder="e.g., Hello, how are you today?"
      onBack={props.onBack}
      contextInputs={
        <select value={lang} onChange={e=>setLang(e.target.value)} className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border dark:border-slate-700">
          <option>Spanish</option><option>French</option><option>German</option><option>Mandarin</option><option>Japanese</option>
        </select>
      }
      getContextData={() => `Target Language: ${lang}`}
    />
  );
};

export const CreatorBrainApp: React.FC<{onBack:()=>void}> = (props) => {
  const [platform, setPlatform] = useState('Instagram');
  return (
    <SimpleAIApp 
      id="creator-brain" name="CreatorBrain" icon={VideoCameraIcon} color="text-fuchsia-500"
      inputLabel="Topic or Niche"
      placeholder="e.g., Sustainable fashion tips for summer."
      onBack={props.onBack}
      contextInputs={
        <select value={platform} onChange={e=>setPlatform(e.target.value)} className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border dark:border-slate-700">
          <option>Instagram</option><option>TikTok</option><option>YouTube</option><option>LinkedIn</option><option>Twitter/X</option>
        </select>
      }
      getContextData={() => `Platform: ${platform}`}
    />
  );
};
