'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const COMPANY_EMAIL = 'ashrafkamal1458@gmail.com';
const FROM_EMAIL = 'onboarding@resend.dev'; // Use your verified domain email

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

// Send email from contact form
export async function sendContactEmail(data: ContactFormData) {
    try {
        // Send to company
        await resend.emails.send({
            from: FROM_EMAIL,
            to: COMPANY_EMAIL,
            subject: `🎯 New Project Inquiry: ${data.service}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
                    <h1 style="color: #a78bfa; margin-bottom: 24px;">New Project Inquiry</h1>
                    
                    <div style="background: rgba(139, 92, 246, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h2 style="color: #c4b5fd; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase;">Client Details</h2>
                        <p style="margin: 4px 0;"><strong>Name:</strong> ${data.name}</p>
                        <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #818cf8;">${data.email}</a></p>
                    </div>
                    
                    <div style="background: rgba(59, 130, 246, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h2 style="color: #93c5fd; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase;">Project Info</h2>
                        <p style="margin: 4px 0;"><strong>Service:</strong> ${data.service}</p>
                        <p style="margin: 4px 0;"><strong>Budget:</strong> ${data.budget}</p>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px;">
                        <h2 style="color: #cbd5e1; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase;">Message</h2>
                        <p style="margin: 0; line-height: 1.6;">${data.message.replace(/\n/g, '<br>')}</p>
                    </div>
                    
                    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="color: #64748b; font-size: 12px; margin: 0;">Sent from Smile Fotilo Contact Form</p>
                    </div>
                </div>
            `,
        });

        // Send confirmation to user
        await resend.emails.send({
            from: FROM_EMAIL,
            to: data.email,
            subject: `We received your inquiry! - Smile Fotilo`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
                    <h1 style="color: #a78bfa; margin-bottom: 8px;">Thank you, ${data.name}! 🙏</h1>
                    <p style="color: #94a3b8; margin-bottom: 24px;">We've received your project inquiry and will get back to you within 24 hours.</p>
                    
                    <div style="background: rgba(139, 92, 246, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h2 style="color: #c4b5fd; font-size: 14px; margin: 0 0 12px 0; text-transform: uppercase;">Your Inquiry Summary</h2>
                        <p style="margin: 4px 0;"><strong>Service:</strong> ${data.service}</p>
                        <p style="margin: 4px 0;"><strong>Budget:</strong> ${data.budget}</p>
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

        return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, message: 'Failed to send email. Please try again.' };
    }
}

// Send email from chatbot lead
export async function sendChatLeadEmail(data: ChatLeadData) {
    try {
        // Send to company
        await resend.emails.send({
            from: FROM_EMAIL,
            to: COMPANY_EMAIL,
            subject: `💬 New Chat Lead: ${data.name || 'Anonymous'}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
                    <h1 style="color: #6ee7ff; margin-bottom: 24px;">🤖 New Lead from Echo Chatbot</h1>
                    
                    <div style="background: rgba(110, 231, 255, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h2 style="color: #6ee7ff; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase;">Lead Details</h2>
                        ${data.name ? `<p style="margin: 4px 0;"><strong>Name:</strong> ${data.name}</p>` : ''}
                        <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #818cf8;">${data.email}</a></p>
                        ${data.phone ? `<p style="margin: 4px 0;"><strong>Phone:</strong> ${data.phone}</p>` : ''}
                        ${data.service ? `<p style="margin: 4px 0;"><strong>Interest:</strong> ${data.service}</p>` : ''}
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px;">
                        <h2 style="color: #cbd5e1; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase;">Conversation Summary</h2>
                        <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${data.conversationSummary}</p>
                    </div>
                    
                    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="color: #64748b; font-size: 12px; margin: 0;">Captured by Echo AI Assistant</p>
                    </div>
                </div>
            `,
        });

        // Send confirmation to user
        await resend.emails.send({
            from: FROM_EMAIL,
            to: data.email,
            subject: `Thanks for chatting with us! - Smile Fotilo`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
                    <h1 style="color: #6ee7ff; margin-bottom: 8px;">Thanks for reaching out! 🙌</h1>
                    <p style="color: #94a3b8; margin-bottom: 24px;">We loved chatting with you via Echo, our AI assistant. A team member will follow up with you shortly!</p>
                    
                    <div style="background: rgba(139, 92, 246, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h2 style="color: #c4b5fd; font-size: 14px; margin: 0 0 12px 0; text-transform: uppercase;">What's Next?</h2>
                        <p style="margin: 0; line-height: 1.6;">One of our team members will reach out to you within 24 hours to discuss your project in detail.</p>
                    </div>
                    
                    <p style="color: #94a3b8;">Have questions? Just reply to this email or visit <a href="https://smilefotilo.com" style="color: #818cf8;">smilefotilo.com</a></p>
                    
                    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="color: #a78bfa; font-weight: bold; margin: 0;">Smile Fotilo</p>
                        <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Premium Digital Agency</p>
                    </div>
                </div>
            `,
        });

        return { success: true };
    } catch (error) {
        console.error('Chat lead email error:', error);
        return { success: false };
    }
}
