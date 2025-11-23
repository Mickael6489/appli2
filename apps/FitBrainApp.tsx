
import React, { useState } from 'react';
import { ArrowLeftIcon, HeartIcon, FireIcon, PlayIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { generateWorkout } from '../services/geminiService';

interface FitBrainAppProps {
  onBack: () => void;
}

const FitBrainApp: React.FC<FitBrainAppProps> = ({ onBack }) => {
  const [goal, setGoal] = useState('Build Muscle');
  const [equipment, setEquipment] = useState('Gym');
  const [level, setLevel] = useState('Intermediate');
  const [duration, setDuration] = useState('45 mins');
  const [plan, setPlan] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const result = await generateWorkout(goal, equipment, level, duration);
    setPlan(result || "Could not generate workout.");
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <HeartIcon className="w-6 h-6" />
          FitBrain
        </h1>
      </div>

      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar: Config */}
        <div className="md:col-span-1 space-y-6">
           <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
             <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-2">Workout Config</h3>
             
             <SelectGroup label="Goal" value={goal} setValue={setGoal} options={['Lose Weight', 'Build Muscle', 'Endurance', 'Flexibility']} />
             <SelectGroup label="Equipment" value={equipment} setValue={setEquipment} options={['Gym', 'Dumbbells Only', 'Bodyweight', 'Resistance Bands']} />
             <SelectGroup label="Level" value={level} setValue={setLevel} options={['Beginner', 'Intermediate', 'Advanced']} />
             <SelectGroup label="Duration" value={duration} setValue={setDuration} options={['15 mins', '30 mins', '45 mins', '60 mins']} />

             <button 
               onClick={handleGenerate}
               disabled={isGenerating}
               className="w-full mt-4 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
             >
               {isGenerating ? 'Generating...' : <><FireIcon className="w-5 h-5" /> Create Plan</>}
             </button>
           </div>
        </div>

        {/* Main: Plan Display */}
        <div className="md:col-span-2">
           <div className="bg-white dark:bg-slate-900 min-h-[500px] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
             {plan ? (
               <div className="prose prose-sm dark:prose-invert max-w-none">
                 <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                   <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-lg text-rose-600 dark:text-rose-400">
                     <PlayIcon className="w-6 h-6" />
                   </div>
                   <div>
                     <h2 className="text-xl font-bold m-0">{goal} Routine</h2>
                     <p className="text-slate-500 text-xs m-0">{duration} • {level} • {equipment}</p>
                   </div>
                 </div>
                 <div className="whitespace-pre-wrap">{plan}</div>
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                 <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/10 rounded-full flex items-center justify-center mb-4">
                   <SparklesIcon className="w-10 h-10 text-rose-300" />
                 </div>
                 <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">No Workout Generated</h3>
                 <p className="max-w-xs mt-2 text-sm">Select your preferences on the left and hit "Create Plan" to get a custom routine.</p>
               </div>
             )}
           </div>
        </div>

      </main>
    </div>
  );
};

const SelectGroup: React.FC<{ label: string; value: string; setValue: (v: string) => void; options: string[] }> = ({ label, value, setValue, options }) => (
  <div>
    <label className="block text-xs font-bold text-slate-400 mb-1.5">{label}</label>
    <div className="grid grid-cols-2 gap-2">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => setValue(opt)}
          className={`px-2 py-2 text-xs rounded-lg border transition-all ${
            value === opt 
              ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold' 
              : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export default FitBrainApp;
