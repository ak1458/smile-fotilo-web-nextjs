import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/app/lib/supabase/admin';

const installSchema = z.object({
  templateSlug: z.string().min(2),
  businessId: z.string().uuid(),
  configuration: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const payload = installSchema.parse(await request.json());
    const supabase = createAdminClient();

    const { data: template, error: templateError } = await supabase
      .from('agent_templates')
      .select('*')
      .eq('slug', payload.templateSlug)
      .single();

    if (templateError || !template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const mergedConfig = {
      ...(template.configuration ?? {}),
      ...(payload.configuration ?? {}),
      template_id: template.id,
    };

    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert({
        business_id: payload.businessId,
        name: template.name,
        type: 'custom',
        configuration: mergedConfig,
      })
      .select('id')
      .single();

    if (agentError || !agent) {
      return NextResponse.json({ error: agentError?.message ?? 'Failed to install template' }, { status: 500 });
    }

    await supabase
      .from('agent_templates')
      .update({
        downloads_count: (template.downloads_count ?? 0) + 1,
      })
      .eq('id', template.id);

    return NextResponse.json({ agentId: agent.id }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}