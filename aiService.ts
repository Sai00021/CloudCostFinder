import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "./types";

/**
 * Chat with Gemini using Search Grounding.
 */
export const chatWithSearch = async (message: string): Promise<ChatMessage> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return {
    role: 'model',
    text: response.text || "No response generated.",
    grounding: chunks
  };
};

/**
 * Chat with Gemini using Maps Grounding.
 */
export const chatWithMaps = async (message: string): Promise<ChatMessage> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let location: { latitude: number; longitude: number } | undefined;
  try {
    const pos: any = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  } catch (e) {
    console.warn("Geolocation failed, proceeding without user context.");
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: message,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: location ? {
        retrievalConfig: { latLng: location }
      } : undefined
    }
  });

  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return {
    role: 'model',
    text: response.text || "No response generated.",
    grounding: chunks
  };
};

/**
 * Perform complex query using Thinking Mode.
 */
export const performComplexReasoning = async (message: string): Promise<ChatMessage> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: message,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return {
    role: 'model',
    text: response.text || "Reasoning failed.",
    isThinking: true
  };
};

/**
 * Low latency responses.
 */
export const getFastResponse = async (message: string): Promise<ChatMessage> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-latest',
    contents: message
  });
  return { role: 'model', text: response.text || "Quick reply failed." };
};

/**
 * Transcribe recorded audio.
 */
export const transcribeAudio = async (base64Data: string, mimeType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: "Transcribe the audio exactly as heard." }
      ]
    }
  });
  return response.text || "Transcription failed.";
};

/**
 * Analyze an image or video asset.
 */
export const analyzeAsset = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: prompt }
      ]
    }
  });
  return response.text || "Analysis failed.";
};

/**
 * Generate speech (TTS).
 */
export const generateSpeech = async (text: string): Promise<ArrayBuffer> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Zephyr' },
        },
      },
    },
  });
  
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio data returned.");
  
  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Generate video using Veo 3.1.
 */
export const generateVideoVeo = async (prompt: string, aspectRatio: '16:9' | '9:16', imageBase64?: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const config: any = {
    numberOfVideos: 1,
    resolution: '720p',
    aspectRatio
  };

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    image: imageBase64 ? {
      imageBytes: imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64,
      mimeType: 'image/png'
    } : undefined,
    config
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed to return a URI.");
  
  const fetchResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await fetchResponse.blob();
  return URL.createObjectURL(blob);
};

/**
 * Generate image with specific aspect ratio and size.
 */
export const generateImage = async (prompt: string, aspectRatio: string, imageSize: '1K' | '2K' | '4K'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: imageSize
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Image generation failed.");
};