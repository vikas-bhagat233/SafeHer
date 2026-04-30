const pool = require('../config/db');
const transporter = require('../config/mail');

exports.sendAlert = async (req, res) => {
  const { user_id, location, contacts, latitude, longitude } = req.body;

  try {
    if (!user_id || !location) {
      return res.status(400).json({ error: 'user_id and location are required' });
    }

    const userResult = await pool.query(
      'SELECT id, name FROM users WHERE id=$1',
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userName = userResult.rows[0].name || `User ${user_id}`;

    const alertInsert = await pool.query(
      'INSERT INTO alerts(user_id,location) VALUES($1,$2) RETURNING id',
      [user_id, location]
    );

    let recipients = [];

    if (Array.isArray(contacts) && contacts.length > 0) {
      recipients = contacts
        .filter((item) => item && item.email)
        .map((item) => ({
          name: item.name || 'Trusted Contact',
          email: item.email
        }));
    }

    if (recipients.length === 0) {
      const contactResult = await pool.query(
        'SELECT name, email FROM contacts WHERE user_id=$1',
        [user_id]
      );
      recipients = contactResult.rows
        .filter((row) => !!row.email)
        .map((row) => ({
          name: row.name || 'Trusted Contact',
          email: row.email
        }));
    }

    if (recipients.length === 0) {
      return res.status(400).json({ error: 'No emergency contacts found for this user' });
    }

    const coordsText = latitude && longitude
      ? `Latitude: ${latitude}\nLongitude: ${longitude}\n`
      : '';

    for (const recipient of recipients) {
      const htmlBody = `
        <p>Hi ${recipient.name},</p>
        <p><strong>Emergency Alert</strong></p>
        <p>${userName} has triggered an SOS alert.</p>
        <p>User ID: ${user_id}</p>
        <p>${coordsText.replace(/\n/g, '<br/>')}</p>
        <p>
          Location: <a href="${location}">${location}</a>
        </p>
      `;

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: recipient.email,
          subject: 'EMERGENCY ALERT',
          text: `Hi ${recipient.name},\n\n${userName} has triggered an SOS alert.\nUser ID: ${user_id}\n${coordsText}Location: ${location}`,
          html: htmlBody
        });
      } catch (mailError) {
        console.error('Email send failed:', mailError?.message || mailError);
        return res.status(500).json({
          error: 'Email send failed. Check EMAIL_USER/EMAIL_PASSWORD and Gmail app password setup.'
        });
      }
    }

    return res.json({
      message: 'Alert sent',
      recipients: recipients.map((item) => item.email),
      alert_id: alertInsert.rows?.[0]?.id
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getAlertHistory = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const result = await pool.query(
      'SELECT id, user_id, location, created_at FROM alerts WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100',
      [user_id]
    );

    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: 'Unable to fetch alert history' });
  }
};