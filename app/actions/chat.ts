'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function chatWithGemini(history: { role: 'user' | 'model', parts: string }[], message: string, userApiKey?: string) {
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return "SETUP_REQUIRED";
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.parts }]
            })),
            generationConfig: {
                maxOutputTokens: 200,
            },
        });

        const systemPrompt = "You are Smile Fotilo AI. If you do not know the answer to a question, or if it is outside the scope of Smile Fotilo (Web Design/Marketing), please strictly reply with 'IDK_RESPONSE'. Do not try to make up an answer.";

        // Combine system prompt with user message for this turn (since simple chat history doesn't support system role easily in v1)
        const fullMessage = `${systemPrompt}\nUser: ${message}`;

        const result = await chat.sendMessage(fullMessage);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("Gemini Error:", error);
        return "I'm having trouble connecting to Google Gemini. Please check your API Key.";
    }
}
