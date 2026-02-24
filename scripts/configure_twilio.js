const https = require('https');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const numberSid = process.env.TWILIO_NUMBER_SID;
const webhookUrl = process.env.TWILIO_VOICE_WEBHOOK_URL || 'https://smilefotilo.com/api/calls/webhook';

if (!accountSid || !authToken || !numberSid) {
    console.error('Missing Twilio env vars. Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER_SID');
    process.exit(1);
}

const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
const postData = `VoiceUrl=${encodeURIComponent(webhookUrl)}&VoiceMethod=POST`;

const options = {
    hostname: 'api.twilio.com',
    port: 443,
    path: `/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers/${numberSid}.json`,
    method: 'POST',
    headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const json = JSON.parse(data);
        if (json.sid) {
            console.log('Successfully configured Twilio number!');
            console.log('New Voice URL:', json.voice_url);
        } else {
            console.log('Failed to configure number.');
            console.log(JSON.stringify(json, null, 2));
        }
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.write(postData);
req.end();
