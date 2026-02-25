import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/app/lib/ai/smart-router';
import { rateLimitMiddleware, rateLimits } from '@/app/lib/security/rate-limit';
import { guardPromptInput } from '@/app/lib/security/prompt-guard';
import { withTimeout, timeouts } from '@/app/lib/security/api-timeout';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = await rateLimitMiddleware(request, rateLimits.publicApi);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const body = await request.json();
    const { businessName, industry, platforms = ['Instagram', 'Facebook'], tone = 'Professional', goals = '' } = body;

    if (!businessName || !industry) {
      return NextResponse.json(
        { error: 'Business name and industry are required' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    // Guard against prompt injection
    const nameGuard = guardPromptInput(businessName, { maxLength: 100 });
    const industryGuard = guardPromptInput(industry, { maxLength: 50 });
    const goalsGuard = guardPromptInput(goals, { maxLength: 200 });

    if (!nameGuard.safe || !industryGuard.safe || !goalsGuard.safe) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    // Generate weekly theme
    const themePrompt = `Suggest a catchy weekly content theme for ${nameGuard.sanitized} (${industryGuard.sanitized}).
Tone: ${tone}. ${goalsGuard.sanitized ? `Goals: ${goalsGuard.sanitized}` : ''}
Return just the theme name (2-4 words) and a brief description (1 sentence).`;

    const themeResponse = await withTimeout(
      generateAIResponse(themePrompt, { complexity: 'simple', maxTokens: 100 }),
      { timeoutMs: timeouts.fastAI, errorMessage: 'Theme generation timeout' }
    );

    const weeklyTheme = themeResponse.replace(/\n/g, ' — ').trim() || 'Weekly Spotlight — Showcasing our best this week';

    // Generate content pillars
    const pillarsPrompt = `Generate 4 content pillars (main topics) for ${nameGuard.sanitized}'s social media (${industryGuard.sanitized}).
These are broad content categories. Return as a numbered list, 2-3 words each.`;

    const pillarsResponse = await withTimeout(
      generateAIResponse(pillarsPrompt, { complexity: 'simple', maxTokens: 150 }),
      { timeoutMs: timeouts.fastAI, errorMessage: 'Pillars generation timeout' }
    );

    const contentPillars = pillarsResponse
      .split('\n')
      .map(p => p.replace(/^\d+\.\s*/, '').trim())
      .filter(p => p.length > 0)
      .slice(0, 4);

    const defaultPillars = ['Educational', 'Behind the Scenes', 'Customer Stories', 'Product/Service Features'];
    const finalPillars = contentPillars.length >= 3 ? contentPillars : defaultPillars;

    // Generate daily content for 7 days
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayThemes: Record<string, string> = {
      Monday: 'Motivation / Start of Week',
      Tuesday: 'Tips / Education',
      Wednesday: 'Behind the Scenes',
      Thursday: 'Throwback / Story',
      Friday: 'Fun / Weekend Vibes',
      Saturday: 'Lifestyle / Community',
      Sunday: 'Prep / Planning',
    };

    const daysContent = [];

    for (const day of days) {
      const dayPrompt = `Create 1 social media post for ${day} for ${nameGuard.sanitized} (${industryGuard.sanitized}).
Theme: ${dayThemes[day]}
Platform: ${platforms[0]}
Tone: ${tone}

Return in this exact format:
DAY: ${day}
THEME: [2-3 words describing the day's focus]
PLATFORM: ${platforms.join(', ')}
TYPE: [e.g., Carousel, Reel, Story, Static Post]
CAPTION: [Engaging caption with relevant hashtags]
BEST_TIME: [e.g., 9:00 AM, 12:00 PM, 6:00 PM]
TIP: [1 sentence tip for this post]`;

      try {
        const dayResponse = await withTimeout(
          generateAIResponse(dayPrompt, { complexity: 'simple', maxTokens: 300 }),
          { timeoutMs: timeouts.fastAI, errorMessage: `${day} content timeout` }
        );

        // Parse the response
        const themeMatch = dayResponse.match(/THEME:\s*(.+)/)?.[1]?.trim() || dayThemes[day];
        const typeMatch = dayResponse.match(/TYPE:\s*(.+)/)?.[1]?.trim() || 'Static Post';
        const captionMatch = dayResponse.match(/CAPTION:([^]+?)(?=BEST_TIME:|$)/)?.[1]?.trim() || 
          `Check out what we have going on this ${day}! #${industryGuard.sanitized.replace(/\s+/g, '')} #${nameGuard.sanitized.replace(/\s+/g, '')}`;
        const bestTimeMatch = dayResponse.match(/BEST_TIME:\s*(.+)/)?.[1]?.trim() || '12:00 PM';
        const tipMatch = dayResponse.match(/TIP:\s*(.+)/)?.[1]?.trim() || 'Post consistently for best engagement.';

        daysContent.push({
          day,
          theme: themeMatch,
          posts: platforms.map((platform: string) => ({
            platform,
            type: typeMatch,
            caption: captionMatch,
            hashtags: captionMatch.match(/#[\w]+/g) || ['#' + industryGuard.sanitized.replace(/\s+/g, ''), '#smallbusiness'],
            bestTime: bestTimeMatch,
            tip: tipMatch,
          })),
        });
      } catch {
        // Fallback content if AI fails
        daysContent.push({
          day,
          theme: dayThemes[day],
          posts: platforms.map((platform: string) => ({
            platform,
            type: 'Static Post',
            caption: `Happy ${day} from ${nameGuard.sanitized}! 🎉 ${day === 'Monday' ? 'Starting the week strong!' : day === 'Friday' ? 'Weekend vibes incoming!' : 'Thanks for being part of our journey.'} #${industryGuard.sanitized.replace(/\s+/g, '')} #${nameGuard.sanitized.replace(/\s+/g, '')} #smallbusiness`,
            hashtags: [`#${industryGuard.sanitized.replace(/\s+/g, '')}`, `#${nameGuard.sanitized.replace(/\s+/g, '')}`, '#smallbusiness'],
            bestTime: day === 'Monday' || day === 'Tuesday' || day === 'Wednesday' || day === 'Thursday' ? '12:00 PM' : '10:00 AM',
            tip: 'Engage with comments within the first hour for better reach.',
          })),
        });
      }
    }

    // Generate weekly tips
    const tipsPrompt = `Generate 3 practical social media tips for ${nameGuard.sanitized} (${industryGuard.sanitized}) to improve engagement.
Keep each tip to 1 sentence. Return as a numbered list.`;

    const tipsResponse = await withTimeout(
      generateAIResponse(tipsPrompt, { complexity: 'simple', maxTokens: 200 }),
      { timeoutMs: timeouts.fastAI, errorMessage: 'Tips generation timeout' }
    );

    const weeklyTips = tipsResponse
      .split('\n')
      .map(t => t.replace(/^\d+\.\s*/, '').trim())
      .filter(t => t.length > 0)
      .slice(0, 3);

    const finalTips = weeklyTips.length >= 2 ? weeklyTips : [
      'Post consistently at the same times each day.',
      'Reply to all comments within the first hour.',
      'Use 5-10 relevant hashtags per post.',
    ];

    return NextResponse.json(
      {
        weeklyTheme,
        days: daysContent,
        contentPillars: finalPillars,
        weeklyTips: finalTips,
        businessName: nameGuard.sanitized,
        industry: industryGuard.sanitized,
        success: true,
      },
      { headers: rateLimit.headers }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate calendar';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
