/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not set in environment variables!');
}

export default {
  ip_address: process.env.IP_ADDRESS || '0.0.0.0',
  database_url: process.env.MONGO_URI,
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_expire_in: process.env.JWT_EXPIRE_IN,
  },
  twilio: {
    sid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    serviceId: process.env.TWILIO_VERIFY_SERVICE_SID,
  },
  email: {
    from:
      process.env.MAIL_FROM ||
      process.env.EMAIL_FROM ||
      'ZeroProofDrive <noreply@zeroproofdrive.org>',
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    from:
      process.env.MAIL_FROM ||
      process.env.EMAIL_FROM ||
      'ZeroProofDrive <noreply@zeroproofdrive.org>',
  },
  super_admin: {
    name: process.env.SUPER_ADMIN_NAME,
    email: process.env.SUPER_ADMIN_EMAIL,
    phone: process.env.SUPER_ADMIN_PHONE,
    password: process.env.SUPER_ADMIN_PASSWORD,
  },
};
