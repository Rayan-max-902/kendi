import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Désolé, je rencontre une petite erreur technique. Réessayez plus tard !";
  }
}
