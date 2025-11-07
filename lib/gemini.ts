import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.extra?.geminiApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

// Use gemini-2.5-flash - fast, free, and supports generateContent
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateRecipe = async (items: string[]) => {
  const prompt = `
  I have these ingredients in my fridge: ${items.join(", ")}.
  Suggest 3 simple recipes using most of these ingredients.
  For each recipe, include:
  - Recipe name
  - Required ingredients (mark missing ones if any)
  - Step-by-step instructions
  Keep it short and easy for a home cook.
  Format the response in a clear, structured way.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
  } catch (error: any) {
    console.error("Error generating recipes:", error);
    
    // Provide more specific error messages
    if (error.message?.includes('API key')) {
      return "❌ Invalid API Key. Please check your Gemini API key in the .env file.";
    } else if (error.message?.includes('404')) {
      return "❌ Model not found. The Gemini API may have changed. Please check for updates.";
    } else if (error.message?.includes('quota')) {
      return "❌ API quota exceeded. Please check your Gemini API usage limits.";
    }
    
    return "Sorry, I couldn't generate recipes at the moment. Please try again later or check your internet connection.";
  }
};
