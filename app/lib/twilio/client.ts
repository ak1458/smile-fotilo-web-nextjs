type TwilioMessageResponse = {
  sid?: string;
  status?: string;
  error_code?: string | null;
  error_message?: string | null;
  message?: string;
};

function normalizePhone(phone: string): string {
  if (phone.startsWith('whatsapp:')) return phone;
  const cleaned = phone.replace(/\D/g, '');
  if (phone.startsWith('+')) return phone;
  if (cleaned.startsWith('91')) return `+${cleaned}`;
  if (cleaned.length === 10) return `+91${cleaned}`;
  return `+${cleaned}`;
}

function getTwilioCredentials() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials are not configured.');
  }
  return { accountSid, authToken };
}

export function isTwilioSmsConfigured() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      (process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_WHATSAPP_FROM)
  );
}

export async function sendTwilioSms(
  to: string,
  body: string,
  from = process.env.TWILIO_PHONE_NUMBER ?? process.env.TWILIO_WHATSAPP_FROM
) {
  if (!from) {
    throw new Error('TWILIO_PHONE_NUMBER or TWILIO_WHATSAPP_FROM is not set.');
  }

  const { accountSid, authToken } = getTwilioCredentials();
  const normalizedTo = normalizePhone(to);
  const isWhatsAppSender = from.startsWith('whatsapp:');
  const toValue =
    isWhatsAppSender && !normalizedTo.startsWith('whatsapp:')
      ? `whatsapp:${normalizedTo}`
      : normalizedTo;

  const form = new URLSearchParams({
    To: toValue,
    From: from,
    Body: body,
  });

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    }
  );

  const data = (await response.json()) as TwilioMessageResponse;
  if (!response.ok) {
    throw new Error(data.message || data.error_message || 'Failed to send Twilio SMS');
  }

  return data;
}
