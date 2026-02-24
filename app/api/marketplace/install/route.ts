import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { canAccessBusiness, getCurrentUser } from '@/app/lib/auth/session';

const installSchema = z.object({
  templateSlug: z.string().min(2),
  businessId: z.string().uuid(),
  purchaseId: z.string().uuid().optional(),
  configuration: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = installSchema.parse(await request.json());
    if (!(await canAccessBusiness(user.id, payload.businessId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = createAdminClient();

    const { data: template, error: templateError } = await supabase
      .from('agent_templates')
      .select('*')
      .eq('slug', payload.templateSlug)
      .single();

    if (templateError || !template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
    if (template.status !== 'published' && template.creator_id !== user.id) {
      return NextResponse.json({ error: 'Template is not available for install' }, { status: 400 });
    }

    const templatePrice = template.price_inr ?? 0;
    if (templatePrice > 0) {
      if (!payload.purchaseId) {
        return NextResponse.json(
          { error: 'purchaseId is required for paid templates' },
          { status: 402 }
        );
      }

      const { data: purchase, error: purchaseError } = await supabase
        .from('marketplace_purchases')
        .select('id,status,template_id,buyer_id')
        .eq('id', payload.purchaseId)
        .maybeSingle();

      if (purchaseError) {
        return NextResponse.json({ error: purchaseError.message }, { status: 500 });
      }

      if (
        !purchase ||
        purchase.template_id !== template.id ||
        purchase.buyer_id !== user.id ||
        purchase.status !== 'completed'
      ) {
        return NextResponse.json(
          { error: 'Purchase is not completed for this template' },
          { status: 402 }
        );
      }
    }

    const mergedConfig = {
      ...(template.configuration ?? {}),
      ...(payload.configuration ?? {}),
      template_id: template.id,
    };

    const configuredName =
      typeof payload.configuration?.agentName === 'string' &&
      payload.configuration.agentName.trim().length > 0
        ? payload.configuration.agentName.trim()
        : template.name;

    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert({
        business_id: payload.businessId,
        name: configuredName,
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
