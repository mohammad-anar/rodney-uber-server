// twilioHelper.ts
import twilio from 'twilio';
import 'dotenv/config';
import config from '../config';

const client = twilio(config.twilio.sid, config.twilio.authToken);

export const sendOTPViaSMS = async (phone: string) => {
  try {
    const verification = await client.verify.v2
      .services(config.twilio.serviceId as string)
      .verifications.create({
        to: phone,
        channel: 'sms',
      });

    console.log({ verification }, 'from twilio');
    return verification;
  } catch (err) {
    console.error('Error sending OTP via SMS', err);
    throw new Error('Failed to send OTP');
  }
};

export const verifyOTPViaSMS = async (phone: string, code: string) => {
  try {
    const verificationCheck = await client.verify.v2
      .services(config.twilio.serviceId as string)
      .verificationChecks.create({
        to: phone,
        code,
      });

    // returns true if approved, false otherwise
    return verificationCheck.status === 'approved';
  } catch (err: any) {
    console.error('Error verifying OTP via SMS', err);

    // Optional: provide more meaningful error messages
    if (err.code === 60605) {
      throw new Error(
        'SMS sending to this country is blocked by Twilio geo-permissions',
      );
    } else if (err.code === 21608) {
      throw new Error(
        'The phone number is unverified. Upgrade your Twilio account or verify the number.',
      );
    }

    throw new Error('Failed to verify OTP');
  }
};
