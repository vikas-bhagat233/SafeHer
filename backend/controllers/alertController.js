const pool = require('../config/db');

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

    const alertInsert = await pool.query(
      'INSERT INTO alerts(user_id,location) VALUES($1,$2) RETURNING id',
      [user_id, location]
    );

    return res.json({
      message: 'Alert saved',
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