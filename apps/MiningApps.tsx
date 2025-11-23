
import React from 'react';
import { 
  GlobeAmericasIcon, MapIcon, ChartBarIcon, ShieldCheckIcon, 
  WrenchScrewdriverIcon, TruckIcon, BeakerIcon, CloudIcon, 
  ArrowLeftIcon, PaperAirplaneIcon, SparklesIcon
} from '@heroicons/react/24/outline';
import { askBrain } from '../services/geminiService';

// --- REUSABLE MINING TOOL LAYOUT ---
// Similar to General Apps but styled for Industrial/Field use

interface MiningToolProps {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  desc: string;
  inputLabel: string;
  placeholder: string;
  onBack: () => void;
}

const MiningTool: React.FC<MiningToolProps> = ({ id, name, icon: Icon, desc, inputLabel, placeholder, onBack }) => {
  const [input, setInput] = React.useState('');
  const [response, setResponse] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    const result = await askBrain(id, input);
    setResponse(result);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-in slide-in-from-right duration-300">
      
      {/* Industrial Header */}
      <div className="bg-slate-800 text-white p-4 flex items-center gap-4 sticky top-0 z-10 shadow-lg">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Icon className="w-5 h-5 text-orange-400" />
            {name}
          </h1>
          <p className="text-xs text-slate-400">{desc}</p>
        </div>
      </div>

      <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-5 flex flex-col">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{inputLabel}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none min-h-[200px] font-mono"
          />
          <button 
            onClick={handleAnalyze}
            disabled={!input.trim() || isLoading}
            className="mt-4 w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white py-3 rounded-lg font-bold shadow transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? 'Processing...' : <><WrenchScrewdriverIcon className="w-5 h-5" /> Analyze Data</>}
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-5 flex flex-col">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <SparklesIcon className="w-4 h-4 text-orange-500" /> Analysis Report
          </h2>
          <div className="flex-1 overflow-y-auto min-h-[300px]">
            {response ? (
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-mono text-xs md:text-sm">
                {response}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center opacity-60">
                 <Icon className="w-16 h-16 mb-4" />
                 <p className="text-sm">Awaiting field data...</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

// --- IMPLEMENTATIONS ---

export const GeoBrainApp: React.FC<{onBack:()=>void}> = (props) => (
  <MiningTool id="geo-brain" name="GeoBrain" icon={GlobeAmericasIcon} desc="Geological Logging & Analysis"
    inputLabel="Core Description / Field Observations"
    placeholder="e.g., Grey fine-grained basalt, moderate alteration, quartz veining approx 5%, pyrite visible."
    onBack={props.onBack}
  />
);

export const SurveyBrainApp: React.FC<{onBack:()=>void}> = (props) => (
  <MiningTool id="survey-brain" name="SurveyBrain" icon={MapIcon} desc="Survey & Mapping Calculation"
    inputLabel="Coordinates / Volume Data"
    placeholder="e.g., Calculate volume for Stockpile A: Base Area 500m2, Height 12m, Conical shape."
    onBack={props.onBack}
  />
);

export const EconBrainApp: React.FC<{onBack:()=>void}> = (props) => (
  <MiningTool id="econ-brain" name="EconBrain" icon={ChartBarIcon} desc="Mining Economics Manager"
    inputLabel="Cost & Revenue Parameters"
    placeholder="e.g., Gold price $2000/oz, AISC $1200/oz, Mill recovery 92%, annual production 100koz. Calculate NPV."
    onBack={props.onBack}
  />
);

export const SafeBrainApp: React.FC<{onBack:()=>void}> = (props) => (
  <MiningTool id="safe-brain" name="SafeBrain" icon={ShieldCheckIcon} desc="Safety & Hazard Detection"
    inputLabel="Hazard Report / Incident Description"
    placeholder="e.g., Worker observed working at heights without harness near the crusher feed."
    onBack={props.onBack}
  />
);

export const MechBrainApp: React.FC<{onBack:()=>void}> = (props) => (
  <MiningTool id="mech-brain" name="MechBrain" icon={WrenchScrewdriverIcon} desc="Equipment Health AI"
    inputLabel="Machine Symptoms / Telemetry"
    placeholder="e.g., CAT 793F Haul Truck showing high engine temp and low oil pressure warnings."
    onBack={props.onBack}
  />
);

export const DrillBrainApp: React.FC<{onBack:()=>void}> = (props) => (
  <MiningTool id="drill-brain" name="DrillBrain" icon={TruckIcon} desc="Drill & Blast Optimization"
    inputLabel="Drilling Parameters / Penetration Data"
    placeholder="e.g., ROP dropped to 15m/hr in sandstone. Bit weight 40,000lbs. Suggest optimization."
    onBack={props.onBack}
  />
);

export const MetBrainApp: React.FC<{onBack:()=>void}> = (props) => (
  <MiningTool id="met-brain" name="MetBrain" icon={BeakerIcon} desc="Metallurgy & Processing"
    inputLabel="Mill Feed / Recovery Data"
    placeholder="e.g., Feed grade 2.5g/t, Recovery 85%. Cyanide consumption high. Diagnose issues."
    onBack={props.onBack}
  />
);

export const EnviroBrainApp: React.FC<{onBack:()=>void}> = (props) => (
  <MiningTool id="enviro-brain" name="EnviroBrain" icon={CloudIcon} desc="Environmental Compliance"
    inputLabel="Emission / Water Quality Data"
    placeholder="e.g., pH of tailings dam water is 9.5. Arsenic levels 0.5mg/L. Is this compliant?"
    onBack={props.onBack}
  />
);
