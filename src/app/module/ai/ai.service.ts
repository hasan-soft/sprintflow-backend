import { GoogleGenAI } from "@google/genai";
import config from "../../config";

const ai = new GoogleGenAI({ apiKey: config.gemini_api_key || "" });

const generateChatResponse = async (message: string) => {
	if (!message) {
		throw new Error("Message is required");
	}

	const models = ["gemini-flash-latest", "gemini-3.8-flash"];
	let lastError: unknown;

	for (const model of models) {
		try {
			const response = await ai.models.generateContent({
				model,
				contents: message,
				config: {
					systemInstruction:
						"You are a helpful customer support assistant for SprintFlow.",
				},
			});

			if (response.text) {
				return response.text;
			}
		} catch (err) {
			lastError = err;
		}
	}

	throw lastError ?? new Error("Failed to generate AI response");
};

// Smart Search Suggestions Function
const generateSearchSuggestions = async (query: string) => {
	if (!query || query.trim().length < 2) {
		return [];
	}

	const prompt = `Based on the search query "${query}", provide 4 relevant, short search suggestions for a project management or task management platform (SprintFlow). Return ONLY a valid JSON array of strings like ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4"] without markdown, quotes around array, or any extra text.`;

	const models = ["gemini-flash-latest", "gemini-3.8-flash"];

	for (const model of models) {
		try {
			const response = await ai.models.generateContent({
				model,
				contents: prompt,
			});

			const textResponse = response.text || "[]";
			const cleanText = textResponse.replace(/```json|```/g, "").trim();
			const match = cleanText.match(/\[[\s\S]*\]/);
			if (match) {
				const parsed = JSON.parse(match[0]);
				if (Array.isArray(parsed) && parsed.length > 0) {
					return parsed;
				}
			}
		} catch {
			// Continue to next model fallback
		}
	}

	return [query];
};

export const AIService = {
	generateChatResponse,
	generateSearchSuggestions,
};
