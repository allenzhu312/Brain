import { GoogleGenAI, Type } from "@google/genai";

export const generateBrainInfo = async (partName: string): Promise<any> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Provide detailed medical information for the brain structure: "${partName}".
  Return the result in JSON format with the following fields:
  - description: A general overview (max 2 sentences).
  - function: Key physiological functions (comma separated list).
  - diseases: Associated pathologies or clinical conditions (comma separated list).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            function: { type: Type.STRING },
            diseases: { type: Type.STRING },
          },
          required: ["description", "function", "diseases"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};