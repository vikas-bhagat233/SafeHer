const sgMail = require('@sendgrid/mail');
const transporter = require('../config/mail');

// Initialize SendGrid if API key is present
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Sends an email using either SendGrid (over HTTPS, bypasses Render SMTP block) 
 * or Nodemailer (fallback/local development)
 */
exports.sendEmail = async ({ to, subject, text, html }) => {
  if (process.env.SENDGRID_API_KEY) {
    try {
      const msg = {
        to,
        from: process.env.EMAIL_USER, // This MUST be the email you verified in SendGrid
        subject,
        text,
        html,
      };
      const response = await sgMail.send(msg);
      return response;
    } catch (err) {
      console.error('SendGrid email failed:', err.response ? err.response.body : err);
      throw err;
    }
  } else {
    // Fallback to Nodemailer
    return transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
  }
};
