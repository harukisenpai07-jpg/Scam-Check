import { GoogleGenAI } from "@google/genai";

export async function analyzeWithGemini(userText, urls, safeBrowsingResult, searchResults) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are an expert security analyst specializing in fraud detection for elderly users. 
Analyze the following message/link to determine if it is a scam.

USER MESSAGE: "${userText}"
EXTRACTED URLS: ${urls.join(", ") || "None"}
SAFE BROWSING ALERTS: ${JSON.stringify(safeBrowsingResult)}
WEB SEARCH CONTEXT: ${JSON.stringify(searchResults)}

CRITICAL INSTRUCTIONS:
1. If the message appears to be a normal, safe communication (e.g., a customer service reply, a normal chat message), you MUST set "isScam" to false and "confidenceScore" must be low (e.g., 0-10). Do not hallucinate scams where none exist.
2. The "explanation" MUST be strictly in the Burmese language (Myanmar font). Keep it simple, empathetic, and jargon-free.
3. Provide 1-2 bullet points in the "preventionTips" giving advice on how to avoid scams related to this context, or general digital safety tips if the message is safe. This MUST also be strictly in the Burmese language.

Return a strict JSON response with the following format:
{
  "isScam": boolean,
  "confidenceScore": number (0-100),
  "explanation": "string (in Burmese)",
  "preventionTips": "string (in Burmese, bullet points)"
}
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.2, // Low temperature for more deterministic, factual analysis
            }
        });

        const textResult = response.text;
        return JSON.parse(textResult);
    } catch (err) {
        console.error("Gemini API Error:", err);
        throw new Error("Failed to analyze with AI");
    }
}
