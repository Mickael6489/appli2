
import React, { useState, useEffect } from 'react';
import AppLauncher, { AppDefinition } from './components/AppLauncher';
import BlastBrainApp from './apps/BlastBrainApp';
import EduBrainApp from './apps/EduBrainApp';
import MoneyBrainApp from './apps/MoneyBrainApp';
import CareerBrainApp from './apps/CareerBrainApp';
import FitBrainApp from './apps/FitBrainApp';
import MineBrainApp from './apps/MineBrainApp';
import { 
  LifeBrainApp, BizBrainApp, FoodBrainApp, MindBrainApp, LinguaBrainApp, CreatorBrainApp 
} from './apps/GeneralApps';
import { 
  GeoBrainApp, SurveyBrainApp, EconBrainApp, SafeBrainApp, MechBrainApp, DrillBrainApp, MetBrainApp, EnviroBrainApp 
} from './apps/MiningApps';
import PlaceholderApp from './components/PlaceholderApp';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedApp, setSelectedApp] = useState<AppDefinition | null>(null);

  // Global Theme Management
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSelectApp = (app: AppDefinition) => {
    setSelectedApp(app);
    window.scrollTo(0, 0); // Reset scroll when entering an app
  };

  const handleBack = () => {
    setSelectedApp(null);
  };

  // Render Current View
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Global Theme Toggle (Floating if on Launcher) */}
      {!selectedApp && (
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="fixed top-6 right-6 z-50 p-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <SunIcon className="w-5 h-5 text-yellow-400"/> : <MoonIcon className="w-5 h-5 text-slate-600"/>}
        </button>
      )}

      {/* Route: Launcher */}
      {!selectedApp && (
        <AppLauncher onSelectApp={handleSelectApp} />
      )}

      {/* --- GENERAL APPS --- */}
      {selectedApp?.id === 'edu-brain' && <EduBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'money-brain' && <MoneyBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'career-brain' && <CareerBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'fit-brain' && <FitBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'life-brain' && <LifeBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'biz-brain' && <BizBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'food-brain' && <FoodBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'mind-brain' && <MindBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'lingua-brain' && <LinguaBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'creator-brain' && <CreatorBrainApp onBack={handleBack} />}

      {/* --- MINING APPS --- */}
      {selectedApp?.id === 'mine-brain' && <MineBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'blast-brain' && <BlastBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'geo-brain' && <GeoBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'survey-brain' && <SurveyBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'econ-brain' && <EconBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'safe-brain' && <SafeBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'mech-brain' && <MechBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'drill-brain' && <DrillBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'met-brain' && <MetBrainApp onBack={handleBack} />}
      {selectedApp?.id === 'enviro-brain' && <EnviroBrainApp onBack={handleBack} />}

    </div>
  );
};

export default App;
