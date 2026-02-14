import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Edits an image based on a text prompt using Gemini 2.5 Flash Image.
 * @param imageBase64 The base64 string of the image (without the data URL prefix).
 * @param mimeType The mime type of the image (e.g., 'image/jpeg').
 * @param prompt The text prompt describing the edit (e.g., "Add a retro filter").
 * @returns The base64 string of the generated image.
 */
export const editImageWithGemini = async (
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
    
    console.warn("No image data found in response");
    return null;
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    throw error;
  }
};