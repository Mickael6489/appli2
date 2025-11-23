import React, { useState, useMemo } from 'react';
import { 
  UnitSystem, 
  RockType, 
  BlastPattern, 
  BlastInputs, 
  CalculationResults, 
  QualityAssessment,
  GeoHole
} from '../types';
import { 
  calculateBlastDesign, 
  getQualityAssessment, 
  getWarnings, 
  convertInputs, 
  generateHoleGrid,
  projectCoordinates,
  mToFt, 
  kgToLb 
} from '../utils/calculations';
import BlastCanvas from '../components/BlastCanvas';
import BlastMap from '../components/BlastMap';
import { analyzeBlastDesign } from '../services/geminiService';
import { 
  BeakerIcon, 
  CogIcon, 
  ExclamationTriangleIcon, 
  SparklesIcon,
  CalculatorIcon,
  ArrowLeftIcon,
  MapIcon,
  Square2StackIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

// Default State
const initialInputs: BlastInputs = {
  diameter: 0.15,
  depth: 10,
  benchLength: 50,
  benchWidth: 20,
  explosiveDensity: 1200,
  rockDensity: 2700,
  stemmingFactor: 0.7,
  burdenFactor: 30,
  rockType: RockType.Medium,
  pattern: BlastPattern.Staggered,
  latitude: -21.15, // Default (Mining Region example)
  longitude: 119.75,
  azimuth: 0,
};

interface BlastBrainAppProps {
  onBack: () => void;
}

const BlastBrainApp: React.FC<BlastBrainAppProps> = ({ onBack }) => {
  const [inputs, setInputs] = useState<BlastInputs>(initialInputs);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(UnitSystem.Metric);
  const [scale, setScale] = useState(40);
  const [showSettings, setShowSettings] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState<'schematic' | 'map'>('schematic');

  // Calculations
  const results: CalculationResults = useMemo(() => 
    calculateBlastDesign(inputs, unitSystem), 
  [inputs, unitSystem]);

  const quality: QualityAssessment = useMemo(() => 
    getQualityAssessment(results.KR), 
  [results.KR]);

  const warnings: string[] = useMemo(() => 
    getWarnings(inputs, results.Q_per_hole), 
  [inputs, results.Q_per_hole]);

  // Geospatial Calculation
  const holeCoords: GeoHole[] = useMemo(() => {
    // 1. Get Local Grid
    const localGrid = generateHoleGrid(results, inputs.pattern);
    // 2. Project to Lat/Lng
    return projectCoordinates(inputs.latitude, inputs.longitude, inputs.azimuth, localGrid);
  }, [results, inputs.pattern, inputs.latitude, inputs.longitude, inputs.azimuth]);


  // Event Handlers
  const handleInputChange = (field: keyof BlastInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleUnitToggle = () => {
    const newUnit = unitSystem === UnitSystem.Metric ? UnitSystem.Imperial : UnitSystem.Metric;
    setUnitSystem(newUnit);
    setInputs(convertInputs(inputs, newUnit));
  };

  const handleAIAnalyze = async () => {
    setIsAnalyzing(true);
    const analysis = await analyzeBlastDesign(results, quality);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setInputs(prev => ({
            ...prev,
            latitude: parseFloat(pos.coords.latitude.toFixed(6)),
            longitude: parseFloat(pos.coords.longitude.toFixed(6))
          }));
        },
        (err) => alert("Could not fetch location: " + err.message)
      );
    } else {
      alert("Geolocation not supported by this browser.");
    }
  };

  // Formatters for Display
  const fmtLen = (val: number) => unitSystem === UnitSystem.Metric 
    ? `${val.toFixed(2)} m` 
    : `${mToFt(val).toFixed(2)} ft`;
  
  const fmtMass = (val: number) => unitSystem === UnitSystem.Metric 
    ? `${val.toFixed(2)} kg` 
    : `${kgToLb(val).toFixed(2)} lb`;

  const labels = unitSystem === UnitSystem.Metric ? {
    len: 'm', dens: 'kg/m³'
  } : {
    len: 'ft', dens: 'lb/ft³'
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-in slide-in-from-right duration-300">
      
      {/* SIDEBAR: Inputs */}
      <aside className="w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen overflow-y-auto z-10 shadow-xl">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BeakerIcon className="w-6 h-6 text-blue-500" />
                BlastBrain
              </h1>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6 flex-1">
          {/* Quick Settings */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
             <div className="flex justify-between items-center mb-2">
               <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Settings</span>
               <CogIcon onClick={() => setShowSettings(!showSettings)} className="w-4 h-4 text-slate-400 cursor-pointer hover:text-blue-500"/>
             </div>
             <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Unit System</span>
                <button 
                  onClick={handleUnitToggle}
                  className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs font-bold shadow-sm transition-all"
                >
                  {unitSystem === UnitSystem.Metric ? 'Metric (m, kg)' : 'Imperial (ft, lb)'}
                </button>
             </div>
          </div>

          {/* New Section: Geolocation */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-500 rounded-full"></span> Location
            </h3>
            <div className="space-y-3">
               <div className="grid grid-cols-2 gap-3">
                 <Input 
                   label="Lat" 
                   value={inputs.latitude} 
                   onChange={v => handleInputChange('latitude', v)}
                   step={0.0001} 
                 />
                 <Input 
                   label="Lng" 
                   value={inputs.longitude} 
                   onChange={v => handleInputChange('longitude', v)}
                   step={0.0001} 
                 />
               </div>
               <div className="flex items-end gap-3">
                 <div className="flex-1">
                    <Input 
                      label="Azimuth (Deg)" 
                      value={inputs.azimuth} 
                      onChange={v => handleInputChange('azimuth', v)} 
                    />
                 </div>
                 <button 
                   onClick={handleGetLocation}
                   className="mb-[1px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 p-2 rounded flex items-center justify-center transition-colors h-[34px] w-[34px]"
                   title="Use Current Location"
                 >
                   <MapPinIcon className="w-4 h-4" />
                 </button>
               </div>
            </div>
          </section>

          {/* Input Group: Geometry */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span> Geometry
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Input 
                label={`Hole Dia (${labels.len})`} 
                value={inputs.diameter} 
                onChange={v => handleInputChange('diameter', v)} 
              />
              <Input 
                label={`Bench Depth (${labels.len})`} 
                value={inputs.depth} 
                onChange={v => handleInputChange('depth', v)} 
              />
              <Input 
                label={`Bench Len (${labels.len})`} 
                value={inputs.benchLength} 
                onChange={v => handleInputChange('benchLength', v)} 
              />
              <Input 
                label={`Bench Wid (${labels.len})`} 
                value={inputs.benchWidth} 
                onChange={v => handleInputChange('benchWidth', v)} 
              />
            </div>
          </section>

          {/* Input Group: Rock & Explosive */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span> Rock & Explosive
            </h3>
            <div className="grid grid-cols-2 gap-3">
               <Input 
                label={`Exp Density (${labels.dens})`} 
                value={inputs.explosiveDensity} 
                onChange={v => handleInputChange('explosiveDensity', v)} 
              />
              <Input 
                label={`Rock Density (${labels.dens})`} 
                value={inputs.rockDensity} 
                onChange={v => handleInputChange('rockDensity', v)} 
              />
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Rock Type</label>
                <select 
                  value={inputs.rockType}
                  onChange={(e) => handleInputChange('rockType', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {Object.values(RockType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Input Group: Design Factors */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-500 rounded-full"></span> Design Factors
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Input 
                label="Stemming Factor" 
                value={inputs.stemmingFactor} 
                onChange={v => handleInputChange('stemmingFactor', v)} 
                step={0.1}
              />
              <Input 
                label="Burden Factor" 
                value={inputs.burdenFactor} 
                onChange={v => handleInputChange('burdenFactor', v)} 
              />
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Pattern</label>
                <select 
                  value={inputs.pattern}
                  onChange={(e) => handleInputChange('pattern', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {Object.values(BlastPattern).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </section>
        </div>
        
        {/* Warning Footer */}
        {warnings.length > 0 && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800/30">
             <div className="flex items-start gap-2">
               <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0" />
               <div className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
                 {warnings.map((w, i) => <p key={i}>{w}</p>)}
               </div>
             </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
        
        {/* Top Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
           <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-lg rounded-lg p-1.5 flex items-center gap-2 pointer-events-auto border border-slate-200 dark:border-slate-700">
             {/* View Toggle */}
             <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-md">
                <button 
                  onClick={() => setViewMode('schematic')}
                  className={`p-2 rounded flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'schematic' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
                >
                  <Square2StackIcon className="w-4 h-4" /> Schematic
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
                >
                  <MapIcon className="w-4 h-4" /> Map
                </button>
             </div>
             
             {viewMode === 'schematic' && (
               <>
                 <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                 <button onClick={() => setScale(s => Math.max(5, s - 5))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">-</button>
                 <span className="text-xs font-mono w-16 text-center text-slate-700 dark:text-slate-300">Zoom</span>
                 <button onClick={() => setScale(s => Math.min(300, s + 5))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">+</button>
               </>
             )}
           </div>
           
           {/* AI Action */}
           <div className="pointer-events-auto">
             <button 
               onClick={handleAIAnalyze}
               disabled={isAnalyzing}
               className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
             >
               {isAnalyzing ? (
                 <span className="animate-pulse">Thinking...</span>
               ) : (
                 <>
                   <SparklesIcon className="w-4 h-4" />
                   <span className="text-sm font-semibold">AI Consult</span>
                 </>
               )}
             </button>
           </div>
        </div>

        {/* Canvas / Map Area */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative">
          {viewMode === 'schematic' ? (
            <BlastCanvas 
              layout={{
                B: results.B,
                S: results.S,
                rows: results.rows,
                cols: results.cols,
                pattern: inputs.pattern
              }}
              scale={scale}
              theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
            />
          ) : (
            <BlastMap 
              center={{ lat: inputs.latitude, lng: inputs.longitude }}
              holes={holeCoords}
              theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
            />
          )}
        </div>

        {/* Bottom Results Panel */}
        <div className="h-auto md:h-72 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {/* Calculated Metrics */}
                <div className="space-y-4">
                  <h3 className="text-sm uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                    <CalculatorIcon className="w-4 h-4" /> Calculated Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <ResultRow label="Burden (B)" value={fmtLen(results.B)} />
                    <ResultRow label="Spacing (S)" value={fmtLen(results.S)} />
                    <ResultRow label="Stemming (st)" value={fmtLen(results.st)} />
                    <ResultRow label="Charge/Hole" value={fmtMass(results.Q_per_hole)} />
                    <ResultRow label="Holes" value={`${results.num_holes} (${results.rows}x${results.cols})`} />
                    <ResultRow label="Total Exp" value={fmtMass(results.total_explosive)} />
                    <ResultRow label="Powder Factor" value={`${results.PF.toFixed(2)} ${unitSystem === UnitSystem.Metric ? 'kg/t' : 'lb/t'}`} highlight />
                    <ResultRow label="Stiffness (H/B)" value={results.KR.toString()} />
                  </div>
                </div>

                {/* Quality Assessment */}
                <div className="space-y-4">
                  <h3 className="text-sm uppercase font-bold text-slate-400 tracking-wider">Quality Prediction</h3>
                  <div className="space-y-2 text-sm">
                    <QualityRow label="Fragmentation" value={quality.fragmentation} />
                    <QualityRow label="Fly Rock" value={quality.flyRock} />
                    <QualityRow label="Vibration" value={quality.groundVibration} />
                    <QualityRow label="Air Blast" value={quality.airBlast} />
                  </div>
                  <div className="text-xs p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Action:</span> <span className="text-slate-600 dark:text-slate-400">{quality.action}</span>
                  </div>
                </div>

                {/* AI Insight */}
                <div className="space-y-4">
                   <h3 className="text-sm uppercase font-bold text-blue-500 tracking-wider flex items-center gap-2">
                     <SparklesIcon className="w-4 h-4" /> AI Safety Insight
                   </h3>
                   <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 p-4 rounded-lg text-sm leading-relaxed h-40 overflow-y-auto">
                     {aiAnalysis ? (
                       <p className="text-slate-700 dark:text-slate-300">{aiAnalysis}</p>
                     ) : (
                       <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                         <p>Click "AI Consult" for an intelligent safety analysis of this design.</p>
                       </div>
                     )}
                   </div>
                </div>

             </div>
          </div>
        </div>

      </main>
    </div>
  );
};

// Sub-components
const Input: React.FC<{ label: string; value: number; onChange: (v: number) => void; step?: number }> = ({ label, value, onChange, step = 0.01 }) => (
  <div>
    <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
    <input 
      type="number" 
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-slate-900 dark:text-slate-100"
    />
  </div>
);

const ResultRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <>
    <div className="text-slate-500 dark:text-slate-400">{label}</div>
    <div className={`font-mono font-medium ${highlight ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>{value}</div>
  </>
);

const QualityRow: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  let color = "text-slate-700 dark:text-slate-300";
  if (value.includes("Poor") || value.includes("Severe")) color = "text-red-600 dark:text-red-400 font-bold";
  if (value.includes("Fair")) color = "text-amber-600 dark:text-amber-400 font-semibold";
  if (value.includes("Good") || value.includes("Excellent")) color = "text-emerald-600 dark:text-emerald-400 font-semibold";

  return (
    <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1 last:border-0">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className={color}>{value}</span>
    </div>
  );
};

export default BlastBrainApp;