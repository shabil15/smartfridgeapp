import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.extra?.geminiApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

// Use gemini-2.5-flash - fast, free, and supports generateContent
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateRecipe = async (items: string[]) => {
  const prompt = `
  I have these ingredients in my fridge: ${items.join(", ")}.
  
  Generate exactly 3 simple recipes using most of these ingredients.
  
  IMPORTANT: Return ONLY a valid JSON array with no additional text, markdown formatting, or code blocks.
  
  Format:
  [
    {
      "name": "Recipe Name",
      "ingredients": ["200g ingredient 1", "2 tablespoons ingredient 2", "3 cups ingredient 3"],
      "steps": ["Step 1", "Step 2", "Step 3"]
    }
  ]
  
  Requirements:
  - Each recipe must have a name (string)
  - Each recipe must have ingredients (array of strings) - IMPORTANT: Each ingredient MUST include the quantity/measurement (e.g., "2 eggs", "200g chicken", "1 cup milk", "3 tomatoes")
  - Each recipe must have steps (array of strings with clear numbered instructions)
  - Keep recipes simple and easy for a home cook
  - Use realistic cooking steps and measurements
  - Include specific quantities for ALL ingredients in the ingredients list
  - Return ONLY the JSON array, no other text
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
  } catch (error: any) {
    console.error("Error generating recipes:", error);
    
    // Provide more specific error messages
    if (error.message?.includes('API key')) {
      throw new Error("Invalid API Key. Please check your Gemini API key in the .env file.");
    } else if (error.message?.includes('404')) {
      throw new Error("Model not found. The Gemini API may have changed. Please check for updates.");
    } else if (error.message?.includes('quota')) {
      throw new Error("API quota exceeded. Please check your Gemini API usage limits.");
    }
    
    throw new Error("Couldn't generate recipes at the moment. Please try again later or check your internet connection.");
  }
};
