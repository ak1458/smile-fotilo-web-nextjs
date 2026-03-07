import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { createOrder, verifyPaymentSignature, verifyWebhookSignature } from '@/app/lib/razorpay';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { getCurrentUser } from '@/app/lib/auth/session';

function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

function normalizePhoneNumber(phone: string) {
  return phone
    .replace(/^whatsapp:/i, '')
    .replace(/[^\d+]/g, '')
    .trim();
}

function toWaMeNumber(phone: string) {
  const normalized = normalizePhoneNumber(phone);
  return normalized.replace(/^\+/, '');
}

function buildManualPaymentDetails(amountInr: number, notes: Record<string, string> = {}) {
  const rawWhatsappNumber =
    process.env.PAYMENT_WHATSAPP_NUMBER ??
    process.env.TWILIO_WHATSAPP_FROM ??
    process.env.TWILIO_PHONE_NUMBER ??
    '+919453878422';
  const whatsappNumber = normalizePhoneNumber(rawWhatsappNumber);
  const waMeNumber = toWaMeNumber(whatsappNumber);
  const refId = notes.purchase_id ?? notes.template_id ?? `manual-${Date.now()}`;
  const referenceCode = `PAY-${String(refId).slice(0, 8).toUpperCase()}`;
  const whatsappMessage = `Hi Smile Fotilo, I want to complete payment. Reference: ${referenceCode}`;
  const whatsappUrl = waMeNumber
    ? `https://wa.me/${encodeURIComponent(waMeNumber)}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  return {
    mode: 'manual' as const,
    whatsappNumber: whatsappNumber || null,
    whatsappUrl,
    referenceCode,
    amountInr,
  };
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = (await request.json()) as {
      action?: 'create_order' | 'verify_payment';
      amountInr?: number;
      notes?: Record<string, string>;
      orderId?: string;
      paymentId?: string;
      signature?: string;
      purchaseId?: string;
    };

    if (body.action === 'verify_payment') {
      if (!process.env.RAZORPAY_KEY_SECRET) {
        return NextResponse.json({
          verified: false,
          mode: 'manual',
          error: 'Online gateway is disabled. Please use manual payment confirmation.',
        });
      }

      if (!body.orderId || !body.paymentId || !body.signature || !body.purchaseId) {
        return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 });
      }

      const isValid = verifyPaymentSignature(body.orderId, body.paymentId, body.signature);
      if (isValid) {
        const supabase = createAdminClient();
        await supabase
          .from('marketplace_purchases')
          .update({ status: 'completed', razorpay_payment_id: body.paymentId })
          .eq('id', body.purchaseId)
          .eq('buyer_id', user.id)
          .eq('razorpay_order_id', body.orderId);
      }
      return NextResponse.json({ verified: isValid });
    }

    if (body.action !== 'create_order') {
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
    }

    if (!body.amountInr || body.amountInr <= 0) {
      return NextResponse.json({ error: 'amountInr must be greater than zero' }, { status: 400 });
    }

    if (!isRazorpayConfigured()) {
      return NextResponse.json({
        order: null,
        requiresPayment: true,
        mode: 'manual',
        manualPayment: buildManualPaymentDetails(body.amountInr, body.notes ?? {}),
        paymentMessage: 'Online gateway is disabled. Contact us on WhatsApp to complete manual payment.',
      });
    }

    const order = await createOrder(body.amountInr, body.notes ?? {});
    return NextResponse.json({ order, mode: 'razorpay' }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const signature = request.headers.get('x-razorpay-signature');
    if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

    const payload = await request.text();
    const valid = verifyWebhookSignature(payload, signature);
    if (!valid) return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });

    const data = JSON.parse(payload) as {
      event?: string;
      payload?: { payment?: { entity?: { order_id?: string; id?: string } } };
    };

    if (data.event === 'payment.captured') {
      const payment = data.payload?.payment?.entity;
      if (payment?.order_id && payment.id) {
        const supabase = createAdminClient();
        await supabase
          .from('marketplace_purchases')
          .update({ status: 'completed', razorpay_payment_id: payment.id })
          .eq('razorpay_order_id', payment.order_id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
