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
