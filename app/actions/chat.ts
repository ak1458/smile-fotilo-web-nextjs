'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { SMILE_FOTILO_KNOWLEDGE } from '../data/knowledgeBase';

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
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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
        // Combine system prompt with user message
        const systemPrompt = `
        You are 'Smile', the official AI Assistant of Smile Fotilo. 
        
        **YOUR KNOWLEDGE BASE:**
        ${SMILE_FOTILO_KNOWLEDGE}

        **YOUR GOAL:**
        You have two modes of operation:
        1. **Interviewer Mode (Priority):** If the user wants to start a project, collect requirements step-by-step.
        2. **Assistant Mode:** If the user asks general questions about services/pricing, answer them using the Knowledge Base.

        **INSTRUCTIONS:**
        - Be friendly, professional, and concise.
        - **IF COLLECTING DETAILS:**
          1. Ask ONE question at a time.
          2. Collect: Name, Purpose, Budget, Timeline, Features, Email.
          3. Output [FORM_COMPLETE: {...}] ONLY when all details are confirmed.
        
        - **IF ANSWERING QUESTIONS:**
          - Use the Knowledge Base facts.
          - Keep answers short (under 3 sentences if possible).
          - Always end by asking if they would like to start a project.
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

