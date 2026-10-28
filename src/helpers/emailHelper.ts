import { Resend } from 'resend';
import config from '../config';
import { errorLogger, logger } from '../shared/logger';
import { ISendEmail } from '../types/email';

let resendInstance: Resend | null = null;

const getResendClient = (): Resend => {
  const apiKey = config.resend.apiKey;
  if (!apiKey) {
    const errorMsg = 'RESEND_API_KEY is not configured in environment variables.';
    errorLogger.error(errorMsg);
    throw new Error(errorMsg);
  }

  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }

  return resendInstance;
};

// Reset instance (useful for unit testing and dynamic config changes)
const setResendClient = (client: Resend | null) => {
  resendInstance = client;
};

const sendEmail = async (values: ISendEmail) => {
  try {
    if (!values) {
      throw new Error('Email payload is required.');
    }

    if (!values.to || (Array.isArray(values.to) && values.to.length === 0)) {
      throw new Error('Recipient email address ("to") is required.');
    }

    if (!values.subject || values.subject.trim() === '') {
      throw new Error('Email subject is required.');
    }

    if (!values.html && !values.text) {
      throw new Error('Email body content (HTML or text) is required.');
    }

    const fromAddress = config.resend.from || config.email.from;
    if (!fromAddress) {
      const errorMsg = 'Sender address (MAIL_FROM / EMAIL_FROM) is not configured.';
      errorLogger.error(errorMsg);
      throw new Error(errorMsg);
    }

    const recipients = Array.isArray(values.to) ? values.to : [values.to];

    const payload: {
      from: string;
      to: string[];
      subject: string;
      html: string;
      text?: string;
      cc?: string[];
      bcc?: string[];
      reply_to?: string[];
      attachments?: {
        filename?: string;
        content?: string | Buffer;
        path?: string;
      }[];
      headers?: Record<string, string>;
    } = {
      from: fromAddress,
      to: recipients,
      subject: values.subject,
      html: values.html,
      headers: {
        'X-Priority': '1 (Highest)',
        'X-MSMail-Priority': 'High',
        Importance: 'High',
      },
    };

    if (values.text) {
      payload.text = values.text;
    }

    if (values.cc) {
      payload.cc = Array.isArray(values.cc) ? values.cc : [values.cc];
    }

    if (values.bcc) {
      payload.bcc = Array.isArray(values.bcc) ? values.bcc : [values.bcc];
    }

    if (values.replyTo) {
      payload.reply_to = Array.isArray(values.replyTo)
        ? values.replyTo
        : [values.replyTo];
    }

    if (values.attachments && values.attachments.length > 0) {
      payload.attachments = values.attachments;
    }

    const resend = getResendClient();
    const result = await resend.emails.send(payload);

    if (result.error) {
      const errorDetail = result.error.message || 'Unknown provider error';
      errorLogger.error('Email sending failed via Resend API: %s', errorDetail);
      throw new Error(`Email sending failed: ${errorDetail}`);
    }

    logger.info('Mail sent successfully via Resend. Message ID: %s', result.data?.id);
    return result.data;
  } catch (error: any) {
    errorLogger.error('Email sending failed:', error?.message || error);
    throw error;
  }
};

const verifyConnection = async (): Promise<boolean> => {
  try {
    const apiKey = config.resend.apiKey;
    if (!apiKey) {
      errorLogger.error('Resend verification failed: RESEND_API_KEY is not configured.');
      return false;
    }

    const resend = getResendClient();
    const result = await resend.apiKeys.list();

    // A key restricted to sending only returns name: 'restricted_api_key', which confirms valid credentials
    if (result.error && (result.error as any).name !== 'restricted_api_key') {
      errorLogger.error('Resend connection verification failed: %s', result.error.message);
      return false;
    }

    logger.info('Resend API connection verified successfully.');
    return true;
  } catch (error: any) {
    errorLogger.error('Resend connection verification failed:', error?.message || error);
    return false;
  }
};

export const emailHelper = {
  sendEmail,
  verifyConnection,
  getResendClient,
  setResendClient,
};
