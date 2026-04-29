const pool = require('../config/db');

let hasPhoneColumnCache = null;

const hasPhoneColumn = async () => {
  if (typeof hasPhoneColumnCache === 'boolean') {
    return hasPhoneColumnCache;
  }

  const result = await pool.query(
    `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name='contacts' AND column_name='phone'
      ) AS exists
    `
  );

  hasPhoneColumnCache = Boolean(result.rows?.[0]?.exists);
  return hasPhoneColumnCache;
};

exports.addContact = async (req, res) => {
  try {
    const { user_id, name, email, phone } = req.body;

    if (!user_id || !name || !email) {
      return res.status(400).json({ error: 'user_id, name and email are required' });
    }

    if (await hasPhoneColumn()) {
      await pool.query(
        'INSERT INTO contacts(user_id,name,email,phone) VALUES($1,$2,$3,$4)',
        [user_id, name, email, phone || null]
      );
    } else {
      await pool.query(
        'INSERT INTO contacts(user_id,name,email) VALUES($1,$2,$3)',
        [user_id, name, email]
      );
    }

    return res.json({ message: 'Contact added' });
  } catch (err) {
    return res.status(500).json({ error: 'Unable to add contact' });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = (await hasPhoneColumn())
      ? await pool.query(
          'SELECT id, user_id, name, email, phone FROM contacts WHERE user_id=$1 ORDER BY id DESC',
          [user_id]
        )
      : await pool.query(
          'SELECT id, user_id, name, email, NULL::text AS phone FROM contacts WHERE user_id=$1 ORDER BY id DESC',
          [user_id]
        );

    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: 'Unable to fetch contacts' });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, name, email, phone } = req.body;

    if (!id || !user_id || !name || !email) {
      return res.status(400).json({ error: 'id, user_id, name and email are required' });
    }

    const result = (await hasPhoneColumn())
      ? await pool.query(
          'UPDATE contacts SET name=$1, email=$2, phone=$3 WHERE id=$4 AND user_id=$5 RETURNING *',
          [name, email, phone || null, id, user_id]
        )
      : await pool.query(
          'UPDATE contacts SET name=$1, email=$2 WHERE id=$3 AND user_id=$4 RETURNING id, user_id, name, email, NULL::text AS phone',
          [name, email, id, user_id]
        );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    return res.json({ message: 'Contact updated', contact: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: 'Unable to update contact' });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!id || !user_id) {
      return res.status(400).json({ error: 'id and user_id are required' });
    }

    const result = await pool.query(
      'DELETE FROM contacts WHERE id=$1 AND user_id=$2 RETURNING id',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    return res.json({ message: 'Contact deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Unable to delete contact' });
  }
};