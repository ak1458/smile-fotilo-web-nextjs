'use client';

import { useEffect } from 'react';

/**
 * Site-wide conversion tracking via event delegation.
 *
 * GA4 was loaded but only sent page_view, so every country showed 0 conversions
 * even though WhatsApp/phone/email/form are the only lead channels. This attaches
 * one capture-phase listener that fires GA4 + GTM events on the real lead actions,
 * without touching the ~20 components that render those CTAs.
 *
 * `generate_lead` is a GA4 recommended event — mark it as a Key Event in GA4 so it
 * counts as a conversion. `form_submit` is sent separately (lower intent / noisier).
 */

type LeadParams = {
    method: string;
    location: string;
    label?: string;
};

function fire(event: string, params: Record<string, unknown>) {
    const w = window as unknown as {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: Record<string, unknown>[];
    };
    if (typeof w.gtag === 'function') {
        w.gtag('event', event, params);
    }
    // Also push to dataLayer so GTM-based tags/triggers can react.
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event, ...params });
}

function trackLead(params: LeadParams) {
    fire('generate_lead', { currency: 'USD', value: 1, ...params });
}

export function ConversionTracking() {
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            const anchor = target?.closest?.('a') as HTMLAnchorElement | null;
            if (!anchor) return;
            const href = (anchor.getAttribute('href') || '').toLowerCase();
            if (!href) return;

            const page = window.location.pathname;
            const label = (anchor.textContent || '').trim().slice(0, 80);

            if (href.includes('wa.me') || href.includes('api.whatsapp.com') || href.includes('web.whatsapp.com')) {
                trackLead({ method: 'whatsapp', location: page, label });
            } else if (href.startsWith('tel:')) {
                trackLead({ method: 'phone', location: page, label });
            } else if (href.startsWith('mailto:')) {
                trackLead({ method: 'email', location: page, label });
            }
        };

        const onSubmit = (e: SubmitEvent) => {
            const form = e.target as HTMLFormElement | null;
            if (!form || form.tagName !== 'FORM') return;
            const id = form.getAttribute('id') || form.getAttribute('name') || '';
            const page = window.location.pathname;

            // Treat contact/quote/lead/booking forms as conversions; everything else
            // (search, audit URL box, newsletter) just logs a generic form_submit.
            const isLeadForm = /contact|quote|lead|book|enquir|inquir|consult|hire|project|get-started|signup|sign-up/i.test(
                id + ' ' + (form.getAttribute('action') || '') + ' ' + (form.className || '')
            );
            if (isLeadForm) {
                trackLead({ method: 'form', location: page, label: id || 'lead_form' });
            } else {
                fire('form_submit', { location: page, form_id: id || 'unknown' });
            }
        };

        document.addEventListener('click', onClick, true);
        document.addEventListener('submit', onSubmit, true);
        return () => {
            document.removeEventListener('click', onClick, true);
            document.removeEventListener('submit', onSubmit, true);
        };
    }, []);

    return null;
}
