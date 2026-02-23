import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/app/lib/supabase/admin';

const createAgentSchema = z.object({
  businessId: z.string().uuid(),
  name: z.string().min(2),
  type: z.enum(['receptionist', 'followup', 'review_manager', 'content_creator', 'custom']).default('receptionist'),
  configuration: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const businessId = request.nextUrl.searchParams.get('businessId');
    const supabase = createAdminClient();

    let query = supabase.from('agents').select('*').order('created_at', { ascending: false });
    if (businessId) query = query.eq('business_id', businessId);

    const { data, error } = await query.limit(100);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data: data ?? [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = createAgentSchema.parse(await request.json());
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('agents')
      .insert({
        business_id: payload.businessId,
        name: payload.name,
        type: payload.type,
        configuration: payload.configuration ?? {},
      })
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}