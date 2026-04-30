const nodemailer = require('nodemailer');

const useSmtp = !!process.env.SMTP_HOST;

const transporter = nodemailer.createTransport({
  ...(useSmtp
    ? {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      }
    : {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      }),
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000
});

module.exports = transporter;