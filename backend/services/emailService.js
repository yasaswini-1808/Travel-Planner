import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM } =
  process.env;

const hasSmtpConfig =
  Boolean(SMTP_HOST) &&
  Boolean(SMTP_PORT) &&
  Boolean(SMTP_USER) &&
  Boolean(SMTP_PASS);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: String(SMTP_SECURE).toLowerCase() === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  : null;

export const sendLoginNotificationEmail = async ({
  to,
  username,
  loginTime,
  ipAddress,
}) => {
  if (!transporter) {
    console.warn("SMTP not configured — login notification not sent");
    return;
  }

  const fromAddress = SMTP_FROM || SMTP_USER;
  const formattedTime = new Date(loginTime).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject: "New login to your Travel Planner account",
    text: `Hi ${username},\n\nA new login was detected on your Travel Planner account.\n\nTime: ${formattedTime}\nIP Address: ${ipAddress || "Unknown"}\n\nIf this was you, no action is needed. If you did not log in, please reset your password immediately.`,
    html: `
      <p>Hi <strong>${username}</strong>,</p>
      <p>A new login was detected on your <strong>Travel Planner</strong> account.</p>
      <table style="border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Time</td><td style="padding:4px 0;"><strong>${formattedTime}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">IP Address</td><td style="padding:4px 0;"><strong>${ipAddress || "Unknown"}</strong></td></tr>
      </table>
      <p>If this was you, no action is needed.</p>
      <p>If you did not log in, please <strong>reset your password immediately</strong>.</p>
    `,
  });
};

export const sendWelcomeRegistrationEmail = async ({ to, username }) => {
  if (!transporter) {
    console.warn("SMTP not configured — registration email not sent");
    return;
  }

  const fromAddress = SMTP_FROM || SMTP_USER;

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject: "Welcome to Travel Planner",
    text: `Hi ${username},\n\nWelcome to Travel Planner. Your account has been created successfully.\n\nYou can now log in and start planning your trips.\n\nIf you did not create this account, please contact support immediately.`,
    html: `
      <p>Hi <strong>${username}</strong>,</p>
      <p>Welcome to <strong>Travel Planner</strong>. Your account has been created successfully.</p>
      <p>You can now log in and start planning your trips.</p>
      <p>If you did not create this account, please contact support immediately.</p>
    `,
  });
};

export const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  if (!transporter) {
    throw new Error("SMTP is not configured");
  }

  const fromAddress = SMTP_FROM || SMTP_USER;

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject: "Reset your Travel Planner password",
    text: `You requested a password reset for your Travel Planner account. Use the link below to reset your password (valid for 15 minutes):\n\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
    html: `
      <p>You requested a password reset for your <strong>Travel Planner</strong> account.</p>
      <p>
        Click the link below to reset your password (valid for 15 minutes):
      </p>
      <p>
        <a href="${resetUrl}">${resetUrl}</a>
      </p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });
};
