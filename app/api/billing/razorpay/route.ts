import { NextRequest, NextResponse } from 'next/server';
import { createOrder, verifyPaymentSignature, verifyWebhookSignature } from '@/app/lib/razorpay';
import { createAdminClient } from '@/app/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      action?: 'create_order' | 'verify_payment';
      amountInr?: number;
      notes?: Record<string, string>;
      orderId?: string;
      paymentId?: string;
      signature?: string;
    };

    if (body.action === 'verify_payment') {
      if (!body.orderId || !body.paymentId || !body.signature) {
        return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 });
      }

      const isValid = verifyPaymentSignature(body.orderId, body.paymentId, body.signature);
      return NextResponse.json({ verified: isValid });
    }

    if (body.action !== 'create_order') {
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
    }

    if (!body.amountInr || body.amountInr <= 0) {
      return NextResponse.json({ error: 'amountInr must be greater than zero' }, { status: 400 });
    }

    const order = await createOrder(body.amountInr, body.notes ?? {});
    return NextResponse.json({ order }, { status: 201 });
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