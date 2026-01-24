'use server';

import nodemailer from 'nodemailer';

interface ContactFormData {
    name: string;
    contact: string;
    message: string;
    method: 'call' | 'message' | 'email';
    context?: string;
}

export async function sendContactEmail(formData: ContactFormData) {
    // 1. Validate Input (Basic)
    if (!formData.name || !formData.contact) {
        return { success: false, error: 'Name and contact are required.' };
    }

    // 2. Configure Transporter using Environment Variables
    // The user needs to set: EMAIL_USER (their gmail) and EMAIL_PASS (app password) in .env
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        // 3. Email Content
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: process.env.EMAIL_USER, // Send to self (the admin)
            subject: `New Inquiry via ${formData.method}: ${formData.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #6366f1;">New Lead from Smile Fotilo Website</h2>
                    <p><strong>Context:</strong> ${formData.context || 'General'}</p>
                    <hr />
                    <p><strong>Name:</strong> ${formData.name}</p>
                    <p><strong>Contact Info:</strong> ${formData.contact}</p>
                    <p><strong>Preferred Method:</strong> ${formData.method}</p>
                    <br />
                    ${formData.message ? `<p><strong>Message:</strong><br/>${formData.message}</p>` : ''}
                    <hr />
                    <p style="font-size: 12px; color: #888;">Sent from Smile Fotilo Web App</p>
                </div>
            `,
        };

        // 4. Send Email
        // If credentials are not set, this will throw/log an error in dev, which we catch.
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("EMAIL_USER or EMAIL_PASS not set. Simulating success for demo.");
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true, message: 'Simulated success (Env not set)' };
        }

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully!' };

    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: 'Failed to send email. Please try again later.' };
    }
}
