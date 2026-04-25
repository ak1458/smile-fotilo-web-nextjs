// scripts/outbound/cold-email-sender.js
// Ensure you have a 'leads.csv' file in the same directory before running.
// Install dependencies if missing: npm install nodemailer csv-parser

require('dotenv').config({ path: '../../.env.local' });
const nodemailer = require('nodemailer');
const fs = require('fs');
const csv = require('csv-parser');

// 1. Configure your SMTP settings (Using Resend, SendGrid, or Gmail App Password)
// If using Gmail, you MUST use an App Password, not your normal password.
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com', // Replace with your SMTP
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'ashrafkamal1458@gmail.com',
        pass: process.env.SMTP_PASS || 'YOUR_APP_PASSWORD_HERE' // Add to .env.local
    }
});

// 2. The Cold Email Template
const getEmailTemplate = (name, clinicName, city) => {
    return {
        subject: `Quick question about ${clinicName}'s after-hours`,
        text: `Hi ${name},

I noticed your clinic in ${city} is highly rated. Quick question: what happens when a patient calls after hours or when your receptionist is busy? Industry data shows clinics lose 20% of new patients to missed calls.

We recently deployed an AI Growth Autopilot for a client in Texas that instantly sends an SMS/WhatsApp to missed calls and books them automatically 24/7. It costs a fraction of a human receptionist.

Can I send you a 2-minute demo video of how it works?

Best,
Ashraf Kamal
Smile Fotilo
https://smilefotilo.com/services/clinic-growth-autopilot`
    };
};

// 3. Process Leads and Send
const sendOutreach = async () => {
    const leads = [];
    const csvPath = './leads.csv'; // Create this file: name,clinicName,city,email

    if (!fs.existsSync(csvPath)) {
        console.error('❌ Error: leads.csv not found! Please create a leads.csv file in scripts/outbound/ with columns: name,clinicName,city,email');
        
        // Create a dummy template file
        fs.writeFileSync(csvPath, 'name,clinicName,city,email\nDr. Smith,Texas Dental,Austin,test@example.com\n');
        console.log('✅ Created a sample leads.csv file. Fill it with your 100 leads and run this script again.');
        return;
    }

    fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
            leads.push(row);
        })
        .on('end', async () => {
            console.log(`Found ${leads.length} leads. Starting outreach campaign...`);
            
            for (let i = 0; i < leads.length; i++) {
                const lead = leads[i];
                const emailContent = getEmailTemplate(lead.name, lead.clinicName, lead.city);

                try {
                    // Safety check to avoid spamming actual people without SMTP setup
                    if(process.env.SMTP_PASS === 'YOUR_APP_PASSWORD_HERE') {
                         console.log(`[DRY RUN - ADD SMTP PASS TO .env] Would have sent to ${lead.email}`);
                         continue;
                    }

                    await transporter.sendMail({
                        from: '"Ashraf Kamal" <ashrafkamal1458@gmail.com>',
                        to: lead.email,
                        subject: emailContent.subject,
                        text: emailContent.text
                    });
                    console.log(`✅ Sent to ${lead.email}`);
                    
                    // Delay between emails to prevent getting flagged as spam (30 seconds)
                    await new Promise(resolve => setTimeout(resolve, 30000));
                } catch (error) {
                    console.error(`❌ Failed to send to ${lead.email}:`, error.message);
                }
            }
            console.log('🎉 Outreach campaign finished!');
        });
};

sendOutreach();