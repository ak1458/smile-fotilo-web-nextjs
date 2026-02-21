const { google } = require('googleapis');
const path = require('path');

const KEY_FILE_PATH = path.join(__dirname, '..', 'captcha-1747281225780-8777cd95d4a8.json');

async function verifyGmbAccess() {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: ['https://www.googleapis.com/auth/business.manage'],
    });

    const accountManagement = google.mybusinessaccountmanagement('v1');

    try {
        console.log('Fetching GMB accounts...');
        const authClient = await auth.getClient();
        google.options({ auth: authClient });

        const res = await accountManagement.accounts.list();
        const accounts = res.data.accounts;

        if (accounts && accounts.length > 0) {
            console.log('Successfully connected to GMB API!');
            console.log('Accounts found:', JSON.stringify(accounts, null, 2));
        } else {
            console.log('Connected to API, but no GMB accounts were found for this service account.');
            console.log('Please ensure the service account email is added as a Manager on Google Search.');
        }
    } catch (err) {
        console.error('Error connecting to GMB API:', err.message);
        if (err.response) {
            console.error('API Response Error:', JSON.stringify(err.response.data, null, 2));
        }
    }
}

verifyGmbAccess();
