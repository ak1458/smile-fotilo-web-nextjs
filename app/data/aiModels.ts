// Available models for Echo chatbot.

export const AI_MODELS = [
  { id: 'auto', name: 'Smart Select', description: 'Best model for your question' },
  { id: 'z-ai/glm-4.5-air:free', name: 'Lightning', description: 'Quick responses' },
  { id: 'deepseek/deepseek-r1-0528:free', name: 'Deep Thinker', description: 'Detailed answers' },
  { id: 'qwen/qwen3-coder:free', name: 'Code Expert', description: 'Technical questions' },
  { id: 'stepfun/step-3.5-flash:free', name: 'Flash', description: 'Super fast' },
  {
    id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
    name: 'Creative',
    description: 'Out-of-the-box ideas',
  },
] as const;

export type AIModelId = (typeof AI_MODELS)[number]['id'];
