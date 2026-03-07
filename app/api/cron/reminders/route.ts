import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { sendWhatsAppTemplate } from '@/app/lib/whatsapp/client';

type ReminderRow = {
  id: string;
  customer_name: string;
  customer_phone: string;
  appointment_date: string;
  appointment_time: string;
  businesses:
    | {
        whatsapp_number: string | null;
        name: string;
      }
    | Array<{
        whatsapp_number: string | null;
        name: string;
      }>
    | null;
};

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 503 });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from('appointments')
      .select('id,customer_name,customer_phone,appointment_date,appointment_time,businesses(whatsapp_number,name)')
      .eq('status', 'confirmed')
      .eq('reminder_sent_24h', false)
      .eq('appointment_date', tomorrow)
      .limit(500);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const appointments = (data ?? []) as ReminderRow[];
    let sent = 0;

    for (const apt of appointments) {
      const business = Array.isArray(apt.businesses) ? apt.businesses[0] : apt.businesses;
      if (!business?.whatsapp_number) continue;

      try {
        await sendWhatsAppTemplate(
          apt.customer_phone,
          'appointment_reminder_24h',
          'hi',
          [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: apt.customer_name },
                { type: 'text', text: apt.appointment_date },
                { type: 'text', text: apt.appointment_time },
                { type: 'text', text: business.name },
              ],
            },
          ],
          business.whatsapp_number
        );

        await supabase.from('appointments').update({ reminder_sent_24h: true }).eq('id', apt.id);
        sent += 1;
      } catch {
        // continue processing other reminders
      }
    }

    return NextResponse.json({ success: true, remindersSent: sent });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
