import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { chatWithBusinessAgent } from '@/app/lib/ai/business-chat';

const executeSchema = z.object({
  businessId: z.string().uuid(),
  message: z.string().min(1),
  customerPhone: z.string().min(7),
  source: z.enum(['website', 'whatsapp', 'phone', 'gmb', 'manual']).optional(),
  conversationId: z.string().uuid().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = executeSchema.parse(await request.json());

    const result = await chatWithBusinessAgent({
      businessId: payload.businessId,
      agentId: id,
      message: payload.message,
      customerPhone: payload.customerPhone,
      source: payload.source,
      conversationId: payload.conversationId,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

