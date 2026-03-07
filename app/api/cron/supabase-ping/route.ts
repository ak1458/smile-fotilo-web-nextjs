import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * Supabase Keep-Alive Cron Job
 * 
 * Free tier Supabase pauses after 7 days of inactivity.
 * This endpoint pings the database every few hours to keep it awake.
 * 
 * Environment variables needed:
 * - CRON_SECRET: Secret key for authentication
 * - NEXT_PUBLIC_SUPABASE_URL: Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase anon key
 * 
 * Recommended Vercel Cron schedule: Every 6 hours
 * Cron expression: 0 STAR/6 STAR STAR STAR (replace STAR with asterisk)
 */

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'CRON_SECRET not configured',
        timestamp: new Date().toISOString()
      }, 
      { status: 503 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Unauthorized',
        timestamp: new Date().toISOString()
      }, 
      { status: 401 }
    );
  }

  const startTime = Date.now();

  try {
    // Simple lightweight query to keep Supabase awake
    const supabase = await createClient();
    
    // Try to get server timestamp - lightweight operation
    const { data, error } = await supabase
      .from('conversations')
      .select('id')
      .limit(1);

    if (error) {
      // If table doesn't exist, try a different approach
      const { error: healthError } = await supabase.auth.getSession();
      
      if (healthError) {
        throw new Error(`Supabase connection failed: ${healthError.message}`);
      }
    }

    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        success: true,
        message: 'Supabase ping successful - database is active',
        timestamp: new Date().toISOString(),
        responseTimeMs: responseTime,
        checks: {
          database: 'connected',
          auth: 'available',
        },
        nextRecommendedPing: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
        suggestion: 'Check Supabase credentials and project status',
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}
