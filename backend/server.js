require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const alertRoutes = require('./routes/alertRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth requests, please try again later' }
});

const alertLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many alert requests, please slow down' }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/alert', alertLimiter, alertRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
  res.json({ message: "SafeHer Backend Running 🚀", version: "1.0.0" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on port ${PORT}`)
);
