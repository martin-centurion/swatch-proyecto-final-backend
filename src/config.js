import dotenv from 'dotenv';

let pathEnvFile = null;

if (process.env.ENV === 'development') {
    pathEnvFile = './.env.dev'
} else if(process.env.ENV === 'production') {
    pathEnvFile = './.env.prod'
} else pathEnvFile = './.env.test'


dotenv.config({ path: pathEnvFile });

export default {
    port: process.env.PORT,
    env: process.env.ENV,
    persistence: process.env.PERSISTENCE || 'memory',
    admin: {
        name: process.env.ADMIN_NAME,
        lastname: process.env.ADMIN_LASTNAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: process.env.ADMIN_ROLE,
    },
    db: {
        mongodbUri: process.env.MONGODB_URI,
    },
    jwtSecret: process.env.JWT_SECRET,
    cookieSecret: process.env.COOKIE_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    mail: {
        service: process.env.EMAIL_SERVICE || 'gmail',
        port: process.env.EMAIL_PORT || 587,
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
    },
    twilio: {
        accountSID: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
    }
}