// Available free AI models for the Echo chatbot
// This file is shared between server actions and client components

export const AI_MODELS = [
    { id: 'auto', name: '⚡ Auto (Smart)', description: 'Best model for each query' },
    { id: 'z-ai/glm-4.5-air:free', name: '🧠 GLM-4.5 Air', description: 'Fast & reliable' },
    { id: 'deepseek/deepseek-r1-0528:free', name: '🔬 DeepSeek R1', description: 'Deep reasoning' },
    { id: 'openai/gpt-oss-120b:free', name: '🤖 GPT-OSS 120B', description: 'GPT-class power' },
    { id: 'qwen/qwen3-coder:free', name: '💻 Qwen3 Coder', description: 'Code specialist' },
    { id: 'stepfun/step-3.5-flash:free', name: '⚡ Step 3.5 Flash', description: 'Ultra fast' },
    { id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', name: '🐬 Dolphin Mistral', description: 'Creative & open' },
] as const;

export type AIModelId = typeof AI_MODELS[number]['id'];
