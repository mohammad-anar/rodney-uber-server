import { emailHelper } from '../src/helpers/emailHelper';
import { emailTemplate } from '../src/shared/emailTemplate';

const recipient = process.argv[2];

if (!recipient) {
  console.error('Usage: npx ts-node scripts/sendTestEmail.ts <recipient-email>');
  process.exit(1);
}

async function run() {
  console.log(`Sending verification test email to: ${recipient}...`);

  const template = emailTemplate.createAccount({
    name: 'Test User',
    email: recipient,
    otp: 123456,
  });

  try {
    const result = await emailHelper.sendEmail(template);
    console.log('Test email sent successfully!');
    console.log('Resend Response:', JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error: any) {
    console.error('Failed to send test email:', error?.message || error);
    process.exit(1);
  }
}

run();
