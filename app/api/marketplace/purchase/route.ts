import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { createOrder } from '@/app/lib/razorpay';
import { canAccessBusiness, getCurrentUser } from '@/app/lib/auth/session';

const purchaseSchema = z.object({
  templateSlug: z.string().min(2),
  businessId: z.string().uuid().nullable().optional(),
});

const manualConfirmSchema = z.object({
  action: z.literal('manual_confirm'),
  purchaseId: z.string().uuid(),
  transactionId: z.string().min(4).max(120),
});

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

function buildManualPaymentDetails(amountInr: number, templateName: string, purchaseId: string) {
  const rawWhatsappNumber =
    process.env.PAYMENT_WHATSAPP_NUMBER ??
    process.env.TWILIO_WHATSAPP_FROM ??
    process.env.TWILIO_PHONE_NUMBER ??
    '+919453878422';
  const whatsappNumber = normalizePhoneNumber(rawWhatsappNumber);
  const waMeNumber = toWaMeNumber(whatsappNumber);
  const referenceCode = `PAY-${purchaseId.slice(0, 8).toUpperCase()}`;
  const message = [
    `Hi Smile Fotilo, I want to buy template "${templateName}".`,
    `Amount: INR ${amountInr}`,
    `Reference: ${referenceCode}`,
  ].join('\n');
  const whatsappUrl = waMeNumber
    ? `https://wa.me/${encodeURIComponent(waMeNumber)}?text=${encodeURIComponent(message)}`
    : null;

  return {
    mode: 'manual' as const,
    whatsappNumber: whatsappNumber || null,
    whatsappUrl,
    referenceCode,
    amountInr,
    templateName,
  };
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = purchaseSchema.parse(await request.json());
    if (payload.businessId && !(await canAccessBusiness(user.id, payload.businessId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = createAdminClient();

    const { data: template, error: templateError } = await supabase
      .from('agent_templates')
      .select('id,name,price_inr,status,creator_id')
      .eq('slug', payload.templateSlug)
      .maybeSingle();

    if (templateError) {
      return NextResponse.json({ error: templateError.message }, { status: 500 });
    }

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    if (template.status !== 'published' && template.creator_id !== user.id) {
      return NextResponse.json({ error: 'Template is not available for purchase' }, { status: 400 });
    }

    const amountInr = template.price_inr ?? 0;

    if (amountInr <= 0) {
      const { data: purchase, error: purchaseError } = await supabase
        .from('marketplace_purchases')
        .insert({
          buyer_id: user.id,
          template_id: template.id,
          amount_paid: 0,
          status: 'completed',
        })
        .select('id')
        .single();

      if (purchaseError) {
        return NextResponse.json({ error: purchaseError.message }, { status: 500 });
      }

      return NextResponse.json({
        purchaseId: purchase.id,
        requiresPayment: false,
        paymentMessage: 'Free template. No payment required.',
      });
    }

    if (!isRazorpayConfigured()) {
      const { data: purchase, error: purchaseError } = await supabase
        .from('marketplace_purchases')
        .insert({
          buyer_id: user.id,
          template_id: template.id,
          amount_paid: amountInr,
          status: 'manual_pending',
        })
        .select('id')
        .single();

      if (purchaseError) {
        return NextResponse.json({ error: purchaseError.message }, { status: 500 });
      }

      const manualPayment = buildManualPaymentDetails(amountInr, template.name, purchase.id);
      return NextResponse.json({
        purchaseId: purchase.id,
        requiresPayment: true,
        manualPayment,
        paymentMessage:
          'Online checkout is not active. Message us on WhatsApp for payment, then enter your approval/reference code.',
      });
    }

    try {
      const order = await createOrder(amountInr, {
        template_id: template.id,
        template_slug: payload.templateSlug,
        buyer_id: user.id,
        business_id: payload.businessId ?? '',
      });

      const { data: purchase, error: purchaseError } = await supabase
        .from('marketplace_purchases')
        .insert({
          buyer_id: user.id,
          template_id: template.id,
          amount_paid: amountInr,
          razorpay_order_id: order.id,
          status: 'pending',
        })
        .select('id')
        .single();

      if (purchaseError) {
        return NextResponse.json({ error: purchaseError.message }, { status: 500 });
      }

      return NextResponse.json({
        purchaseId: purchase.id,
        requiresPayment: true,
        order,
        razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID ?? null,
        paymentMessage: 'Payment order created. Complete checkout to activate installation.',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create payment order';
      const { data: purchase, error: purchaseError } = await supabase
        .from('marketplace_purchases')
        .insert({
          buyer_id: user.id,
          template_id: template.id,
          amount_paid: amountInr,
          status: 'manual_pending',
        })
        .select('id')
        .single();

      if (purchaseError) {
        return NextResponse.json({ error: purchaseError.message }, { status: 500 });
      }

      const manualPayment = buildManualPaymentDetails(amountInr, template.name, purchase.id);
      return NextResponse.json({
        purchaseId: purchase.id,
        requiresPayment: true,
        manualPayment,
        paymentMessage: `Gateway unavailable (${message}). Message us on WhatsApp for payment, then enter your approval/reference code.`,
      });
    }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = manualConfirmSchema.parse(await request.json());
    const supabase = createAdminClient();

    const { data: purchase, error: purchaseError } = await supabase
      .from('marketplace_purchases')
      .select('id,buyer_id,status')
      .eq('id', payload.purchaseId)
      .maybeSingle();

    if (purchaseError) {
      return NextResponse.json({ error: purchaseError.message }, { status: 500 });
    }

    if (!purchase || purchase.buyer_id !== user.id) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
    }

    if (purchase.status === 'completed') {
      return NextResponse.json({ verified: true, alreadyCompleted: true });
    }

    const { error: updateError } = await supabase
      .from('marketplace_purchases')
      .update({
        status: 'completed',
        razorpay_payment_id: `manual:${payload.transactionId.trim()}`,
      })
      .eq('id', payload.purchaseId)
      .eq('buyer_id', user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ verified: true, manual: true });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
