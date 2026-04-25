'use server';

import { chatWithGemini } from './chat';

/**
 * Specialized server action for the AI Terminal.
 * This provides a focused system prompt that emphasizes the terminal aesthetic
 * and technical expertise of the assistant.
 */
export async function executeTerminalAiCommand(prompt: string, history: any[] = []) {
  const terminalSystemPrompt = `You are the Smile Fotilo System Core (SF-OS). 
You are communicating via a restricted technical terminal.
Your tone is:
- Efficient, precise, and tech-focused.
- Occasionally uses mock system jargon (e.g., "Indexing modules...", "Parsing request...").
- Professional but "underground" aesthetic (think Matrix or Cyberpunk).
- Avoid fluff. Get straight to the technical insight or answer.

If the user asks for 'status', provide a mock system health report.
If they ask for 'help', list available system commands.`;

  // We reuse the existing chatWithGemini logic but we could enhance it here
  // for terminal-specific features if needed.
  return await chatWithGemini(history, `${terminalSystemPrompt}\n\nUser Input: ${prompt}`);
}
