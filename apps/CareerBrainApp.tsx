
import React, { useState } from 'react';
import { ArrowLeftIcon, BriefcaseIcon, DocumentTextIcon, ClipboardDocumentCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { critiqueResume } from '../services/geminiService';

interface CareerBrainAppProps {
  onBack: () => void;
}

const CareerBrainApp: React.FC<CareerBrainAppProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'interview'>('resume');
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText) return;
    setIsProcessing(true);
    const result = await critiqueResume(resumeText, jobDesc);
    setFeedback(result || "Could not analyze resume.");
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <BriefcaseIcon className="w-6 h-6" />
          CareerBrain
        </h1>
        
        {/* Tab Switcher */}
        <div className="ml-auto flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
           <button 
             onClick={() => setActiveTab('resume')}
             className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'resume' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-300' : 'text-slate-500'}`}
           >
             Resume Optimizer
           </button>
           <button 
             onClick={() => setActiveTab('interview')}
             className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'interview' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-300' : 'text-slate-500'}`}
           >
             Interview Prep
           </button>
        </div>
      </div>

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        {activeTab === 'resume' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            
            {/* Input Column */}
            <div className="flex flex-col gap-4 h-full">
               <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex-1 flex flex-col">
                 <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
                   <DocumentTextIcon className="w-4 h-4" /> Paste Your Resume
                 </label>
                 <textarea 
                   className="flex-1 w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono"
                   placeholder="John Doe&#10;Software Engineer..."
                   value={resumeText}
                   onChange={e => setResumeText(e.target.value)}
                 />
               </div>

               <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 h-1/3 flex flex-col">
                 <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
                   <ClipboardDocumentCheckIcon className="w-4 h-4" /> Job Description (Optional)
                 </label>
                 <textarea 
                   className="flex-1 w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                   placeholder="Paste the job listing here to optimize for ATS keywords..."
                   value={jobDesc}
                   onChange={e => setJobDesc(e.target.value)}
                 />
               </div>
               
               <button 
                 onClick={handleAnalyze}
                 disabled={!resumeText || isProcessing}
                 className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
               >
                 {isProcessing ? 'Scanning...' : <><SparklesIcon className="w-5 h-5" /> Analyze Resume</>}
               </button>
            </div>

            {/* Output Column */}
            <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 h-full overflow-y-auto">
               {feedback ? (
                 <div className="prose prose-sm dark:prose-invert max-w-none">
                   <h3 className="text-blue-600 dark:text-blue-400 font-bold mb-4">AI Critique Report</h3>
                   <div className="whitespace-pre-wrap">{feedback}</div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                   <DocumentTextIcon className="w-16 h-16 mb-4 opacity-20" />
                   <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">Ready to optimize?</h3>
                   <p className="max-w-xs mt-2 text-sm">Paste your resume and job description to get an instant ATS score and improvement plan.</p>
                 </div>
               )}
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-full mb-6">
              <BriefcaseIcon className="w-16 h-16 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Interview Simulator</h2>
            <p className="text-slate-500 mb-6">Coming in the next update. Practice voice interviews with AI.</p>
            <button onClick={() => setActiveTab('resume')} className="text-blue-600 hover:underline">Go back to Resume Optimizer</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CareerBrainApp;
