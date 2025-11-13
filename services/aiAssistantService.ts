import { GoogleGenAI } from "@google/genai";
import { Cell } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getFixSuggestion = async (cell: Cell, vehicleName: string): Promise<string> => {
  if (!cell.isAnomaly) {
    return "The selected cell is operating within normal parameters. No action is required.";
  }

  const systemInstruction = "You are an expert AI assistant for EV battery technicians, specializing in the Indian 2/3-wheeler market. Provide concise, actionable advice for a skilled mechanic. Format your response using markdown. Your response MUST have three distinct sections in this order: 1. **Fault Classification**: (Your classification here), 2. **Likely Causes**: (Bulleted list), 3. **Recommended Steps**: (Bulleted list).";
  
  const prompt = `
    A cell in a ${vehicleName} battery pack is showing anomalies. Here is the data:
    - Cell ID: ${cell.id}
    - Voltage: ${cell.voltage.toFixed(3)} V
    - Internal Resistance: ${(cell.internalResistance * 1000).toFixed(1)} mΩ
    - Z-score: ${cell.zScore?.toFixed(2)}
    - Anomaly Reason: ${cell.anomalyReason}

    Based on this data, provide a fault classification, list the likely causes, and recommend diagnostic/repair steps following the required format.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
        },
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to communicate with the AI assistant.");
  }
};

export const aiAssistantService = {
  getFixSuggestion,
};