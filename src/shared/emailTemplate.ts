import { ICreateAccount, IResetPassword } from '../types/emailTamplate';

const PRIMARY_COLOR = '#C18F18';

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: 'Verify your Zero Proof Driving account',
    html: `
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <div style="width:100%; padding:40px 0;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; padding:40px 35px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.06);">
      
      <h1 style="margin:0 0 25px 0; font-size:22px; color:${PRIMARY_COLOR}; text-align:center; font-weight:700;">
        Zero Proof Driving
      </h1>

      <hr style="border:none; border-top:1px solid #eeeeee; margin-bottom:30px;">

      <h2 style="margin:0 0 20px 0; font-size:20px; color:#222;">
        Welcome ${values.name},
      </h2>

      <p style="font-size:15px; line-height:1.7; color:#555; margin-bottom:25px;">
        Thank you for creating your Zero Proof Driving account.
        Please use the verification code below to activate your account.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <span style="
          display:inline-block;
          background:${PRIMARY_COLOR};
          color:#ffffff;
          padding:14px 30px;
          border-radius:8px;
          font-size:24px;
          letter-spacing:4px;
          font-weight:600;">
          ${values.otp}
        </span>
      </div>

      <p style="font-size:14px; color:#777; margin-bottom:25px;">
        This code is valid for <strong>3 minutes</strong>.
      </p>

      <hr style="border:none; border-top:1px solid #eeeeee; margin:30px 0 20px 0;">

      <p style="font-size:13px; color:#999; line-height:1.6; margin:0;">
        If you did not request this account, you can safely ignore this email.
      </p>

      <p style="font-size:12px; color:#bbbbbb; margin-top:12px;">
        © ${new Date().getFullYear()} Zero Proof Driving. All rights reserved.
      </p>

    </div>
  </div>
</body>
`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: 'Reset your Zero Proof Driving password',
    html: `
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <div style="width:100%; padding:40px 0;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; padding:40px 35px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.06);">
      
      <h1 style="margin:0 0 25px 0; font-size:22px; color:${PRIMARY_COLOR}; text-align:center; font-weight:700;">
        Zero Proof Driving
      </h1>

      <hr style="border:none; border-top:1px solid #eeeeee; margin-bottom:30px;">

      <h2 style="margin:0 0 20px 0; font-size:20px; color:#222;">
        Password Reset Code
      </h2>

      <p style="font-size:15px; line-height:1.7; color:#555; margin-bottom:25px;">
        Use the single-use verification code below to reset your password.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <span style="
          display:inline-block;
          background:${PRIMARY_COLOR};
          color:#ffffff;
          padding:14px 30px;
          border-radius:8px;
          font-size:24px;
          letter-spacing:4px;
          font-weight:600;">
          ${values.otp}
        </span>
      </div>

      <p style="font-size:14px; color:#777; margin-bottom:25px;">
        This code expires in <strong>3 minutes</strong>.
      </p>

      <hr style="border:none; border-top:1px solid #eeeeee; margin:30px 0 20px 0;">

      <p style="font-size:13px; color:#999; line-height:1.6; margin:0;">
        If you didn’t request this password reset, you can safely ignore this email.
      </p>

      <p style="font-size:12px; color:#bbbbbb; margin-top:12px;">
        © ${new Date().getFullYear()} Zero Proof Driving. All rights reserved.
      </p>

    </div>
  </div>
</body>
`,
  };
  return data;
};

export const emailTemplate = {
  createAccount,
  resetPassword,
};
