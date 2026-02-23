import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/app/lib/supabase/admin';

const createBusinessSchema = z.object({
  ownerId: z.string().uuid(),
  name: z.string().min(2),
  phone: z.string().min(7),
  category: z.string().optional(),
  whatsappNumber: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  languagePreference: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const ownerId = request.nextUrl.searchParams.get('ownerId');
    const supabase = createAdminClient();

    let query = supabase.from('businesses').select('*').order('created_at', { ascending: false });
    if (ownerId) query = query.eq('owner_id', ownerId);

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
    const payload = createBusinessSchema.parse(await request.json());
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('businesses')
      .insert({
        owner_id: payload.ownerId,
        name: payload.name,
        phone: payload.phone,
        category: payload.category ?? null,
        whatsapp_number: payload.whatsappNumber ?? null,
        email: payload.email ?? null,
        address: payload.address ?? null,
        city: payload.city ?? null,
        state: payload.state ?? null,
        language_preference: payload.languagePreference ?? 'hi-EN',
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