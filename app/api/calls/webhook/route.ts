import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { sendWhatsAppMessage } from '@/app/lib/whatsapp/client';

function parseTwilioPayload(body: URLSearchParams | Record<string, unknown>) {
  const get = (key: string) => (body instanceof URLSearchParams ? body.get(key) : (body[key] as string | undefined));
  return {
    to: get('To') ?? '',
    from: get('From') ?? '',
    status: get('CallStatus') ?? '',
    duration: Number(get('CallDuration') ?? '0'),
  };
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') ?? '';
    let payload: URLSearchParams | Record<string, unknown>;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      payload = new URLSearchParams(await request.text());
    } else {
      payload = (await request.json()) as Record<string, unknown>;
    }

    const data = parseTwilioPayload(payload);
    if (!data.to || !data.from) {
      return NextResponse.json({ status: 'ignored', reason: 'missing phone fields' }, { status: 200 });
    }

    if (data.status !== 'no-answer' && data.duration > 5) {
      return NextResponse.json({ status: 'ignored', reason: 'not a missed call' }, { status: 200 });
    }

    const supabase = createAdminClient();
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('phone', data.to)
      .maybeSingle();

    if (businessError) return NextResponse.json({ error: businessError.message }, { status: 500 });
    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    const { data: call, error: callError } = await supabase
      .from('missed_calls')
      .insert({
        business_id: business.id,
        caller_number: data.from,
        call_time: new Date().toISOString(),
        call_duration: data.duration,
        recovery_status: 'pending',
      })
      .select('*')
      .single();

    if (callError) return NextResponse.json({ error: callError.message }, { status: 500 });

    try {
      await sendWhatsAppMessage(
        data.from,
        `Namaste! Aapne ${business.name} par call kiya tha. Aap appointment, services ya timing ke liye reply kar sakte hain.`,
        business.whatsapp_number ?? undefined
      );

      await supabase
        .from('missed_calls')
        .update({ recovery_status: 'whatsapp_sent', recovery_sent_at: new Date().toISOString() })
        .eq('id', call.id);
    } catch {
      await supabase
        .from('missed_calls')
        .update({ recovery_status: 'failed' })
        .eq('id', call.id);
    }

    return NextResponse.json({ status: 'ok', missedCallId: call.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}