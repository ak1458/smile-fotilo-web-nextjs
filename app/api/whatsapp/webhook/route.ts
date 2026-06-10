import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { chatWithBusinessAgent } from '@/app/lib/ai/business-chat';

function safeTokenEqual(received: string, expected: string) {
  const receivedBuf = Buffer.from(received);
  const expectedBuf = Buffer.from(expected);
  if (receivedBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(receivedBuf, expectedBuf);
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('hub.mode');
  const token = request.nextUrl.searchParams.get('hub.verify_token');
  const challenge = request.nextUrl.searchParams.get('hub.challenge');
  const expectedToken = process.env.WHATSAPP_WEBHOOK_SECRET?.trim();

  if (mode === 'subscribe' && expectedToken && token && safeTokenEqual(token, expectedToken)) {
    return new NextResponse(challenge ?? '', { status: 200 });
  }

  return NextResponse.json({ error: 'verification failed' }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as {
      entry?: Array<{
        changes?: Array<{
          value?: {
            messages?: Array<{ from?: string; text?: { body?: string } }>;
          };
        }>;
      }>;
    };

    const messages = payload.entry?.flatMap((entry) =>
      entry.changes?.flatMap((change) => change.value?.messages ?? []) ?? []
    ) ?? [];

    for (const msg of messages) {
      const text = msg.text?.body;
      const from = msg.from;
      if (!text || !from) continue;

      const defaultBusinessId = process.env.DEFAULT_BUSINESS_ID;
      if (!defaultBusinessId) continue;

      await chatWithBusinessAgent({
        businessId: defaultBusinessId,
        customerPhone: from,
        message: text,
        source: 'whatsapp',
      });
    }

    return NextResponse.json({ status: 'received' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
