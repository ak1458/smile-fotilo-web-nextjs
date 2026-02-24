/**
 * Prompt Injection & Security Guard
 * Protects AI systems from malicious input
 */

// Common prompt injection patterns
const INJECTION_PATTERNS = [
  // Ignore/override instructions
  /ignore\s+(?:all\s+)?(?:previous|above)\s+instructions?/i,
  /disregard\s+(?:all\s+)?(?:previous|above)\s+instructions?/i,
  /forget\s+(?:all\s+)?(?:previous|above)\s+instructions?/i,
  /override\s+(?:all\s+)?(?:previous|above)\s+instructions?/i,
  
  // Role/system manipulation
  /you\s+are\s+now\s+(?:a|an)\s+/i,
  /from\s+now\s+on\s+you\s+are/i,
  /act\s+as\s+(?:a|an)\s+/i,
  /pretend\s+to\s+be/i,
  /roleplay\s+as/i,
  
  // System prompt leaks
  /system\s*:\s*/i,
  /system\s+instruction/i,
  /system\s+prompt/i,
  
  // Delimiter manipulation
  /```\s*system/i,
  /<\s*system\s*>/i,
  /\[\s*system\s*\]/i,
  
  // Jailbreak attempts
  /jailbreak/i,
  /DAN\s*\(/i,
  /do\s+anything\s+now/i,
  /developer\s+mode/i,
  /ignore\s+ethical/i,
  /ignore\s+moral/i,
  
  // Code injection
  /<script\b/i,
  /javascript\s*:/i,
  /on\w+\s*=/i,
  /\beval\s*\(/i,
  /\bexec\s*\(/i,
  
  // Data exfiltration attempts
  /repeat\s+(?:all|previous|above|the)\s+(?:text|prompt|instruction)/i,
  /copy\s+(?:all|previous|above|the)\s+(?:text|prompt|instruction)/i,
  /output\s+(?:all|previous|above|the)\s+(?:text|prompt|instruction)/i,
  /show\s+(?:all|previous|above|the)\s+(?:text|prompt|instruction)/i,
  /print\s+(?:all|previous|above|the)\s+(?:text|prompt|instruction)/i,
];

// Suspicious character patterns
const SUSPICIOUS_PATTERNS = [
  // Excessive repetition
  /(.)\1{10,}/,
  
  // Unusual Unicode (potential homograph attacks)
  /[\u200B-\u200F\u2060-\u206F\uFEFF]/,
  
  // Excessive length
  /.{3000,}/,
];

// Blocked keywords for business context
const BLOCKED_KEYWORDS = [
  'hack',
  'exploit',
  'vulnerability',
  'sql injection',
  'xss',
  'csrf',
  'backdoor',
  'malware',
  'virus',
  'trojan',
  'ransomware',
  'phishing',
  'credential stuffing',
  'brute force',
  'ddos',
  'botnet',
];

export interface PromptGuardResult {
  safe: boolean;
  reason?: string;
  sanitized: string;
}

/**
 * Check if input contains prompt injection attempts
 */
export function detectPromptInjection(input: string): { detected: boolean; reason?: string } {
  if (!input || typeof input !== 'string') {
    return { detected: true, reason: 'Invalid input' };
  }
  
  // Check injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return { 
        detected: true, 
        reason: 'Potential prompt injection pattern detected' 
      };
    }
  }
  
  // Check suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(input)) {
      return { 
        detected: true, 
        reason: 'Suspicious input pattern detected' 
      };
    }
  }
  
  // Check blocked keywords
  const lowerInput = input.toLowerCase();
  for (const keyword of BLOCKED_KEYWORDS) {
    if (lowerInput.includes(keyword)) {
      return { 
        detected: true, 
        reason: 'Blocked content detected' 
      };
    }
  }
  
  return { detected: false };
}

/**
 * Sanitize user input for AI prompts
 */
export function sanitizePromptInput(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  let sanitized = input;
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Remove control characters except newlines
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Remove zero-width characters
  sanitized = sanitized.replace(/[\u200B-\u200F\u2060-\u206F\uFEFF]/g, '');
  
  // Escape special prompt characters
  sanitized = sanitized
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Limit length
  sanitized = sanitized.slice(0, maxLength);
  
  return sanitized.trim();
}

/**
 * Full guard check for AI input
 */
export function guardPromptInput(
  input: string, 
  options: { maxLength?: number; allowBlockedKeywords?: boolean } = {}
): PromptGuardResult {
  const maxLength = options.maxLength || 1000;
  
  // First, check for injection
  const injectionCheck = detectPromptInjection(input);
  if (injectionCheck.detected) {
    return {
      safe: false,
      reason: injectionCheck.reason,
      sanitized: '',
    };
  }
  
  // Then sanitize
  const sanitized = sanitizePromptInput(input, maxLength);
  
  return {
    safe: true,
    sanitized,
  };
}

/**
 * Validate and sanitize conversation history
 */
export function sanitizeConversationHistory(
  history: Array<{ role: string; content: string }>,
  maxMessages: number = 20
): Array<{ role: 'user' | 'assistant'; content: string }> {
  if (!Array.isArray(history)) {
    return [];
  }
  
  return history
    .slice(-maxMessages) // Keep only last N messages
    .map(msg => {
      const role: 'user' | 'assistant' =
        msg.role === 'assistant' || msg.role === 'model' ? 'assistant' : 'user';
      return {
        role,
        content: sanitizePromptInput(msg.content, 500),
      };
    })
    .filter(msg => msg.content.length > 0);
}
