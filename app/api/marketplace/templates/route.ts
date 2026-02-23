import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/app/lib/supabase/admin';

const templateSchema = z.object({
  creatorId: z.string().uuid(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  category: z.string().optional(),
  configuration: z.record(z.string(), z.unknown()).optional(),
  knowledgeBaseTemplate: z.array(z.string()).optional(),
  priceInr: z.number().int().min(0).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category');
    const supabase = createAdminClient();

    let query = supabase
      .from('agent_templates')
      .select('*')
      .in('status', ['published', 'draft'])
      .order('is_featured', { ascending: false })
      .order('downloads_count', { ascending: false });

    if (category && category !== 'all') query = query.eq('category', category);

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
    const payload = templateSchema.parse(await request.json());
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('agent_templates')
      .insert({
        creator_id: payload.creatorId,
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
        short_description: payload.shortDescription ?? null,
        category: payload.category ?? 'other',
        configuration: payload.configuration ?? {},
        knowledge_base_template: payload.knowledgeBaseTemplate ?? [],
        price_inr: payload.priceInr ?? 0,
        status: 'draft',
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