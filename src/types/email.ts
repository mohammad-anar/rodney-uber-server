export type ISendEmail = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  attachments?: {
    filename?: string;
    content?: string | Buffer;
    path?: string;
  }[];
};

