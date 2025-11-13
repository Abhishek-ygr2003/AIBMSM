
import { GoogleGenAI } from "@google/genai";
import { Cell } from '../types';
import { apiKeyService } from "./apiKeyService";

const getFixSuggestion = async (cell: Cell, vehicleName: string): Promise<string> => {
  if (!cell.isAnomaly) {
    return "The selected cell is operating within normal parameters. No action is required.";
  }

  // Prefer API key stored in browser localStorage (set via UI). If not present,
  // fall back to Vite-provided env var VITE_GEMINI_API_KEY (useful for local dev).
  // NOTE: Exposing an API key in client-side env is insecure for production; use a server-side proxy for real deployments.
  const storedKey = apiKeyService.getApiKey();
  // import.meta.env typing may not be present at runtime in Node, so guard access
  const envKey = typeof import.meta !== 'undefined' && (import.meta.env as any)?.VITE_GEMINI_API_KEY
    ? (import.meta.env as any).VITE_GEMINI_API_KEY
    : undefined;

  const apiKey = storedKey || envKey;
  if (!apiKey) {
    throw new Error("Gemini API key not set. Please set it in the header or add VITE_GEMINI_API_KEY to your .env.local for local dev.");
  }

  const ai = new GoogleGenAI({ apiKey });

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
    // First try a local proxy (if running) to avoid CORS and expose API key server-side.
    try {
      const proxyRes = await fetch('/api/genai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction })
      });
      if (proxyRes.ok) {
        const j = await proxyRes.json();
        // Try common response shapes
        if (j?.candidates?.length && j.candidates[0].content) return j.candidates[0].content;
        if (j?.output) return JSON.stringify(j.output);
        if (j?.text) return j.text;
        return JSON.stringify(j);
      }
    } catch (proxyErr) {
      // ignore proxy errors and fall back to client library
      console.warn('Proxy call failed, falling back to client library:', proxyErr);
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text ?? '';
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to communicate with the AI assistant. Check your API key and network connection.");
  }
};

export const aiAssistantService = {
  getFixSuggestion,
};