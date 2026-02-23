import crypto from 'crypto';
import Razorpay from 'razorpay';

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay keys are not configured.');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export async function createOrder(amountInr: number, notes: Record<string, string> = {}) {
  const client = getRazorpayClient();
  return client.orders.create({
    amount: Math.round(amountInr * 100),
    currency: 'INR',
    notes,
  });
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', keySecret).update(body).digest('hex');
  return expected === signature;
}

export function verifyWebhookSignature(payload: string, signature: string) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) return false;

  const expected = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex');
  return expected === signature;
}

