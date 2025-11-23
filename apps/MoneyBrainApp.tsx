
import React, { useState } from 'react';
import { ArrowLeftIcon, BanknotesIcon, ChartPieIcon, PlusIcon, TrashIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { analyzeFinances } from '../services/geminiService';

interface MoneyBrainAppProps {
  onBack: () => void;
}

interface Expense {
  id: number;
  category: string;
  amount: number;
}

const MoneyBrainApp: React.FC<MoneyBrainAppProps> = ({ onBack }) => {
  const [income, setIncome] = useState(5000);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, category: 'Rent', amount: 1500 },
    { id: 2, category: 'Groceries', amount: 600 },
    { id: 3, category: 'Transport', amount: 300 },
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = income - totalExpenses;

  const handleAddExpense = () => {
    if (!newCategory || !newAmount) return;
    setExpenses([...expenses, { id: Date.now(), category: newCategory, amount: parseFloat(newAmount) }]);
    setNewCategory('');
    setNewAmount('');
  };

  const handleRemoveExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeFinances(income, expenses);
    setAnalysis(result || "Could not generate analysis.");
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <BanknotesIcon className="w-6 h-6" />
          MoneyBrain
        </h1>
      </div>

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Col: Inputs */}
        <div className="space-y-6">
          
          {/* Income Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Monthly Income</h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-400">$</span>
              <input 
                type="number" 
                value={income}
                onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                className="text-4xl font-black bg-transparent border-b-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none w-full"
              />
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Expenses</h2>
                <span className="text-xs font-mono bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded">
                  -${totalExpenses.toFixed(0)}
                </span>
             </div>

             <div className="space-y-3 mb-6">
               {expenses.map(expense => (
                 <div key={expense.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group">
                    <span className="font-medium">{expense.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-700 dark:text-slate-300">${expense.amount}</span>
                      <button onClick={() => handleRemoveExpense(expense.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                 </div>
               ))}
             </div>

             <div className="flex gap-2">
               <input 
                 type="text" 
                 placeholder="Category (e.g. Netflix)" 
                 value={newCategory}
                 onChange={e => setNewCategory(e.target.value)}
                 className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
               />
               <input 
                 type="number" 
                 placeholder="$$" 
                 value={newAmount}
                 onChange={e => setNewAmount(e.target.value)}
                 className="w-24 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
               />
               <button 
                onClick={handleAddExpense}
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg"
               >
                 <PlusIcon className="w-5 h-5" />
               </button>
             </div>
          </div>

        </div>

        {/* Right Col: Analysis */}
        <div className="space-y-6">
          
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl text-white shadow-lg">
            <h2 className="text-emerald-100 font-medium mb-1">Remaining Balance</h2>
            <div className="text-5xl font-black mb-4">${balance.toFixed(0)}</div>
            <div className="flex gap-4 text-sm opacity-90">
              <div>
                <span className="block text-xs uppercase opacity-70">Savings Rate</span>
                <span className="font-bold">{((balance / income) * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="block text-xs uppercase opacity-70">Status</span>
                <span className="font-bold">{balance > 0 ? 'Healthy' : 'Deficit'}</span>
              </div>
            </div>
          </div>

          {/* AI Advisor */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
               <h2 className="font-bold flex items-center gap-2 text-slate-700 dark:text-slate-200">
                 <SparklesIcon className="w-5 h-5 text-emerald-500" />
                 AI Financial Analysis
               </h2>
               <button 
                 onClick={handleAnalyze}
                 disabled={isAnalyzing}
                 className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-50"
               >
                 {isAnalyzing ? 'Analyzing...' : 'Generate Report'}
               </button>
            </div>
            
            <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 overflow-y-auto border border-slate-100 dark:border-slate-700">
              {analysis ? (
                <div className="prose prose-sm dark:prose-invert leading-relaxed whitespace-pre-wrap">
                  {analysis}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center text-sm">
                  <ChartPieIcon className="w-10 h-10 mb-2 opacity-50" />
                  <p>Add your expenses and click "Generate Report" for personalized advice.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default MoneyBrainApp;
