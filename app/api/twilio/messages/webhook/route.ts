import { NextRequest, NextResponse } from 'next/server';
import { chatWithBusinessAgent } from '@/app/lib/ai/business-chat';
import { validateTwilioSignature, getTwilioParams } from '@/app/lib/security/twilio-verify';
import { rateLimitMiddleware, rateLimits } from '@/app/lib/security/rate-limit';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function twimlMessage(message: string) {
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(
    message
  )}</Message></Response>`;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = await rateLimitMiddleware(request, rateLimits.webhook);
    if (!rateLimit.allowed) {
      return new NextResponse(
        twimlMessage('Too many requests. Please try again later.'),
        {
          status: 429,
          headers: {
            'Content-Type': 'text/xml',
            'Retry-After': rateLimit.headers['Retry-After'],
          },
        }
      );
    }

    // Verify Twilio signature
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const signature = request.headers.get('X-Twilio-Signature');
    const url = request.url;
    
    // Clone request to read params without consuming body
    const params = await getTwilioParams(request.clone());
    
    if (!authToken) {
      console.error('[TWILIO_WEBHOOK] TWILIO_AUTH_TOKEN not configured');
      return new NextResponse(
        twimlMessage('Service temporarily unavailable.'),
        {
          status: 200,
          headers: { 'Content-Type': 'text/xml' },
        }
      );
    }
    
    // Validate signature in production
    if (process.env.NODE_ENV === 'production') {
      const isValid = validateTwilioSignature(authToken, signature, url, params);
      if (!isValid) {
        console.warn('[TWILIO_WEBHOOK] Invalid signature', { signature, url });
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const fromRaw = (params.From ?? '').trim();
    const body = (params.Body ?? '').trim();
    const businessId = process.env.DEFAULT_BUSINESS_ID;

    if (!fromRaw || !body) {
      return new NextResponse(twimlMessage('Please send a text message so I can help.'), {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    if (!businessId) {
      return new NextResponse(
        twimlMessage('Business setup is pending. Our team will contact you shortly.'),
        {
          status: 200,
          headers: { 'Content-Type': 'text/xml' },
        }
      );
    }

    const isWhatsApp = fromRaw.startsWith('whatsapp:');
    const customerPhone = isWhatsApp ? fromRaw.replace(/^whatsapp:/, '') : fromRaw;

    try {
      const result = await chatWithBusinessAgent({
        businessId,
        customerPhone,
        message: body,
        source: isWhatsApp ? 'whatsapp' : 'manual',
      });

      return new NextResponse(twimlMessage(result.response), {
        status: 200,
        headers: { 
          'Content-Type': 'text/xml',
          ...rateLimit.headers,
        },
      });
    } catch {
      return new NextResponse(
        twimlMessage('Thanks for your message. Our team will reply shortly.'),
        {
          status: 200,
          headers: { 
            'Content-Type': 'text/xml',
            ...rateLimit.headers,
          },
        }
      );
    }
  } catch {
    return new NextResponse(
      twimlMessage('Request could not be processed right now. Please try again shortly.'),
      {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      }
    );
  }
}
