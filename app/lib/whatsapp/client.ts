import { isTwilioSmsConfigured, sendTwilioSms } from '@/app/lib/twilio/client';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0';

function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('91')) return cleaned;
  return `91${cleaned}`;
}

function getAuthToken() {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token) {
    throw new Error('WHATSAPP_ACCESS_TOKEN is not set.');
  }
  return token;
}

function hasMetaWhatsAppConfig(fromPhoneNumberId?: string) {
  return Boolean(process.env.WHATSAPP_ACCESS_TOKEN && fromPhoneNumberId);
}

function extractTemplateText(templateName: string, components: unknown[]) {
  const list = Array.isArray(components) ? components : [];
  const bodyComponent = list.find(
    (item) =>
      item &&
      typeof item === 'object' &&
      'type' in item &&
      (item as { type?: string }).type === 'body'
  ) as { parameters?: Array<{ text?: string }> } | undefined;

  const values = (bodyComponent?.parameters ?? [])
    .map((param) => param?.text?.trim())
    .filter((value): value is string => Boolean(value));

  if (templateName === 'appointment_reminder_24h' && values.length >= 4) {
    return `Reminder: ${values[0]}, your appointment is on ${values[1]} at ${values[2]} with ${values[3]}.`;
  }

  if (values.length > 0) {
    return `[${templateName}] ${values.join(' | ')}`;
  }

  return `You have a new message from your business (${templateName}).`;
}

export async function sendWhatsAppMessage(
  to: string,
  message: string,
  fromPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
) {
  if (!hasMetaWhatsAppConfig(fromPhoneNumberId)) {
    if (isTwilioSmsConfigured()) {
      return sendTwilioSms(to, message);
    }
    throw new Error(
      'WhatsApp Cloud API is not configured and Twilio SMS fallback is unavailable.'
    );
  }

  const response = await fetch(`${WHATSAPP_API_URL}/${fromPhoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formatPhoneNumber(to),
      type: 'text',
      text: { body: message },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message ?? 'Failed to send WhatsApp message');
  }

  return data;
}

export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode: string,
  components: unknown[] = [],
  fromPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
) {
  if (!hasMetaWhatsAppConfig(fromPhoneNumberId)) {
    if (isTwilioSmsConfigured()) {
      const fallbackText = extractTemplateText(templateName, components);
      return sendTwilioSms(to, fallbackText);
    }
    throw new Error(
      'WhatsApp Cloud API is not configured and Twilio SMS fallback is unavailable.'
    );
  }

  const response = await fetch(`${WHATSAPP_API_URL}/${fromPhoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formatPhoneNumber(to),
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components,
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message ?? 'Failed to send WhatsApp template');
  }

  return data;
}
