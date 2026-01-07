import { GoogleGenAI } from "@google/genai";

/**
 * Uses Gemini 2.5 Flash Image to edit an image based on a text prompt.
 * @param base64Data The base64 encoded string of the image (with or without data prefix).
 * @param mimeType The standard IANA MIME type of the image.
 * @param prompt The descriptive text prompt for editing.
 */
export const editImageWithGemini = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Clean base64 data if it includes the data:image/xxx;base64, prefix
  const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });

  // Iterate through parts to find the resulting image
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("The model did not return an edited image part.");
};