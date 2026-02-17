
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const enhanceBio = async (rawBio: string, role: string, name: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Trasforma la seguente descrizione personale in una biografia professionale, minimalista e sofisticata per un portfolio di un professionista creativo. La persona si chiama ${name} ed è un ${role}. 
      Il tono deve essere ispirazionale, cinematico e di classe. Mantienila breve (massimo 2-3 frasi). 
      La lingua deve essere rigorosamente l'ITALIANO. 
      
      Testo di partenza: "${rawBio}"`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || rawBio;
  } catch (error) {
    console.error("Errore Gemini:", error);
    return rawBio;
  }
};
