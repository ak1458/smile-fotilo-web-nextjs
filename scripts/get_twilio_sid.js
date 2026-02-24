const https = require('https');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !phoneNumber) {
    console.error('Missing Twilio env vars. Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER');
    process.exit(1);
}

const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

const options = {
    hostname: 'api.twilio.com',
    port: 443,
    path: `/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json?PhoneNumber=${encodeURIComponent(phoneNumber)}`,
    method: 'GET',
    headers: {
        'Authorization': `Basic ${auth}`
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const json = JSON.parse(data);
        if (json.incoming_phone_numbers && json.incoming_phone_numbers.length > 0) {
            console.log('Phone Number SID:', json.incoming_phone_numbers[0].sid);
            console.log('Current Voice URL:', json.incoming_phone_numbers[0].voice_url);
        } else {
            console.log('Number not found or no numbers in account.');
            console.log(JSON.stringify(json, null, 2));
        }
    });
});

req.on('error', (e) => {
    console.error(e);
});
req.end();
