import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const segmentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    segments: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "A list of segmented words or phrases suitable for Japanese Sign Language representation.",
    },
  },
  required: ["segments"],
};

export const splitTextForSignLanguage = async (text: string): Promise<string[]> => {
  if (!text || text.trim().length === 0) {
    throw new Error("Text cannot be empty");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Analyze the following Japanese text and split it into segments suitable for Japanese Sign Language (JSL).
        
        Guidelines:
        1. JSL typically focuses on content words (nouns, verbs, adjectives).
        2. Grammatical particles (te, ni, wo, ha) are often omitted or absorbed into the context in signed communication unless strictly necessary for meaning.
        3. If a particle changes the meaning significantly, keep it or group it with the relevant noun.
        4. Split compound verbs if they represent distinct actions.
        5. Return the result strictly as a list of strings representing the "glosses" or concepts to be signed.
        
        Text to analyze:
        ${text}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: segmentSchema,
        systemInstruction: "You are an expert Japanese Sign Language interpreter assistant.",
        temperature: 0.2, // Low temperature for consistent output
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response from AI");
    }

    const parsed = JSON.parse(jsonText);
    if (parsed && Array.isArray(parsed.segments)) {
      return parsed.segments;
    }

    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process text. Please try again.");
  }
};