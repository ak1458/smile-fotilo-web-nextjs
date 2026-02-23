import { generateAIResponse } from '@/app/lib/ai/smart-router';
import { supabaseAdmin } from '@/app/lib/supabase/admin';
import { getLanguagePrompt } from '@/app/lib/languages';

type MessageHistory = Array<{ role: 'user' | 'assistant'; content: string }>;

function buildPrompt(input: {
  businessName: string;
  category?: string | null;
  languagePreference?: string | null;
  agentName?: string | null;
  knowledge: string[];
  customerMessage: string;
  history: MessageHistory;
}) {
  const language = input.languagePreference ?? 'hi-EN';
  const languagePrompt = getLanguagePrompt(language);

  const historyText = input.history
    .slice(-8)
    .map((m) => `${m.role === 'user' ? 'Customer' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const knowledgeText = input.knowledge.length
    ? input.knowledge.join('\n\n')
    : 'No specific business documents uploaded yet.';

  return `
You are ${input.agentName ?? 'AI Receptionist'} for ${input.businessName}${
    input.category ? ` (${input.category})` : ''
  }.
${languagePrompt}

Business knowledge:
${knowledgeText}

Recent conversation:
${historyText || 'No previous conversation.'}

Rules:
1. Keep replies concise and practical.
2. For appointments, collect name, phone, preferred date/time.
3. If unsure, say you will connect with human staff.
4. Avoid making up unavailable pricing/timings.

Customer message:
${input.customerMessage}
`.trim();
}

export async function chatWithBusinessAgent(input: {
  businessId: string;
  agentId?: string;
  customerPhone: string;
  message: string;
  source?: 'website' | 'whatsapp' | 'phone' | 'gmb' | 'manual';
  conversationId?: string;
}) {
  const source = input.source ?? 'website';

  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('*')
    .eq('id', input.businessId)
    .single();

  if (!business) {
    throw new Error('Business not found');
  }

  let agentId = input.agentId;
  if (!agentId) {
    const { data: defaultAgent } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('business_id', input.businessId)
      .eq('is_active', true)
      .limit(1)
      .single();
    agentId = defaultAgent?.id;
  }

  let conversationId = input.conversationId;
  if (!conversationId) {
    const { data: conversation } = await supabaseAdmin
      .from('conversations')
      .insert({
        business_id: input.businessId,
        agent_id: agentId ?? null,
        customer_phone: input.customerPhone,
        source,
      })
      .select('id')
      .single();
    conversationId = conversation?.id;
  }

  if (!conversationId) {
    throw new Error('Failed to create or resolve conversation');
  }

  const [{ data: historyRows }, { data: docs }, { data: agent }] = await Promise.all([
    supabaseAdmin
      .from('messages')
      .select('sender_type, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(20),
    agentId
      ? supabaseAdmin.from('knowledge_documents').select('content').eq('agent_id', agentId).limit(10)
      : Promise.resolve({ data: [] as Array<{ content: string }> }),
    agentId
      ? supabaseAdmin.from('agents').select('name').eq('id', agentId).single()
      : Promise.resolve({ data: null as { name?: string } | null }),
  ]);

  const history: MessageHistory =
    historyRows?.map((row) => ({
      role: row.sender_type === 'customer' ? 'user' : 'assistant',
      content: row.content,
    })) ?? [];

  const prompt = buildPrompt({
    businessName: business.name,
    category: business.category,
    languagePreference: business.language_preference,
    agentName: agent?.name,
    knowledge: docs?.map((d) => d.content) ?? [],
    customerMessage: input.message,
    history,
  });

  const response = await generateAIResponse(prompt, {
    complexity: 'medium',
    maxTokens: 350,
    temperature: 0.6,
  });

  await supabaseAdmin.from('messages').insert([
    {
      conversation_id: conversationId,
      sender_type: 'customer',
      content: input.message,
    },
    {
      conversation_id: conversationId,
      sender_type: 'ai',
      content: response,
      ai_confidence: 0.85,
      requires_human: false,
    },
  ]);

  await supabaseAdmin
    .from('conversations')
    .update({ last_message_at: new Date().toISOString(), status: 'active' })
    .eq('id', conversationId);

  return {
    conversationId,
    response,
  };
}

