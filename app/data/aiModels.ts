// Available AI models for the Echo chatbot.
// Includes paid aliases and OpenRouter free models.

export const AI_MODELS = [
  { id: 'auto', name: 'Auto (Smart)', description: 'Best model for each query' },
  { id: 'openai:latest', name: 'GPT Latest (Paid)', description: 'Premium OpenAI model' },
  { id: 'google:latest', name: 'Gemini Latest (Paid)', description: 'Premium Gemini model' },
  { id: 'z-ai/glm-4.5-air:free', name: 'GLM-4.5 Air', description: 'Fast and reliable' },
  { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1', description: 'Deep reasoning' },
  { id: 'openai/gpt-oss-120b:free', name: 'GPT-OSS 120B', description: 'GPT-class power' },
  { id: 'qwen/qwen3-coder:free', name: 'Qwen3 Coder', description: 'Code specialist' },
  { id: 'stepfun/step-3.5-flash:free', name: 'Step 3.5 Flash', description: 'Ultra fast' },
  {
    id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
    name: 'Dolphin Mistral',
    description: 'Creative and open',
  },
] as const;

export type AIModelId = (typeof AI_MODELS)[number]['id'];

