import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { sendWhatsAppTemplate } from '@/app/lib/whatsapp/client';
import { validateTwilioSignature, getTwilioParams } from '@/app/lib/security/twilio-verify';
import { rateLimitMiddleware, rateLimits } from '@/app/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = await rateLimitMiddleware(request, rateLimits.webhook);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: rateLimit.headers }
      );
    }

    // Verify Twilio signature
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const signature = request.headers.get('X-Twilio-Signature');
    const url = request.url;
    
    const params = await getTwilioParams(request.clone());
    
    if (!authToken) {
      console.error('[CALLS_WEBHOOK] TWILIO_AUTH_TOKEN not configured');
      return NextResponse.json(
        { error: 'Service not configured' },
        { status: 503, headers: rateLimit.headers }
      );
    }
    
    // Validate signature in production
    if (process.env.NODE_ENV === 'production') {
      const isValid = validateTwilioSignature(authToken, signature, url, params);
      if (!isValid) {
        console.warn('[CALLS_WEBHOOK] Invalid signature', { signature, url });
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // Extract Twilio params
    const businessPhone = params.To || '';
    const callerNumber = params.From || '';
    const callStatus = params.CallStatus || '';
    const callDuration = parseInt(params.CallDuration || '0', 10);

    // Only process missed calls (duration < 5 seconds or no-answer)
    if (callDuration > 5 || callStatus !== 'no-answer') {
      return NextResponse.json({ status: 'ignored' }, { headers: rateLimit.headers });
    }

    const supabaseAdmin = createAdminClient();

    // Find business by phone number
    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('phone', businessPhone)
      .single();

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404, headers: rateLimit.headers }
      );
    }

    // Record missed call
    const { data: missedCall } = await supabaseAdmin
      .from('missed_calls')
      .insert({
        business_id: business.id,
        caller_number: callerNumber,
        call_time: new Date().toISOString(),
        call_duration: callDuration,
        recovery_status: 'pending',
      })
      .select()
      .single();

    // Send WhatsApp recovery message
    try {
      await sendWhatsAppTemplate(
        callerNumber,
        'missed_call_followup',
        'hi',
        [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: business.name },
              { type: 'text', text: business.phone },
            ],
          },
        ],
        business.whatsapp_number
      );

      // Update recovery status
      if (missedCall) {
        await supabaseAdmin
          .from('missed_calls')
          .update({
            recovery_status: 'whatsapp_sent',
            recovery_sent_at: new Date().toISOString(),
          })
          .eq('id', missedCall.id);
      }
    } catch (error) {
      console.error('[CALLS_WEBHOOK] Failed to send WhatsApp:', error);
    }

    return NextResponse.json(
      { status: 'recovery_initiated', missedCallId: missedCall?.id },
      { headers: rateLimit.headers }
    );
  } catch (error: unknown) {
    console.error('[CALLS_WEBHOOK] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
