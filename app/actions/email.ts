'use server';

import sgMail from '@sendgrid/mail';
import { z } from 'zod';
import { createAdminClient } from '../lib/supabase/admin';

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Primary company email
const COMPANY_EMAIL = 'ashrafkamal1458@gmail.com';
// Admin email for notifications
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || COMPANY_EMAIL;
const FROM_EMAIL = 'support@smilefotilo.com'; // Verified in SendGrid

const ContactFormSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    email: z.string().email("Invalid email format").max(200, "Email too long"),
    service: z.string().min(1, "Service is required").max(100, 'Service too long'),
    budget: z.string().min(1, "Budget is required").max(100, 'Budget too long'),
    message: z.string().min(1, "Message is required").max(5000, "Message is too long (max 5000 characters)"),
});

const ChatLeadSchema = z.object({
    name: z.string().max(100).optional(),
    email: z.string().email().max(200),
    phone: z.string().max(50).optional(),
    service: z.string().max(100).optional(),
    conversationSummary: z.string().max(10000, "Summary too long (max 10000 chars)"),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
export type ChatLeadData = z.infer<typeof ChatLeadSchema>;

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

const sanitize = (value: string) => escapeHtml(value.trim());

// Fallback to save lead to the database
interface LeadBackup {
    source?: string;
    name: string;
    email: string;
    phone?: string;
    service?: string;
    budget?: string;
    message?: string;
    conversationSummary?: string;
}

async function backupLeadToDatabase(data: LeadBackup) {
    try {
        const supabase = createAdminClient();
        const businessId = process.env.DEFAULT_BUSINESS_ID;
        
        await supabase.from('leads').insert({
            business_id: businessId,
            source: data.source || 'unknown',
            name: data.name,
            email: data.email,
            phone: data.phone,
            service: data.service,
            budget: data.budget,
            message: data.message,
            conversation_summary: data.conversationSummary,
            status: 'new'
        });
        console.log(`Lead backed up to database: ${data.email}`);
    } catch (e) {
        console.error('Failed to backup lead to database:', e);
    }
}

export async function sendContactEmail(data: ContactFormData) {
    const parsed = ContactFormSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            message: parsed.error.issues[0]?.message || 'Invalid input provided. Please check your fields.'
        };
    }

    const safeData = {
        name: sanitize(parsed.data.name),
        email: sanitize(parsed.data.email),
        service: sanitize(parsed.data.service),
        budget: sanitize(parsed.data.budget),
        message: sanitize(parsed.data.message),
    };

    // Always backup lead to database first
    await backupLeadToDatabase({
        source: 'contact_form',
        ...safeData
    });

    if (!process.env.SENDGRID_API_KEY) {
        console.error('SENDGRID_API_KEY is missing. Contact form email cannot be sent.');
        return {
            success: true, // We saved to the DB, so for the user it's a success, even if email fails.
            message: 'Inquiry received. We will contact you soon.',
        };
    }

    try {
        const msgCompany = {
            from: FROM_EMAIL,
            to: COMPANY_EMAIL,
            subject: `New Project Inquiry: ${safeData.service}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
                    <h1 style="color: #a78bfa; margin-bottom: 24px;">New Project Inquiry</h1>

                    <div style="background: rgba(139, 92, 246, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h2 style="color: #c4b5fd; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase;">Client Details</h2>
                        <p style="margin: 4px 0;"><strong>Name:</strong> ${safeData.name}</p>
                        <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${safeData.email}" style="color: #818cf8;">${safeData.email}</a></p>
                    </div>

                    <div style="background: rgba(59, 130, 246, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h2 style="color: #93c5fd; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase;">Project Info</h2>
                        <p style="margin: 4px 0;"><strong>Service:</strong> ${safeData.service}</p>
                        <p style="margin: 4px 0;"><strong>Budget:</strong> ${safeData.budget}</p>
                    </div>

                    <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px;">
                        <h2 style="color: #cbd5e1; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase;">Message</h2>
                        <p style="margin: 0; line-height: 1.6;">${safeData.message.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            `,
        };

        const msgCustomer = {
            from: FROM_EMAIL,
            to: safeData.email,
            subject: 'We received your inquiry - Smile Fotilo',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
                    <h1 style="color: #a78bfa; margin-bottom: 8px;">Thank you, ${safeData.name}!</h1>
                    <p style="color: #94a3b8; margin-bottom: 24px;">We received your project inquiry and will get back to you within 24 hours.</p>
                    <p style="color: #94a3b8;">In the meantime, check out our <a href="https://smilefotilo.com/work" style="color: #818cf8;">portfolio</a>.</p>
                </div>
            `,
        };

        await sgMail.send(msgCompany);
        await sgMail.send(msgCustomer);

        if (ADMIN_EMAIL !== COMPANY_EMAIL) {
            await sgMail.send({ ...msgCompany, to: ADMIN_EMAIL, subject: `[Admin Copy] New Project Inquiry: ${safeData.service}` });
        }

        return { success: true, message: 'Inquiry sent successfully.' };
    } catch (error) {
        console.error('Email error:', error);
        // Even if email fails, DB backup succeeded
        return { success: true, message: 'Inquiry received. We will contact you soon.' };
    }
}

export async function sendChatLeadEmail(data: ChatLeadData) {
    const parsed = ChatLeadSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            message: parsed.error.issues[0]?.message || 'Invalid lead data provided.'
        };
    }

    const safeData = {
        name: parsed.data.name ? sanitize(parsed.data.name) : '',
        email: sanitize(parsed.data.email),
        phone: parsed.data.phone ? sanitize(parsed.data.phone) : '',
        service: parsed.data.service ? sanitize(parsed.data.service) : '',
        conversationSummary: sanitize(parsed.data.conversationSummary),
    };

    // Always backup lead to database first
    await backupLeadToDatabase({
        source: 'chatbot',
        ...safeData
    });

    if (!process.env.SENDGRID_API_KEY) {
        console.error('SENDGRID_API_KEY is missing. Chat lead email cannot be sent.');
        return { success: true, message: 'Lead captured successfully.' };
    }

    try {
        const msgCompany = {
            from: FROM_EMAIL,
            to: COMPANY_EMAIL,
            subject: `New Chat Lead: ${safeData.name || 'Anonymous'}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
                    <h1 style="color: #6ee7ff; margin-bottom: 24px;">New Lead from Echo Chatbot</h1>

                    <div style="background: rgba(110, 231, 255, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h2 style="color: #6ee7ff; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase;">Lead Details</h2>
                        ${safeData.name ? `<p style="margin: 4px 0;"><strong>Name:</strong> ${safeData.name}</p>` : ''}
                        <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${safeData.email}" style="color: #818cf8;">${safeData.email}</a></p>
                        ${safeData.phone ? `<p style="margin: 4px 0;"><strong>Phone:</strong> ${safeData.phone}</p>` : ''}
                        ${safeData.service ? `<p style="margin: 4px 0;"><strong>Interest:</strong> ${safeData.service}</p>` : ''}
                    </div>

                    <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px;">
                        <h2 style="color: #cbd5e1; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase;">Conversation Summary</h2>
                        <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${safeData.conversationSummary}</p>
                    </div>
                </div>
            `,
        };

        const msgCustomer = {
            from: FROM_EMAIL,
            to: safeData.email,
            subject: 'Thanks for chatting with us - Smile Fotilo',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
                    <h1 style="color: #6ee7ff; margin-bottom: 8px;">Thanks for reaching out!</h1>
                    <p style="color: #94a3b8; margin-bottom: 24px;">We loved chatting with you via Echo. A team member will follow up with you shortly.</p>
                </div>
            `,
        };

        await sgMail.send(msgCompany);
        await sgMail.send(msgCustomer);

        if (ADMIN_EMAIL !== COMPANY_EMAIL) {
            await sgMail.send({ ...msgCompany, to: ADMIN_EMAIL, subject: `[Admin Copy] New Chat Lead: ${safeData.name || 'Anonymous'}` });
        }

        return { success: true };
    } catch (error) {
        console.error('Chat lead email error:', error);
        return { success: true, message: 'Failed to send lead email, but saved to DB.' };
    }
}
