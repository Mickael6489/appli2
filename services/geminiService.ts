
import { GoogleGenAI } from "@google/genai";
import { CalculationResults, QualityAssessment } from "../types";

// --- SYSTEM INSTRUCTIONS ---

const BLAST_SYSTEM_INSTRUCTION = `You are BlastBrain AI, an expert mining engineer and blast design consultant. Analyze blast parameters for safety and efficiency. Warn emphatically about safety risks.`;

const EDU_SYSTEM_INSTRUCTION = `You are EduBrain, a friendly expert tutor. Explain complex topics simply. Be patient and encouraging.`;

const MONEY_SYSTEM_INSTRUCTION = `You are MoneyBrain, a financial advisor. Analyze budgets, identify savings, and suggest investment strategies.`;

const CAREER_SYSTEM_INSTRUCTION = `You are CareerBrain, a senior recruiter. Critique resumes for ATS optimization and provide interview coaching.`;

const FIT_SYSTEM_INSTRUCTION = `You are FitBrain, an elite personal trainer. Create detailed workout plans based on goals and equipment.`;

const LIFE_SYSTEM_INSTRUCTION = `You are LifeBrain, a relationship and social skills coach. Offer empathetic, constructive advice on communication, conflict resolution, and social dynamics.`;

const BIZ_SYSTEM_INSTRUCTION = `You are BizBrain, a startup consultant and venture capitalist. Generate business plans, financial projections, and pitch strategies.`;

const FOOD_SYSTEM_INSTRUCTION = `You are FoodBrain, a professional chef and nutritionist. Create recipes from available ingredients and offer nutritional advice.`;

const MIND_SYSTEM_INSTRUCTION = `You are MindBrain, a supportive mental wellness coach. Use CBT techniques to help with stress and anxiety. NOTE: You are not a doctor. For serious crises, direct to professional help.`;

const LINGUA_SYSTEM_INSTRUCTION = `You are LinguaBrain, a polyglot language tutor. Translate text accurately and explain grammar nuances.`;

const CREATOR_SYSTEM_INSTRUCTION = `You are CreatorBrain, a social media strategist. Generate viral content ideas, captions, and scripts for TikTok, YouTube, and Instagram.`;

// --- MINING SYSTEM INSTRUCTIONS ---

const MINE_SYSTEM_INSTRUCTION = `You are MineBrain, a General Manager of a mine site. Oversee operations, planning, and strategy.`;

const GEO_SYSTEM_INSTRUCTION = `You are GeoBrain, a senior geologist. Identify lithology, alteration, and mineralization from descriptions. Calculate RQD and analyze core logs.`;

const SURVEY_SYSTEM_INSTRUCTION = `You are SurveyBrain, a mine surveyor. Help with coordinate systems, volume calculations, and pit mapping.`;

const ECON_SYSTEM_INSTRUCTION = `You are EconBrain, a mining economist. Calculate NPV, IRR, and unit costs. Analyze metal price sensitivity.`;

const SAFE_SYSTEM_INSTRUCTION = `You are SafeBrain, a safety officer. Identify hazards, suggest PPE, and analyze risk assessments.`;

const MECH_SYSTEM_INSTRUCTION = `You are MechBrain, a maintenance engineer. Diagnose equipment faults and predict maintenance needs for heavy machinery.`;

const DRILL_SYSTEM_INSTRUCTION = `You are DrillBrain, a drilling supervisor. Optimize penetration rates, bit wear, and drill patterns.`;

const MET_SYSTEM_INSTRUCTION = `You are MetBrain, a metallurgist. Optimize recovery rates, crushing/grinding circuits, and reagent usage.`;

const ENVIRO_SYSTEM_INSTRUCTION = `You are EnviroBrain, an environmental scientist. Monitor emissions, water quality, and compliance with mining regulations.`;


// --- GENERIC AI HANDLER ---

export const askBrain = async (
  brainId: string, 
  prompt: string, 
  contextData?: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let instruction = "";
    switch(brainId) {
      // General
      case 'edu-brain': instruction = EDU_SYSTEM_INSTRUCTION; break;
      case 'money-brain': instruction = MONEY_SYSTEM_INSTRUCTION; break;
      case 'career-brain': instruction = CAREER_SYSTEM_INSTRUCTION; break;
      case 'fit-brain': instruction = FIT_SYSTEM_INSTRUCTION; break;
      case 'life-brain': instruction = LIFE_SYSTEM_INSTRUCTION; break;
      case 'biz-brain': instruction = BIZ_SYSTEM_INSTRUCTION; break;
      case 'food-brain': instruction = FOOD_SYSTEM_INSTRUCTION; break;
      case 'mind-brain': instruction = MIND_SYSTEM_INSTRUCTION; break;
      case 'lingua-brain': instruction = LINGUA_SYSTEM_INSTRUCTION; break;
      case 'creator-brain': instruction = CREATOR_SYSTEM_INSTRUCTION; break;
      // Mining
      case 'mine-brain': instruction = MINE_SYSTEM_INSTRUCTION; break;
      case 'geo-brain': instruction = GEO_SYSTEM_INSTRUCTION; break;
      case 'survey-brain': instruction = SURVEY_SYSTEM_INSTRUCTION; break;
      case 'econ-brain': instruction = ECON_SYSTEM_INSTRUCTION; break;
      case 'safe-brain': instruction = SAFE_SYSTEM_INSTRUCTION; break;
      case 'mech-brain': instruction = MECH_SYSTEM_INSTRUCTION; break;
      case 'drill-brain': instruction = DRILL_SYSTEM_INSTRUCTION; break;
      case 'met-brain': instruction = MET_SYSTEM_INSTRUCTION; break;
      case 'enviro-brain': instruction = ENVIRO_SYSTEM_INSTRUCTION; break;
      default: instruction = "You are a helpful AI assistant.";
    }

    const fullPrompt = contextData ? `${contextData}\n\nUser Query: ${prompt}` : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: instruction,
      }
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error(`Error asking ${brainId}:`, error);
    return "Connection error. Please try again.";
  }
};


// --- SPECIFIC HELPERS (Preserved for existing apps) ---

export const analyzeBlastDesign = async (results: CalculationResults, quality: QualityAssessment) => {
  const prompt = `Analyze this Blast Design: SR=${results.KR}, PF=${results.PF.toFixed(2)}, B=${results.B.toFixed(2)}, S=${results.S.toFixed(2)}. Quality: ${quality.fragmentation}, ${quality.flyRock}. Provide engineering summary.`;
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: BLAST_SYSTEM_INSTRUCTION }
    });
    return response.text || "Analysis unavailable.";
  } catch (e) { return "AI Error."; }
};

export const askEduBrain = async (subject: string, question: string) => askBrain('edu-brain', question, `Subject: ${subject}`);

export interface Flashcard { front: string; back: string; }
export const generateFlashcards = async (topic: string, count: number = 5): Promise<Flashcard[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Generate ${count} flashcards about "${topic}". Return strictly a JSON array of objects with "front" and "back".`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: EDU_SYSTEM_INSTRUCTION, responseMimeType: "application/json" }
    });
    const text = response.text?.trim() || "[]";
    const jsonStr = text.replace(/^```json/g, '').replace(/```$/g, '');
    return JSON.parse(jsonStr) as Flashcard[];
  } catch (error) { return []; }
};

export const analyzeFinances = async (income: number, expenses: {category: string, amount: number}[]) => {
  const expenseSummary = expenses.map(e => `- ${e.category}: $${e.amount}`).join('\n');
  return askBrain('money-brain', "Analyze my budget.", `Income: $${income}\nExpenses:\n${expenseSummary}`);
};

export const critiqueResume = async (resumeText: string, jobDescription: string = "") => {
  return askBrain('career-brain', "Critique this resume.", `Resume:\n${resumeText}\n\nJob Desc:\n${jobDescription}`);
};

export const generateWorkout = async (goal: string, equipment: string, level: string, duration: string) => {
  return askBrain('fit-brain', "Create a workout plan.", `Goal: ${goal}, Eq: ${equipment}, Level: ${level}, Time: ${duration}`);
};
