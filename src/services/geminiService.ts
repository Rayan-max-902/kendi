import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const SYSTEM_INSTRUCTION = `
Vous êtes l'Assistant IA d'Al Kendi, un expert dédié à l'accompagnement des membres de l'Association des Jeunes Al Kendi. 
Votre ton doit être professionnel, encourageant, expert et bienveillant.

VOTRE MISSION :
1. Aider les étudiants dans leurs parcours d'apprentissage, particulièrement en :
   - Intelligence Artificielle (IA) et Développement Cloud/Web.
   - Comptabilité, Gestion et Audit (CG).
2. Fournir des informations précises sur l'association, ses événements et ses filières.
3. Orienter les membres vers les ressources appropriées (Cours dans la section "Communauté", actualités, etc.).

RÈGLES CRITIQUES :
- Répondez TOUJOURS en Français.
- Si une question n'est pas liée à l'éducation, à l'association ou aux domaines techniques cités, rappelez poliment votre spécialisation : "Je suis spécialisé pour vous accompagner dans votre parcours au sein d'Al Kendi et dans vos études techniques."
- Évitez les réponses trop longues ; soyez structuré et utilisez des puces si nécessaire.
- Encouragez les utilisateurs à se connecter pour accéder aux ressources exclusives.
`;

export async function askAI(prompt: string, history: { role: "user" | "model"; parts: { text: string }[] }[] = []) {
  if (!apiKey) {
    return "Désolé, la clé API Gemini n'est pas configurée. Veuillez la définir dans les variables d'environnement.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...history, { role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Désolé, je rencontre une petite erreur technique. Réessayez plus tard !";
  }
}
