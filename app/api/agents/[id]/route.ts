import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { canAccessBusiness, getCurrentUser } from '@/app/lib/auth/session';

const updateAgentSchema = z
  .object({
    name: z.string().min(2).optional(),
    type: z
      .enum(['receptionist', 'followup', 'review_manager', 'content_creator', 'custom'])
      .optional(),
    isActive: z.boolean().optional(),
    configuration: z.record(z.string(), z.unknown()).optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field is required for update',
  });

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('agents')
      .select('*, knowledge_documents(id,title,document_type,created_at)')
      .eq('id', id)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    if (!data.business_id || !(await canAccessBusiness(user.id, data.business_id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = updateAgentSchema.parse(await request.json());
    const supabase = createAdminClient();

    const { data: existing, error: existingError } = await supabase
      .from('agents')
      .select('business_id')
      .eq('id', id)
      .maybeSingle();
    if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });
    if (!existing) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    if (!existing.business_id || !(await canAccessBusiness(user.id, existing.business_id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatePayload: Record<string, unknown> = {};
    if (typeof payload.name !== 'undefined') updatePayload.name = payload.name;
    if (typeof payload.type !== 'undefined') updatePayload.type = payload.type;
    if (typeof payload.isActive !== 'undefined') updatePayload.is_active = payload.isActive;
    if (typeof payload.configuration !== 'undefined') {
      updatePayload.configuration = payload.configuration;
    }

    const { data, error } = await supabase
      .from('agents')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

    return NextResponse.json({ data });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createAdminClient();

    const { data: existing, error: existingError } = await supabase
      .from('agents')
      .select('business_id')
      .eq('id', id)
      .maybeSingle();
    if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });
    if (!existing) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    if (!existing.business_id || !(await canAccessBusiness(user.id, existing.business_id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await supabase.from('agents').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
