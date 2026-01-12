
import { GoogleGenAI, Type } from "@google/genai";
import { VerificationResult, ContentType } from "../types";

const API_KEY = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    trustScore: { type: Type.NUMBER, description: "A score from 0 to 100 indicating trust level." },
    authenticityRating: { type: Type.STRING, description: "One of: Authentic, Suspicious, Synthetic, Undetermined" },
    summary: { type: Type.STRING, description: "A concise executive summary of the findings." },
    analysisPoints: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Specific technical indicators found (e.g., semantic drift, frequency anomalies)."
    },
    intentAnalysis: { type: Type.STRING, description: "Analysis of the likely intent behind the content." },
    metadata: { 
      type: Type.OBJECT, 
      properties: {
        detectedFormat: { type: Type.STRING, description: "The format detected by the model." },
        processingTime: { type: Type.NUMBER, description: "Internal processing overhead estimate." }
      },
      required: ["detectedFormat"],
      description: "Additional technical metadata."
    }
  },
  required: ["trustScore", "authenticityRating", "summary", "analysisPoints", "intentAnalysis", "metadata"],
  propertyOrdering: ["trustScore", "authenticityRating", "summary", "analysisPoints", "intentAnalysis", "metadata"]
};

export async function analyzeContent(
  type: ContentType, 
  data: string, 
  mimeType?: string
): Promise<VerificationResult> {
  const model = "gemini-3-flash-preview";
  
  let contents: any;
  let systemPrompt = `You are a world-class digital forensics and authenticity expert. Your goal is to establish confidence in digital interactions by analyzing content for synthesis, manipulation, and intent.
  Focus on:
  1. Content Provenance: Is the style consistent with human creation?
  2. Semantic Integrity: Are there logical inconsistencies often found in GenAI?
  3. Intent Analysis: Is the purpose informative, manipulative, or deceptive?
  Return the analysis in a structured JSON format matching the provided schema.`;

  if (type === 'text') {
    contents = { parts: [{ text: `Analyze the following text for authenticity and intent: "${data}"` }] };
  } else {
    contents = {
      parts: [
        { inlineData: { data, mimeType: mimeType || (type === 'image' ? 'image/jpeg' : 'audio/mp3') } },
        { text: `Analyze this ${type} for authenticity, digital signatures, and potential synthesis indicators.` }
      ]
    };
  }

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA
    }
  });

  const resultStr = response.text;
  if (!resultStr) throw new Error("Empty response from AI engine.");
  
  try {
    return JSON.parse(resultStr);
  } catch (e) {
    console.error("Failed to parse Gemini response:", resultStr);
    throw new Error("Invalid response format from analysis engine.");
  }
}
