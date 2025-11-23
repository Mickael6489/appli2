import React from 'react';
import { ArrowLeftIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

interface PlaceholderAppProps {
  appName: string;
  description: string;
  onBack: () => void;
}

const PlaceholderApp: React.FC<PlaceholderAppProps> = ({ appName, description, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-20">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Launcher</span>
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <WrenchScrewdriverIcon className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-500 dark:from-white dark:to-slate-500 mb-4">{appName}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
          {description}
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 px-6 py-4 rounded-xl max-w-sm">
          <p className="text-blue-800 dark:text-blue-200 font-bold mb-1">
            🚧 In Development
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Our engineers are hard at work building this module. Check back soon for the release!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderApp;