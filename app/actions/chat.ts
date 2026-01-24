'use server';

import Groq from 'groq-sdk';
import { SMILE_FOTILO_KNOWLEDGE } from '../data/knowledgeBase';

export async function chatWithGemini(history: { role: 'user' | 'model', parts: string }[], message: string) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        console.error("No GROQ_API_KEY found");
        return "SETUP_REQUIRED";
    }

    try {
        const groq = new Groq({ apiKey });

        // Convert history format from Gemini to Groq/OpenAI format
        const formattedHistory = history.map(msg => ({
            role: msg.role === 'model' ? 'assistant' as const : 'user' as const,
            content: msg.parts
        }));

        // System prompt for Echo
        const systemPrompt = `You are 'Echo', the AI assistant of Smile Fotilo. BE BRIEF!

**CRITICAL RULES:**
- MAX 2 sentences per response. Users leave if you're verbose.
- Ask ONE question at a time.
- No bullet points or lists in responses.
- Sound human and warm, not robotic.

**KNOWLEDGE:**
${SMILE_FOTILO_KNOWLEDGE}

**DATA COLLECTION (when starting a project):**
Collect these ONE BY ONE: name, purpose, budget, timeline, features, email.

When ALL 6 fields are collected, output EXACTLY:
[FORM_COMPLETE: {"name":"value","purpose":"value","budget":"value","timeline":"value","features":"value","email":"value"}]

**EXAMPLES OF GOOD RESPONSES:**
- "Nice to meet you, [name]! What kind of project are you thinking about?"
- "Got it! What's your budget range for this?"
- "Perfect! And your email so we can send the proposal?"

Keep it SHORT!`;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                ...formattedHistory,
                { role: "user", content: message }
            ],
            max_tokens: 250,
            temperature: 0.7,
        });

        const text = response.choices[0]?.message?.content || "I couldn't process that. Try again?";
        return text;

    } catch (error: unknown) {
        console.error("Groq Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Handle rate limit errors gracefully
        if (errorMessage.includes('429') || errorMessage.includes('rate') || errorMessage.includes('limit')) {
            return "I'm taking a quick break! 😅 Please try again in a moment.";
        }

        return "I'm having trouble connecting right now. Please try again later.";
    }
}
