import { ICreateAccount, IResetPassword } from '../types/emailTamplate';

const PRIMARY_COLOR = '#C18F18';

const createAccount = (values: ICreateAccount) => {
  const text = `Zero Proof Driving\n\nWelcome ${values.name},\n\nThank you for creating your Zero Proof Driving account.\nYour verification code is: ${values.otp}\n\nThis code is valid for 3 minutes.\n\nIf you did not request this account, please ignore this email.\n\n© ${new Date().getFullYear()} Zero Proof Driving. All rights reserved.`;

  const data = {
    to: values.email,
    subject: 'Your Zero Proof Driving Verification Code: ' + values.otp,
    text,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Verification Code</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif; color:#333333;">
  <div style="width:100%; padding:40px 0; background-color:#f4f6f8;">
    <div style="max-width:580px; margin:0 auto; background:#ffffff; padding:40px 30px; border-radius:10px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
      
      <div style="text-align:center; margin-bottom:24px;">
        <h1 style="margin:0; font-size:22px; color:${PRIMARY_COLOR}; font-weight:700; letter-spacing:0.5px;">
          Zero Proof Driving
        </h1>
      </div>

      <hr style="border:none; border-top:1px solid #edf2f7; margin-bottom:24px;">

      <h2 style="margin:0 0 16px 0; font-size:18px; color:#1a202c; font-weight:600;">
        Welcome, ${values.name}!
      </h2>

      <p style="font-size:15px; line-height:1.6; color:#4a5568; margin-bottom:24px;">
        Thank you for creating your account with Zero Proof Driving. Please use the following 6-digit verification code to complete your registration:
      </p>

      <div style="text-align:center; margin:32px 0;">
        <span style="
          display:inline-block;
          background:${PRIMARY_COLOR};
          color:#ffffff;
          padding:12px 32px;
          border-radius:8px;
          font-size:28px;
          letter-spacing:6px;
          font-weight:700;">
          ${values.otp}
        </span>
      </div>

      <p style="font-size:14px; color:#718096; margin-bottom:24px; text-align:center;">
        This code is single-use and valid for <strong>3 minutes</strong>.
      </p>

      <hr style="border:none; border-top:1px solid #edf2f7; margin:28px 0 20px 0;">

      <p style="font-size:12px; color:#a0aec0; line-height:1.5; margin:0; text-align:center;">
        If you did not request this account registration, you can safely ignore this email.
      </p>

      <p style="font-size:12px; color:#a0aec0; margin-top:8px; text-align:center;">
        © ${new Date().getFullYear()} Zero Proof Driving. All rights reserved.
      </p>

    </div>
  </div>
</body>
</html>`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const text = `Zero Proof Driving\n\nPassword Reset Request\n\nYour password reset code is: ${values.otp}\n\nThis code is valid for 3 minutes.\n\nIf you did not request a password reset, please ignore this email.\n\n© ${new Date().getFullYear()} Zero Proof Driving. All rights reserved.`;

  const data = {
    to: values.email,
    subject: 'Zero Proof Driving Password Reset Code: ' + values.otp,
    text,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif; color:#333333;">
  <div style="width:100%; padding:40px 0; background-color:#f4f6f8;">
    <div style="max-width:580px; margin:0 auto; background:#ffffff; padding:40px 30px; border-radius:10px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
      
      <div style="text-align:center; margin-bottom:24px;">
        <h1 style="margin:0; font-size:22px; color:${PRIMARY_COLOR}; font-weight:700; letter-spacing:0.5px;">
          Zero Proof Driving
        </h1>
      </div>

      <hr style="border:none; border-top:1px solid #edf2f7; margin-bottom:24px;">

      <h2 style="margin:0 0 16px 0; font-size:18px; color:#1a202c; font-weight:600;">
        Password Reset Request
      </h2>

      <p style="font-size:15px; line-height:1.6; color:#4a5568; margin-bottom:24px;">
        We received a request to reset your password. Use the verification code below to proceed:
      </p>

      <div style="text-align:center; margin:32px 0;">
        <span style="
          display:inline-block;
          background:${PRIMARY_COLOR};
          color:#ffffff;
          padding:12px 32px;
          border-radius:8px;
          font-size:28px;
          letter-spacing:6px;
          font-weight:700;">
          ${values.otp}
        </span>
      </div>

      <p style="font-size:14px; color:#718096; margin-bottom:24px; text-align:center;">
        This code expires in <strong>3 minutes</strong>.
      </p>

      <hr style="border:none; border-top:1px solid #edf2f7; margin:28px 0 20px 0;">

      <p style="font-size:12px; color:#a0aec0; line-height:1.5; margin:0; text-align:center;">
        If you did not request a password reset, you can safely ignore this email.
      </p>

      <p style="font-size:12px; color:#a0aec0; margin-top:8px; text-align:center;">
        © ${new Date().getFullYear()} Zero Proof Driving. All rights reserved.
      </p>

    </div>
  </div>
</body>
</html>`,
  };
  return data;
};

export const emailTemplate = {
  createAccount,
  resetPassword,
};

