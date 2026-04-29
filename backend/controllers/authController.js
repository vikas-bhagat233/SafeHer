const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, security_question, security_answer } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const hash = await bcrypt.hash(password, 10);
    const answerHash = security_answer ? await bcrypt.hash(security_answer.toLowerCase(), 10) : null;

    await pool.query(
      'INSERT INTO users(name,email,password,security_question,security_answer) VALUES($1,$2,$3,$4,$5)',
      [name, email, hash, security_question || null, answerHash]
    );

    return res.json({ message: 'User registered' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }

    console.error('Signup error:', err.message);
    return res.status(500).json({ error: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ error: 'Wrong password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    return res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Login failed' });
  }
};

exports.verifySecurityQuestion = async (req, res) => {
  try {
    const { email, security_answer } = req.body;

    if (!email || !security_answer) {
      return res.status(400).json({ error: 'Email and answer are required' });
    }

    const result = await pool.query(
      'SELECT id, security_question, security_answer FROM users WHERE email=$1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    if (!user.security_question || !user.security_answer) {
      return res.status(400).json({ error: 'No security question configured for this account' });
    }

    const valid = await bcrypt.compare(security_answer.toLowerCase(), user.security_answer);

    if (!valid) {
      return res.status(400).json({ error: 'Incorrect answer' });
    }

    const resetToken = jwt.sign({ id: user.id, type: 'password_reset' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return res.json({ message: 'Verified', reset_token: resetToken, user_id: user.id });
  } catch (err) {
    console.error('Verification error:', err.message);
    return res.status(500).json({ error: 'Verification failed' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { user_id, reset_token, new_password } = req.body;

    if (!user_id || !reset_token || !new_password) {
      return res.status(400).json({ error: 'user_id, reset_token and new_password are required' });
    }

    try {
      const decoded = jwt.verify(reset_token, process.env.JWT_SECRET);
      if (decoded.type !== 'password_reset' || decoded.id !== parseInt(user_id)) {
        return res.status(400).json({ error: 'Invalid reset token' });
      }
    } catch {
      return res.status(400).json({ error: 'Reset token expired or invalid' });
    }

    const hash = await bcrypt.hash(new_password, 10);

    const result = await pool.query(
      'UPDATE users SET password=$1 WHERE id=$2 RETURNING id, email, name',
      [hash, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ message: 'Password reset successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Reset error:', err.message);
    return res.status(500).json({ error: 'Password reset failed' });
  }
};

exports.updateSecurityQuestion = async (req, res) => {
  try {
    const { user_id, security_question, security_answer } = req.body;

    if (!user_id || !security_question || !security_answer) {
      return res.status(400).json({ error: 'user_id, security_question and security_answer are required' });
    }

    const answerHash = await bcrypt.hash(security_answer.toLowerCase(), 10);

    const result = await pool.query(
      'UPDATE users SET security_question=$1, security_answer=$2 WHERE id=$3 RETURNING id',
      [security_question, answerHash, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ message: 'Security question updated' });
  } catch (err) {
    console.error('Update error:', err.message);
    return res.status(500).json({ error: 'Failed to update security question' });
  }
};