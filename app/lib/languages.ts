export const SUPPORTED_LANGUAGES = [
  { code: 'hi-EN', name: 'Hinglish', prompt: 'Respond in natural Hinglish (Hindi-English mix).' },
  { code: 'hi', name: 'Hindi', prompt: 'Respond in simple Hindi (Devanagari).' },
  { code: 'en', name: 'English', prompt: 'Respond in clear, professional English.' },
  { code: 'bn', name: 'Bengali', prompt: 'Respond in Bengali script.' },
  { code: 'ta', name: 'Tamil', prompt: 'Respond in Tamil script.' },
  { code: 'te', name: 'Telugu', prompt: 'Respond in Telugu script.' },
  { code: 'mr', name: 'Marathi', prompt: 'Respond in Marathi (Devanagari).' },
  { code: 'gu', name: 'Gujarati', prompt: 'Respond in Gujarati script.' },
  { code: 'kn', name: 'Kannada', prompt: 'Respond in Kannada script.' },
  { code: 'ml', name: 'Malayalam', prompt: 'Respond in Malayalam script.' },
  { code: 'pa', name: 'Punjabi', prompt: 'Respond in Punjabi (Gurmukhi).' },
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export function getLanguagePrompt(code: string): string {
  return (
    SUPPORTED_LANGUAGES.find((lang) => lang.code === code)?.prompt ??
    SUPPORTED_LANGUAGES[0].prompt
  );
}

