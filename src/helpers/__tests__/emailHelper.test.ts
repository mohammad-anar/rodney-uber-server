import { Resend } from 'resend';
import { emailHelper } from '../emailHelper';
import config from '../../config';
import { emailTemplate } from '../../shared/emailTemplate';

// Mock the Resend library
jest.mock('resend');

describe('emailHelper & Resend Service Suite', () => {
  const originalApiKey = config.resend.apiKey;
  const originalFrom = config.resend.from;

  let mockSend: jest.Mock;
  let mockListApiKeys: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    emailHelper.setResendClient(null);

    mockSend = jest.fn();
    mockListApiKeys = jest.fn();

    (Resend as unknown as jest.Mock).mockImplementation((apiKey: string) => {
      return {
        emails: {
          send: mockSend,
        },
        apiKeys: {
          list: mockListApiKeys,
        },
      };
    });

    config.resend.apiKey = 're_test_dummy_key_12345';
    config.resend.from = 'ZeroProofDrive <noreply@zeroproofdrive.org>';
  });

  afterAll(() => {
    config.resend.apiKey = originalApiKey;
    config.resend.from = originalFrom;
    emailHelper.setResendClient(null);
  });

  describe('Client Initialization & Configuration', () => {
    it('should initialize Resend client using the configured API key', () => {
      const client = emailHelper.getResendClient();
      expect(Resend).toHaveBeenCalledWith('re_test_dummy_key_12345');
      expect(client).toBeDefined();
    });

    it('should throw a clear error if RESEND_API_KEY is missing', () => {
      config.resend.apiKey = undefined;
      emailHelper.setResendClient(null);

      expect(() => emailHelper.getResendClient()).toThrow(
        'RESEND_API_KEY is not configured in environment variables.',
      );
    });

    it('should throw an error if sender address is missing when sending', async () => {
      config.resend.from = '';
      config.email.from = '';
      emailHelper.setResendClient(null);

      await expect(
        emailHelper.sendEmail({
          to: 'user@example.com',
          subject: 'Test Subject',
          html: '<p>Test</p>',
        }),
      ).rejects.toThrow('Sender address (MAIL_FROM / EMAIL_FROM) is not configured.');
    });
  });

  describe('Input Validation', () => {
    it('should reject when recipient address is missing or empty array', async () => {
      await expect(
        emailHelper.sendEmail({
          to: '',
          subject: 'Test',
          html: '<p>Body</p>',
        }),
      ).rejects.toThrow('Recipient email address ("to") is required.');

      await expect(
        emailHelper.sendEmail({
          to: [],
          subject: 'Test',
          html: '<p>Body</p>',
        }),
      ).rejects.toThrow('Recipient email address ("to") is required.');
    });

    it('should reject when subject is empty', async () => {
      await expect(
        emailHelper.sendEmail({
          to: 'user@example.com',
          subject: '   ',
          html: '<p>Body</p>',
        }),
      ).rejects.toThrow('Email subject is required.');
    });

    it('should reject when both html and text are missing', async () => {
      await expect(
        emailHelper.sendEmail({
          to: 'user@example.com',
          subject: 'Test',
          html: '',
          text: '',
        }),
      ).rejects.toThrow('Email body content (HTML or text) is required.');
    });
  });

  describe('Successful Email Sending', () => {
    it('should correctly format payload and send email via Resend SDK', async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: 'msg_resend_mock_123' },
        error: null,
      });

      const result = await emailHelper.sendEmail({
        to: 'recipient@example.com',
        subject: 'Welcome to Zero Proof Driving',
        html: '<h1>Welcome!</h1>',
        text: 'Welcome!',
      });

      expect(mockSend).toHaveBeenCalledTimes(1);
      const calledPayload = mockSend.mock.calls[0][0];

      expect(calledPayload.from).toBe('ZeroProofDrive <noreply@zeroproofdrive.org>');
      expect(calledPayload.to).toEqual(['recipient@example.com']);
      expect(calledPayload.subject).toBe('Welcome to Zero Proof Driving');
      expect(calledPayload.html).toBe('<h1>Welcome!</h1>');
      expect(calledPayload.text).toBe('Welcome!');
      expect(calledPayload.headers).toEqual({
        'X-Priority': '1 (Highest)',
        'X-MSMail-Priority': 'High',
        Importance: 'High',
      });
      expect(result).toEqual({ id: 'msg_resend_mock_123' });
    });

    it('should preserve optional fields like cc, bcc, replyTo, and attachments', async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: 'msg_options_456' },
        error: null,
      });

      await emailHelper.sendEmail({
        to: ['a@example.com', 'b@example.com'],
        subject: 'Notification',
        html: '<p>Content</p>',
        cc: 'cc@example.com',
        bcc: ['bcc1@example.com', 'bcc2@example.com'],
        replyTo: 'support@zeroproofdrive.org',
        attachments: [{ filename: 'receipt.pdf', content: 'dummy-content' }],
      });

      const calledPayload = mockSend.mock.calls[0][0];
      expect(calledPayload.to).toEqual(['a@example.com', 'b@example.com']);
      expect(calledPayload.cc).toEqual(['cc@example.com']);
      expect(calledPayload.bcc).toEqual(['bcc1@example.com', 'bcc2@example.com']);
      expect(calledPayload.reply_to).toEqual(['support@zeroproofdrive.org']);
      expect(calledPayload.attachments).toHaveLength(1);
      expect(calledPayload.attachments[0].filename).toBe('receipt.pdf');
    });
  });

  describe('Error Handling', () => {
    it('should throw and not treat Resend API provider errors as success', async () => {
      mockSend.mockResolvedValueOnce({
        data: null,
        error: {
          name: 'validation_error',
          message: 'Domain not verified for sending',
        },
      });

      await expect(
        emailHelper.sendEmail({
          to: 'test@example.com',
          subject: 'Test',
          html: '<p>Hello</p>',
        }),
      ).rejects.toThrow('Email sending failed: Domain not verified for sending');
    });

    it('should handle network/system rejections from Resend SDK', async () => {
      mockSend.mockRejectedValueOnce(new Error('Network connection timeout'));

      await expect(
        emailHelper.sendEmail({
          to: 'test@example.com',
          subject: 'Test',
          html: '<p>Hello</p>',
        }),
      ).rejects.toThrow('Network connection timeout');
    });
  });

  describe('verifyConnection Functionality', () => {
    it('should return true when Resend API responds successfully', async () => {
      mockListApiKeys.mockResolvedValueOnce({
        data: [{ id: 'key_1', name: 'default' }],
        error: null,
      });

      const isConnected = await emailHelper.verifyConnection();
      expect(isConnected).toBe(true);
    });

    it('should return true when API key is valid but restricted to sending only', async () => {
      mockListApiKeys.mockResolvedValueOnce({
        data: null,
        error: {
          name: 'restricted_api_key',
          message: 'This API key is restricted to only send emails',
        },
      });

      const isConnected = await emailHelper.verifyConnection();
      expect(isConnected).toBe(true);
    });

    it('should return false when Resend API returns an error response', async () => {
      mockListApiKeys.mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid API key' },
      });

      const isConnected = await emailHelper.verifyConnection();
      expect(isConnected).toBe(false);
    });

    it('should return false when RESEND_API_KEY is not set', async () => {
      config.resend.apiKey = undefined;
      const isConnected = await emailHelper.verifyConnection();
      expect(isConnected).toBe(false);
    });
  });

  describe('Email Templates & Dynamic Variable Integration', () => {
    it('should correctly format createAccount template with dynamic name and OTP', () => {
      const template = emailTemplate.createAccount({
        name: 'Jane Doe',
        email: 'jane@example.com',
        otp: 123456,
      });

      expect(template.to).toBe('jane@example.com');
      expect(template.subject).toContain('123456');
      expect(template.text).toContain('Jane Doe');
      expect(template.text).toContain('123456');
      expect(template.html).toContain('Jane Doe');
      expect(template.html).toContain('123456');
      expect(template.html).toContain('Zero Proof Driving');
    });

    it('should correctly format resetPassword template with dynamic OTP', () => {
      const template = emailTemplate.resetPassword({
        email: 'reset@example.com',
        otp: 654321,
      });

      expect(template.to).toBe('reset@example.com');
      expect(template.subject).toContain('654321');
      expect(template.text).toContain('654321');
      expect(template.html).toContain('654321');
      expect(template.html).toContain('Password Reset Request');
    });
  });
});
