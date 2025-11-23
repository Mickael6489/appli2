
import React, { useState } from 'react';
import { 
  AcademicCapIcon, 
  BanknotesIcon, 
  BriefcaseIcon, 
  HeartIcon, 
  UserGroupIcon, 
  LightBulbIcon, 
  CakeIcon, 
  FaceSmileIcon, 
  LanguageIcon, 
  VideoCameraIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  GlobeAmericasIcon,
  MapIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  TruckIcon,
  CpuChipIcon,
  FireIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

export type AppId = 
  | 'edu-brain' | 'money-brain' | 'career-brain' | 'fit-brain' | 'life-brain' 
  | 'biz-brain' | 'food-brain' | 'mind-brain' | 'lingua-brain' | 'creator-brain'
  | 'mine-brain' | 'blast-brain' | 'geo-brain' | 'survey-brain' | 'econ-brain'
  | 'safe-brain' | 'mech-brain' | 'drill-brain' | 'met-brain' | 'enviro-brain';

export interface AppDefinition {
  id: AppId;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'General' | 'Mining';
  isImplemented: boolean;
}

export const APPS: AppDefinition[] = [
  // General Apps
  { id: 'edu-brain', name: 'EduBrain', description: 'AI Study Assistant & Homework Solver', icon: AcademicCapIcon, category: 'General', isImplemented: true },
  { id: 'money-brain', name: 'MoneyBrain', description: 'Personal Finance & Investment Planner', icon: BanknotesIcon, category: 'General', isImplemented: true },
  { id: 'career-brain', name: 'CareerBrain', description: 'Resume, CV & Job Application Builder', icon: BriefcaseIcon, category: 'General', isImplemented: true },
  { id: 'fit-brain', name: 'FitBrain', description: 'AI Fitness & Health Coach', icon: HeartIcon, category: 'General', isImplemented: true },
  { id: 'life-brain', name: 'LifeBrain', description: 'Relationship & Social Coach', icon: UserGroupIcon, category: 'General', isImplemented: true },
  { id: 'biz-brain', name: 'BizBrain', description: 'Business Plan & Startup Builder', icon: LightBulbIcon, category: 'General', isImplemented: true },
  { id: 'food-brain', name: 'FoodBrain', description: 'Cooking & Nutrition Assistant', icon: CakeIcon, category: 'General', isImplemented: true },
  { id: 'mind-brain', name: 'MindBrain', description: 'Therapy & Mental Health Coach', icon: FaceSmileIcon, category: 'General', isImplemented: true },
  { id: 'lingua-brain', name: 'LinguaBrain', description: 'Translator & Language Tutor', icon: LanguageIcon, category: 'General', isImplemented: true },
  { id: 'creator-brain', name: 'CreatorBrain', description: 'Social Media Content Creator', icon: VideoCameraIcon, category: 'General', isImplemented: true },
  
  // Mining Apps
  { id: 'mine-brain', name: 'MineBrain', description: 'Full Mining Super-Suite', icon: CpuChipIcon, category: 'Mining', isImplemented: true },
  { id: 'blast-brain', name: 'BlastBrain', description: 'AI Blast Designer Pro', icon: FireIcon, category: 'Mining', isImplemented: true },
  { id: 'geo-brain', name: 'GeoBrain', description: 'Geology Logging Assistant', icon: GlobeAmericasIcon, category: 'Mining', isImplemented: true },
  { id: 'survey-brain', name: 'SurveyBrain', description: 'Survey & Mapping Tool', icon: MapIcon, category: 'Mining', isImplemented: true },
  { id: 'econ-brain', name: 'EconBrain', description: 'Mining Economics Manager', icon: ChartBarIcon, category: 'Mining', isImplemented: true },
  { id: 'safe-brain', name: 'SafeBrain', description: 'Safety & Hazard Detection', icon: ShieldCheckIcon, category: 'Mining', isImplemented: true },
  { id: 'mech-brain', name: 'MechBrain', description: 'Equipment Health & Maintenance', icon: WrenchScrewdriverIcon, category: 'Mining', isImplemented: true },
  { id: 'drill-brain', name: 'DrillBrain', description: 'Drill & Blast Monitoring', icon: TruckIcon, category: 'Mining', isImplemented: true },
  { id: 'met-brain', name: 'MetBrain', description: 'Metallurgy & Processing', icon: BeakerIcon, category: 'Mining', isImplemented: true },
  { id: 'enviro-brain', name: 'EnviroBrain', description: 'Environmental & Compliance', icon: CloudIcon, category: 'Mining', isImplemented: true },
];

interface AppLauncherProps {
  onSelectApp: (app: AppDefinition) => void;
}

const AppLauncher: React.FC<AppLauncherProps> = ({ onSelectApp }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'General' | 'Mining'>('All');

  const filteredApps = APPS.filter(app => activeTab === 'All' || app.category === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 mb-4">
            MKTools AI
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A comprehensive ecosystem of intelligent applications designed to empower students, professionals, and industry experts.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 inline-flex">
            {['All', 'General', 'Mining'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredApps.map((app) => (
            <button 
              key={app.id}
              onClick={() => onSelectApp(app)}
              className={`
                group relative bg-white dark:bg-slate-900 rounded-2xl p-6 text-left
                border border-slate-200 dark:border-slate-800 
                shadow-sm hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/30 
                transition-all duration-300 cursor-pointer flex flex-col h-full w-full
              `}
            >
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
                  app.category === 'Mining' 
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {app.category}
                </span>
              </div>

              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110
                ${app.category === 'Mining' ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}
              `}>
                <app.icon className={`w-6 h-6 ${
                  app.category === 'Mining' ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'
                }`} />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {app.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex-1 leading-relaxed">
                {app.description}
              </p>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-400">v1.0.0</span>
                {app.isImplemented ? (
                   <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                     Active <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                   </span>
                ) : (
                   <span className="text-xs font-medium text-slate-400">Preview</span>
                )}
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AppLauncher;
