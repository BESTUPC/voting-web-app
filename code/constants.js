// Contains hardcoded values and data extracted from files
const fs = require('fs');

exports.PORT1 = 3000;
exports.PORT2 = 3003;
exports.MONGO_URI = 'mongodb://localhost:27017/';
exports.MONGO_DBNAME = 'votacions';
exports.MONGO_TIMEOUT = 5000;

const CERT_PATH = '/etc/letsencrypt/live/bestbarcelona.org/';
if (fs.existsSync(CERT_PATH + 'privkey.pem') &&
    fs.existsSync(CERT_PATH + 'cert.pem') &&
    fs.existsSync(CERT_PATH + 'chain.pem')) {
    exports.PRIV_KEY = fs.readFileSync(CERT_PATH + 'privkey.pem', 'utf8');
    exports.CERT = fs.readFileSync(CERT_PATH + 'cert.pem', 'utf8');
    exports.CHAIN = fs.readFileSync(CERT_PATH + 'chain.pem', 'utf8');
    exports.CERTS_AVAILABLE = true;
} else {
    exports.CERTS_AVAILABLE = false;
}

if (fs.existsSync('./googlecredentials.pswd')) {
    const GOOGLE_CREDS = JSON.parse(fs.readFileSync('./googlecredentials.pswd', 'utf8'));
    exports.CLIENT_ID = GOOGLE_CREDS['web']['client_id'];
    exports.CLIENT_SECRET = GOOGLE_CREDS['web']['client_secret'];
    exports.CALLBACK_URL = 'http://localhost:3000/auth/redirect';
    exports.CREDS_AVAILABLE = true;
} else {
    exports.CREDS_AVAILABLE = false;
}

exports.COOKIE_KEY1 = 'key1';
exports.COOKIE_KEY2 = 'key2';
