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

export async function sendWhatsAppMessage(
  to: string,
  message: string,
  fromPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
) {
  if (!fromPhoneNumberId) {
    throw new Error('WHATSAPP_PHONE_NUMBER_ID is not set.');
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
  if (!fromPhoneNumberId) {
    throw new Error('WHATSAPP_PHONE_NUMBER_ID is not set.');
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

