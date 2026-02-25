'use server';

import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Primary company email
const COMPANY_EMAIL = 'ashrafkamal1458@gmail.com';
// Admin email for notifications (can be same as company or different)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || COMPANY_EMAIL;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

interface ContactFormData {
    name: string;
    email: string;
    service: string;
    budget: string;
    message: string;
}

interface ChatLeadData {
    name?: string;
    email: string;
    phone?: string;
    service?: string;
    conversationSummary: string;
}

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

const sanitize = (value: string) => escapeHtml(value.trim());

export async function sendContactEmail(data: ContactFormData) {
    if (!data.name || !data.email || !data.service || !data.budget || !data.message) {
        return { success: false, message: 'Please fill all required fields before submitting.' };
    }

    if (!resend) {
        console.error('RESEND_API_KEY is missing. Contact form email cannot be sent.');
        return {
            success: false,
            message: 'Email service is not configured yet. Please try again later.',
        };
    }

    const safeData = {
        name: sanitize(data.name),
        email: sanitize(data.email),
        service: sanitize(data.service),
        budget: sanitize(data.budget),
        message: sanitize(data.message),
    };

    try {
        // Email 1: Send to company/primary contact
        await resend.emails.send({
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

                    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="color: #64748b; font-size: 12px; margin: 0;">Sent from Smile Fotilo Contact Form</p>
                    </div>
                </div>
            `,
        });

        // Email 2: Send confirmation to customer
        await resend.emails.send({
            from: FROM_EMAIL,
            to: safeData.email,
            subject: 'We received your inquiry - Smile Fotilo',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
                    <h1 style="color: #a78bfa; margin-bottom: 8px;">Thank you, ${safeData.name}!</h1>
                    <p style="color: #94a3b8; margin-bottom: 24px;">We received your project inquiry and will get back to you within 24 hours.</p>

                    <div style="background: rgba(139, 92, 246, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h2 style="color: #c4b5fd; font-size: 14px; margin: 0 0 12px 0; text-transform: uppercase;">Your Inquiry Summary</h2>
                        <p style="margin: 4px 0;"><strong>Service:</strong> ${safeData.service}</p>
                        <p style="margin: 4px 0;"><strong>Budget:</strong> ${safeData.budget}</p>
                    </div>

                    <p style="color: #94a3b8;">In the meantime, feel free to:</p>
                    <ul style="color: #94a3b8; padding-left: 20px;">
                        <li>Check out our <a href="https://smilefotilo.com/work" style="color: #818cf8;">portfolio</a></li>
                        <li>Follow us on <a href="https://instagram.com/ashrafkamal14" style="color: #818cf8;">Instagram</a></li>
                    </ul>

                    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="color: #a78bfa; font-weight: bold; margin: 0;">Smile Fotilo</p>
                        <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Premium Digital Agency</p>
                    </div>
                </div>
            `,
        });

        // Email 3: Send to admin (if different from company email)
        if (ADMIN_EMAIL !== COMPANY_EMAIL) {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: ADMIN_EMAIL,
                subject: `[Admin Copy] New Project Inquiry: ${safeData.service}`,
                html: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
                        <h1 style="color: #fbbf24; margin-bottom: 24px;">Admin Alert: New Inquiry</h1>

                        <div style="background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                            <h2 style="color: #fbbf24; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase;">Quick Summary</h2>
                            <p style="margin: 4px 0;"><strong>Client:</strong> ${safeData.name}</p>
                            <p style="margin: 4px 0;"><strong>Service:</strong> ${safeData.service}</p>
                            <p style="margin: 4px 0;"><strong>Budget:</strong> ${safeData.budget}</p>
                            <p style="margin: 4px 0;"><strong>Time:</strong> ${new Date().toLocaleString('en-IN')}</p>
                        </div>

                        <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px;">
                            <p style="margin: 0; color: #94a3b8;">Primary notification sent to: ${COMPANY_EMAIL}</p>
                            <p style="margin: 8px 0 0 0; color: #94a3b8;">Customer confirmation sent to: ${safeData.email}</p>
                        </div>

                        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                            <p style="color: #64748b; font-size: 12px; margin: 0;">Admin Copy | Smile Fotilo Notification System</p>
                        </div>
                    </div>
                `,
            });
        }

        return { success: true, message: 'Email sent successfully.' };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, message: 'Failed to send email. Please try again.' };
    }
}

export async function sendChatLeadEmail(data: ChatLeadData) {
    if (!data.email || !data.conversationSummary) {
        return { success: false, message: 'Missing lead data.' };
    }

    if (!resend) {
        console.error('RESEND_API_KEY is missing. Chat lead email cannot be sent.');
        return { success: false, message: 'Email service is not configured yet.' };
    }

    const safeData = {
        name: data.name ? sanitize(data.name) : '',
        email: sanitize(data.email),
        phone: data.phone ? sanitize(data.phone) : '',
        service: data.service ? sanitize(data.service) : '',
        conversationSummary: sanitize(data.conversationSummary),
    };

    try {
        // Email 1: Send to company/primary contact
        await resend.emails.send({
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

                    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="color: #64748b; font-size: 12px; margin: 0;">Captured by Echo AI Assistant</p>
                    </div>
                </div>
            `,
        });

        // Email 2: Send confirmation to customer
        await resend.emails.send({
            from: FROM_EMAIL,
            to: safeData.email,
            subject: 'Thanks for chatting with us - Smile Fotilo',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
                    <h1 style="color: #6ee7ff; margin-bottom: 8px;">Thanks for reaching out!</h1>
                    <p style="color: #94a3b8; margin-bottom: 24px;">We loved chatting with you via Echo. A team member will follow up with you shortly.</p>

                    <div style="background: rgba(139, 92, 246, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h2 style="color: #c4b5fd; font-size: 14px; margin: 0 0 12px 0; text-transform: uppercase;">What Happens Next</h2>
                        <p style="margin: 0; line-height: 1.6;">A team member will reach out within 24 hours to discuss your project in detail.</p>
                    </div>

                    <p style="color: #94a3b8;">Have questions? Reply to this email or visit <a href="https://smilefotilo.com" style="color: #818cf8;">smilefotilo.com</a></p>

                    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="color: #a78bfa; font-weight: bold; margin: 0;">Smile Fotilo</p>
                        <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Premium Digital Agency</p>
                    </div>
                </div>
            `,
        });

        // Email 3: Send to admin (if different from company email)
        if (ADMIN_EMAIL !== COMPANY_EMAIL) {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: ADMIN_EMAIL,
                subject: `[Admin Copy] New Chat Lead: ${safeData.name || 'Anonymous'}`,
                html: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
                        <h1 style="color: #fbbf24; margin-bottom: 24px;">Admin Alert: Chat Lead</h1>

                        <div style="background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                            <h2 style="color: #fbbf24; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase;">Quick Summary</h2>
                            ${safeData.name ? `<p style="margin: 4px 0;"><strong>Client:</strong> ${safeData.name}</p>` : ''}
                            <p style="margin: 4px 0;"><strong>Email:</strong> ${safeData.email}</p>
                            ${safeData.service ? `<p style="margin: 4px 0;"><strong>Interest:</strong> ${safeData.service}</p>` : ''}
                            <p style="margin: 4px 0;"><strong>Time:</strong> ${new Date().toLocaleString('en-IN')}</p>
                        </div>

                        <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px;">
                            <p style="margin: 0; color: #94a3b8;">Primary notification sent to: ${COMPANY_EMAIL}</p>
                            <p style="margin: 8px 0 0 0; color: #94a3b8;">Customer confirmation sent to: ${safeData.email}</p>
                        </div>

                        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                            <p style="color: #64748b; font-size: 12px; margin: 0;">Admin Copy | Echo AI Lead System</p>
                        </div>
                    </div>
                `,
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Chat lead email error:', error);
        return { success: false, message: 'Failed to send lead email.' };
    }
}
