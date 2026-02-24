import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { canAccessBusiness, getCurrentUser } from '@/app/lib/auth/session';

const appointmentSchema = z.object({
  businessId: z.string().uuid(),
  customerName: z.string().min(2),
  customerPhone: z.string().min(7),
  appointmentDate: z.string().min(8),
  appointmentTime: z.string().min(3),
  serviceType: z.string().optional(),
  notes: z.string().optional(),
  conversationId: z.string().uuid().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const businessId = request.nextUrl.searchParams.get('businessId');
    if (!businessId) return NextResponse.json({ error: 'businessId is required' }, { status: 400 });

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!(await canAccessBusiness(user.id, businessId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('business_id', businessId)
      .order('appointment_date', { ascending: true })
      .limit(200);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data ?? [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = appointmentSchema.parse(await request.json());
    if (!(await canAccessBusiness(user.id, payload.businessId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        business_id: payload.businessId,
        conversation_id: payload.conversationId ?? null,
        customer_name: payload.customerName,
        customer_phone: payload.customerPhone,
        appointment_date: payload.appointmentDate,
        appointment_time: payload.appointmentTime,
        service_type: payload.serviceType ?? null,
        notes: payload.notes ?? null,
        status: 'confirmed',
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
