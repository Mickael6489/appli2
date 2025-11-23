
import React, { useState } from 'react';
import { 
  ArrowLeftIcon, 
  AcademicCapIcon, 
  ChatBubbleLeftRightIcon, 
  RectangleStackIcon, 
  LightBulbIcon,
  PaperAirplaneIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { askEduBrain, generateFlashcards, Flashcard } from '../services/geminiService';

interface EduBrainAppProps {
  onBack: () => void;
}

type Mode = 'solver' | 'flashcards';

const EduBrainApp: React.FC<EduBrainAppProps> = ({ onBack }) => {
  const [mode, setMode] = useState<Mode>('solver');
  
  // Solver State
  const [subject, setSubject] = useState('General');
  const [question, setQuestion] = useState('');
  const [solverResponse, setSolverResponse] = useState<string | null>(null);
  const [isSolving, setIsSolving] = useState(false);

  // Flashcard State
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  const [flippedCardIndex, setFlippedCardIndex] = useState<number | null>(null);

  const handleSolve = async () => {
    if (!question.trim()) return;
    setIsSolving(true);
    setSolverResponse(null);
    const answer = await askEduBrain(subject, question);
    setSolverResponse(answer);
    setIsSolving(false);
  };

  const handleGenerateCards = async () => {
    if (!topic.trim()) return;
    setIsGeneratingCards(true);
    setCards([]);
    setFlippedCardIndex(null);
    const newCards = await generateFlashcards(topic, 6);
    setCards(newCards);
    setIsGeneratingCards(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-in slide-in-from-right duration-300">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-10 shadow-xl">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <AcademicCapIcon className="w-6 h-6" />
            EduBrain
          </h1>
        </div>

        <div className="p-4 space-y-2 flex-1">
          <button 
            onClick={() => setMode('solver')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              mode === 'solver' 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-800' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            Homework Solver
          </button>

          <button 
            onClick={() => setMode('flashcards')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              mode === 'flashcards' 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-800' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <RectangleStackIcon className="w-5 h-5" />
            Flashcards
          </button>
        </div>

        <div className="p-4">
          <div className="bg-indigo-600 rounded-xl p-4 text-white text-sm relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold mb-1">Study Tip</h3>
              <p className="opacity-90 text-xs">Take a 5-minute break every 25 minutes to keep your brain fresh!</p>
            </div>
            <LightBulbIcon className="absolute -bottom-2 -right-2 w-16 h-16 text-indigo-500 opacity-50" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-100 dark:bg-slate-950 relative">
        
        {/* MODE: HOMEWORK SOLVER */}
        {mode === 'solver' && (
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 md:p-8 h-full">
            <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-2 scrollbar-thin">
              
              {/* Welcome / Empty State */}
              {!solverResponse && !isSolving && (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                   <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                     <ChatBubbleLeftRightIcon className="w-8 h-8 text-indigo-500" />
                   </div>
                   <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Ask me anything!</h3>
                   <p className="max-w-sm mt-2">I can help with Math, Science, History, or any other subject. Just type your question below.</p>
                </div>
              )}

              {/* Question Bubble */}
              {solverResponse && (
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                    <p className="text-sm opacity-75 mb-1 text-indigo-100 uppercase text-[10px] tracking-wider">{subject}</p>
                    {question}
                  </div>
                </div>
              )}

              {/* Answer Bubble */}
              {(solverResponse || isSolving) && (
                <div className="flex justify-start w-full">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-5 rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm prose dark:prose-invert prose-sm">
                    {isSolving ? (
                      <div className="flex items-center gap-2 text-slate-500">
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        Thinking...
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap leading-relaxed">{solverResponse}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
              <div className="flex gap-3 mb-3">
                {['Math', 'Physics', 'History', 'Biology', 'General'].map(sub => (
                  <button 
                    key={sub}
                    onClick={() => setSubject(sub)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors border ${
                      subject === sub 
                        ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold' 
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your homework question here..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-12 min-h-[48px] max-h-32"
                  onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSolve(); } }}
                />
                <button 
                  onClick={handleSolve}
                  disabled={!question.trim() || isSolving}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white p-3 rounded-xl transition-colors flex items-center justify-center"
                >
                  {isSolving ? <ArrowPathIcon className="w-6 h-6 animate-spin" /> : <PaperAirplaneIcon className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE: FLASHCARDS */}
        {mode === 'flashcards' && (
           <div className="flex-1 flex flex-col p-4 md:p-8 h-full overflow-y-auto">
              
              {/* Header / Input */}
              <div className="max-w-2xl mx-auto w-full text-center mb-10">
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Flashcard Generator</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Enter a topic and AI will create study cards for you.</p>
                
                <div className="flex gap-2 relative z-20">
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Photosynthesis, World War II, Calculus Derivatives"
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateCards()}
                  />
                  <button 
                    onClick={handleGenerateCards}
                    disabled={isGeneratingCards || !topic.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-md disabled:opacity-70"
                  >
                    {isGeneratingCards ? 'Generating...' : 'Create'}
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              {isGeneratingCards ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 animate-pulse">Researching topic...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full pb-10">
                  {cards.map((card, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setFlippedCardIndex(flippedCardIndex === idx ? null : idx)}
                      className="group h-64 w-full perspective cursor-pointer"
                    >
                      <div className={`relative preserve-3d w-full h-full duration-500 ${flippedCardIndex === idx ? 'rotate-y-180' : ''}`}>
                        
                        {/* FRONT */}
                        <div className="absolute backface-hidden w-full h-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow p-6 flex flex-col items-center justify-center text-center">
                          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Question</span>
                          <p className="text-lg font-medium text-slate-800 dark:text-slate-100">{card.front}</p>
                          <p className="absolute bottom-4 text-xs text-slate-400">Click to flip</p>
                        </div>

                        {/* BACK */}
                        <div className="absolute rotate-y-180 backface-hidden w-full h-full bg-indigo-600 dark:bg-indigo-700 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center text-center text-white">
                          <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2">Answer</span>
                          <p className="text-lg font-medium leading-relaxed">{card.back}</p>
                        </div>

                      </div>
                    </div>
                  ))}
                  
                  {cards.length === 0 && !isGeneratingCards && (
                    <div className="col-span-full text-center py-20 text-slate-400 opacity-50">
                       <RectangleStackIcon className="w-16 h-16 mx-auto mb-2" />
                       <p>No cards yet</p>
                    </div>
                  )}
                </div>
              )}
           </div>
        )}

      </main>
    </div>
  );
};

export default EduBrainApp;
