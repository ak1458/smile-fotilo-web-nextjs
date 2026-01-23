'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function chatWithGemini(history: { role: 'user' | 'model', parts: string }[], message: string, userApiKey?: string) {
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    console.log("API Key exists:", !!apiKey);
    console.log("API Key prefix:", apiKey?.substring(0, 10) + "...");

    if (!apiKey) {
        console.error("No API key found");
        return "SETUP_REQUIRED";
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.parts }]
            })),
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        // Combine system prompt with user message
        const systemPrompt = `
        You are 'Smile', the official AI Assistant of Smile Fotilo. 
        Your goal is to collect project requirements from the user step-by-step, like a professional interviewer.
        
        **INSTRUCTIONS:**
        1. Ask ONE question at a time. Do not overwhelm the user.
        2. Be friendly, professional, and concise.
        3. Collect the following details in order:
           - Name
           - Purpose of Inquiry (New Website, Redesign, App, Marketing, etc.)
           - Budget Estimate
           - Timeline/Deadline
           - Specific Features/Notes
           - Email Address (for sending the proposal)

        4. When you have ALL the details, confirm them with the user.
        5. Once confirmed, output EXACTLY this JSON format at the end of your message (hidden from user view, used by system):
           
           [FORM_COMPLETE: {"name": "...", "purpose": "...", "budget": "...", "timeline": "...", "features": "...", "email": "..."}]

        6. If the user asks general questions, answer them briefly but steer back to the interview.
        `;

        const fullMessage = `${systemPrompt}\n\nUser: ${message}`;

        console.log("Sending message to Gemini...");
        const result = await chat.sendMessage(fullMessage);
        const response = await result.response;
        const text = response.text();
        console.log("Gemini response received:", text.substring(0, 100) + "...");

        return text;
    } catch (error: unknown) {
        console.error("Gemini Error Details:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return `I'm having trouble connecting. Error: ${errorMessage}`;
    }
}

