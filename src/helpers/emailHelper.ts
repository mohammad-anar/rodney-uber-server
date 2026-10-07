import nodemailer from 'nodemailer';
import config from '../config';
import { errorLogger, logger } from '../shared/logger';
import { ISendEmail } from '../types/email';

const isSecure = Number(config.email.port) === 465;

const transporter = nodemailer.createTransport({
  host: config.email.host || 'smtp.gmail.com',
  port: Number(config.email.port) || 587,
  secure: isSecure,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
  logger: process.env.NODE_ENV !== 'production',
  debug: process.env.NODE_ENV !== 'production',
});

const sendEmail = async (values: ISendEmail) => {
  try {
    const info = await transporter.sendMail({
      from: `"Zero Proof Driving" <${config.email.from || config.email.user}>`,
      to: values.to,
      subject: values.subject,
      text: values.text,
      html: values.html,
      headers: {
        'X-Priority': '1 (Highest)',
        'X-MSMail-Priority': 'High',
        Importance: 'High',
      },
    });

    logger.info('Mail sent successfully to: %o', info.accepted);
    return info;
  } catch (error) {
    errorLogger.error('Email sending failed:', error);
    throw error;
  }
};

const verifyConnection = async () => {
  try {
    await transporter.verify();
    logger.info('SMTP server connection verified successfully.');
    return true;
  } catch (error) {
    errorLogger.error('SMTP connection failed:', error);
    return false;
  }
};

export const emailHelper = {
  sendEmail,
  verifyConnection,
};

