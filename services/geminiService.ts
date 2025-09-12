
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateSummary = async (content: string): Promise<string> => {
    if (!content.trim()) {
        return "No content provided to summarize.";
    }
    
    try {
        const prompt = `Summarize the following document content into a concise paragraph. Capture the main points and overall tone:\n\n---\n\n${content}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating summary:", error);
        return "Could not generate summary due to an API error.";
    }
};

export const suggestCategory = async (title: string, description: string): Promise<string> => {
    if (!title.trim() && !description.trim()) {
        return "";
    }
    try {
        const prompt = `Based on the following document title and description, suggest a single, relevant category (e.g., "Finance", "Legal", "Marketing", "Technical", "HR", "Strategy"). Return only the category name.\n\nTitle: "${title}"\nDescription: "${description}"`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
             config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        // Clean up the response to get just the category name
        return response.text.trim().replace(/[^a-zA-Z0-9 ]/g, '');
    } catch (error) {
        console.error("Error suggesting category:", error);
        return "Uncategorized";
    }
};
