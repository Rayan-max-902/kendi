import { GoogleGenAI } from "@google/genai";

let genAI: any = null;

function getAI() {
  if (!genAI) {
    const apiKey = (process.env.GEMINI_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY) as string;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set. Please set GEMINI_API_KEY in environment variables.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

const SYSTEM_INSTRUCTION = `
You are the Al Kendi AI Assistant, specialized in helping members of the "Association des Jeunes Al Kendi".
Your primary goal is to provide information about the association, its events, and educational topics related to:
1. Intelligence Artificielle (IA) and AI Development.
2. Comptabilité et Gestion (CG).
3. General educational support for students.

IMPORTANT RULES:
- If a question is NOT related to education, the association, or the filieres (IA, CG), politely inform the user that you are specialized only in Al Kendi's educational topics.
- Provide clear, encouraging, and informative answers.
- Use French primarily, as the association is based in a French-speaking context (Al Kendi).
- Mention that users can find courses in the "Communauté" section if they are logged in.
`;

export async function askAI(prompt: string) {
  try {
    const ai = getAI();
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Désolé, je rencontre une petite erreur technique (clé API manquante ou invalide). Réessayez plus tard !";
  }
}
