/**
 * Twilio Webhook Signature Verification
 * Protects Twilio webhooks from spoofing attacks
 */

import crypto from 'crypto';

/**
 * Validate Twilio request signature
 * https://www.twilio.com/docs/usage/security#validating-requests
 */
export function validateTwilioSignature(
  authToken: string,
  signature: string | null,
  url: string,
  params: Record<string, string>
): boolean {
  if (!signature || !authToken) {
    return false;
  }
  
  // Sort params alphabetically and append to URL
  const sortedKeys = Object.keys(params).sort();
  let data = url;
  
  for (const key of sortedKeys) {
    data += key + params[key];
  }
  
  // Calculate HMAC-SHA1
  const expectedSignature = crypto
    .createHmac('sha1', authToken)
    .update(data)
    .digest('base64');
  
  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'base64'),
      Buffer.from(expectedSignature, 'base64')
    );
  } catch {
    return false;
  }
}

/**
 * Get params from request based on content type
 */
export async function getTwilioParams(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get('content-type') || '';
  
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = new URLSearchParams(await request.text());
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }
  
  // For JSON, flatten the object
  try {
    const json = await request.json();
    return flattenObject(json);
  } catch {
    return {};
  }
}

/**
 * Flatten nested object to single level (for signature validation)
 */
function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const key of Object.keys(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    
    if (value === null || value === undefined) {
      continue;
    }
    
    if (typeof value === 'object') {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else {
      result[newKey] = String(value);
    }
  }
  
  return result;
}
