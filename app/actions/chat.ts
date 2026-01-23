'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function chatWithGemini(history: { role: 'user' | 'model', parts: string }[], message: string, userApiKey?: string) {
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
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
                maxOutputTokens: 200,
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

        const fullMessage = `${systemPrompt}\n\nChat History:\n${history.map(m => `${m.role}: ${m.parts}`).join('\n')}\nUser: ${message}`;

        const result = await chat.sendMessage(fullMessage);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("Gemini Error:", error);
        return "I'm having trouble connecting to Google Gemini. Please check your API Key.";
    }
}
