// FREE TIER VIDEO GENERATION
// Uses Groq (free $5/mo) for scripts + Canva (free) for videos
// NO Runway, NO paid video APIs needed

import { NextRequest, NextResponse } from 'next/server';

// Canva template library (create these in Canva, share links)
const CANVA_TEMPLATES: Record<string, { url: string; name: string; duration: string }> = {
  'clinic_welcome': {
    url: 'https://www.canva.com/design/YOUR_CLINIC_TEMPLATE/edit',
    name: 'Clinic Welcome Video',
    duration: '30s'
  },
  'festive_offer': {
    url: 'https://www.canva.com/design/YOUR_FESTIVE_TEMPLATE/edit',
    name: 'Festive Special Offer',
    duration: '30s'
  },
  'testimonial': {
    url: 'https://www.canva.com/design/YOUR_TESTIMONIAL_TEMPLATE/edit',
    name: 'Patient Testimonial',
    duration: '45s'
  },
  'educational': {
    url: 'https://www.canva.com/design/YOUR_EDUCATIONAL_TEMPLATE/edit',
    name: 'Health Tips',
    duration: '60s'
  },
  'behind_scenes': {
    url: 'https://www.canva.com/design/YOUR_BTS_TEMPLATE/edit',
    name: 'Behind the Scenes',
    duration: '30s'
  },
  'doctor_intro': {
    url: 'https://www.canva.com/design/YOUR_INTRO_TEMPLATE/edit',
    name: 'Doctor Introduction',
    duration: '45s'
  }
};

export async function POST(request: NextRequest) {
  try {
    const { businessId, prompt, template = 'clinic_welcome', language = 'hi-EN' } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 1. Generate script using Groq (FREE - $5/month credit)
    const script = await generateScriptWithGroq(prompt, language);

    // 2. Generate captions using Gemini (FREE - 1,500 requests/day)
    const captions = await generateCaptionsWithGemini(prompt, language);

    // 3. Generate hashtags
    const hashtags = generateHashtags(prompt);

    // 4. Get Canva template
    const canvaTemplate = CANVA_TEMPLATES[template] || CANVA_TEMPLATES['clinic_welcome'];

    // 5. Generate Canva instructions
    const instructions = generateCanvaInstructions(script, canvaTemplate);

    // 6. Save to database (optional - can store in Supabase)
    const videoData = {
      id: generateId(),
      businessId,
      template,
      script,
      captions,
      hashtags,
      canvaTemplate,
      instructions,
      status: 'script_ready',
      createdAt: new Date().toISOString(),
      language
    };

    // Return everything the user needs
    return NextResponse.json({
      success: true,
      message: '✅ Video script generated! Create your video in Canva.',
      data: videoData,
      nextSteps: [
        'Click the Canva template link',
        'Replace placeholder text with the generated script',
        'Add your photos/videos',
        'Download as MP4',
        'Upload back to schedule'
      ]
    });

  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video content' },
      { status: 500 }
    );
  }
}

async function generateScriptWithGroq(prompt: string, language: string): Promise<string> {
  const languageInstructions: Record<string, string> = {
    'hi-EN': 'Write in Hinglish (Hindi-English mix) as naturally spoken in India. Example: "Namaste! Main Dr. Sharma ka assistant hoon."',
    'hi': 'Write in Hindi (Devanagari script).',
    'en': 'Write in English.',
    'bn': 'Write in Bengali.',
    'ta': 'Write in Tamil.',
    'te': 'Write in Telugu.',
  };

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: `You are a video script writer for Indian local businesses. ${languageInstructions[language] || languageInstructions['hi-EN']}`
      }, {
        role: 'user',
        content: `Create a 30-second video script for this business: ${prompt}

STRUCTURE (strictly follow):
1. HOOK (0-5 seconds): Attention-grabbing opening
2. BODY (5-25 seconds): Main message with 2-3 key points
3. CTA (25-30 seconds): Clear call-to-action

RULES:
- Keep sentences short and punchy
- Use local language style
- Add natural pauses (indicate with ...)
- Include emotion indicators like [smile], [enthusiastic]
- Mention business name at least once
- End with strong CTA

OUTPUT FORMAT:
HOOK: (text)
BODY: (text)  
CTA: (text)

TOTAL SCRIPT: (full script)`
      }],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    // Fallback to template if Groq fails
    return generateFallbackScript();
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || generateFallbackScript();
}

async function generateCaptionsWithGemini(prompt: string, language: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate 3 Instagram captions for this business video: ${prompt}

REQUIREMENTS:
1. Caption 1: Short & punchy (under 100 chars), lots of emoji
2. Caption 2: Medium length with key benefits (under 150 chars)
3. Caption 3: Story-style, engaging (under 200 chars)

Include relevant hashtags at the end of each.

Language: ${language === 'hi-EN' ? 'Hinglish' : language}

OUTPUT FORMAT:
CAPTION 1:
(text)

CAPTION 2:
(text)

CAPTION 3:
(text)`
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      return generateFallbackCaptions();
    }

    const data = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text || '';

    // Parse captions
    const captions = text.split('CAPTION').filter(Boolean).map((c: string) => c.replace(/^\d+:/, '').trim());

    return captions.length >= 3 ? captions : generateFallbackCaptions();

  } catch {
    return generateFallbackCaptions();
  }
}

function generateHashtags(prompt: string): string[] {
  const category = detectCategory(prompt);

  const hashtags: Record<string, string[]> = {
    'clinic': ['#DentalCare', '#HealthTips', '#DoctorAdvice', '#Wellness', '#Healthcare', '#India', '#LocalBusiness'],
    'restaurant': ['#Foodie', '#IndianFood', '#Restaurant', '#FoodLover', '#Yummy', '#LocalEats'],
    'retail': ['#Shopping', '#Deals', '#IndianFashion', '#ShopLocal', '#Offers'],
    'default': ['#LocalBusiness', '#India', '#SupportLocal', '#SmallBusiness', '#Entrepreneur']
  };

  return hashtags[category] || hashtags['default'];
}

function detectCategory(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('clinic') || lower.includes('doctor') || lower.includes('dental') || lower.includes('hospital')) {
    return 'clinic';
  }
  if (lower.includes('restaurant') || lower.includes('food') || lower.includes('cafe')) {
    return 'restaurant';
  }
  if (lower.includes('shop') || lower.includes('store') || lower.includes('retail')) {
    return 'retail';
  }
  return 'default';
}

function generateCanvaInstructions(script: string, template: { url: string; name: string; duration: string }): string {
  return `
🎬 HOW TO CREATE YOUR VIDEO IN CANVA (FREE)

⏱️ Time needed: 10 minutes
💰 Cost: ₹0
📱 Result: Professional ${template.duration} video

STEP-BY-STEP:

1️⃣ OPEN TEMPLATE
   Link: ${template.url}
   Template: ${template.name}

2️⃣ REPLACE TEXT
   Copy this script into the template:
   
   ---
   ${script}
   ---

3️⃣ ADD YOUR MEDIA
   - Upload 3-5 photos of your business
   - Replace template images with your own
   - Keep template animations/effects

4️⃣ CUSTOMIZE COLORS
   - Match your brand colors
   - Keep contrast high for readability

5️⃣ DOWNLOAD
   - Format: MP4 Video
   - Quality: 1080p (recommended)
   
6️⃣ UPLOAD BACK
   - Return to this platform
   - Upload your finished video
   - We'll schedule it for you!

💡 PRO TIPS:
- Use high-quality photos (bright lighting)
- Keep text readable (contrast with background)
- Add background music from Canva's free library
- Preview before downloading

Need help? Contact support!
`;
}

function generateFallbackScript(): string {
  return `HOOK: Namaste! Aaj main aapke liye khaas information lekar aaya hoon...

BODY: Hamari clinic mein aapko best care milta hai. Modern equipment, experienced doctors, aur affordable prices. Aapka health hamara priority hai!

CTA: Aaj hi appointment book karein! Call karein ya WhatsApp karein.`;
}

function generateFallbackCaptions(): string[] {
  return [
    '✨ New update from our business! Check it out 👆 #LocalBusiness #India',
    '🌟 Exciting news! We\'re here to serve you better. Swipe to know more 👉 #SupportLocal',
    '💫 Something special for our customers! Don\'t miss out 🎉 #IndianBusiness #Offers'
  ];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
