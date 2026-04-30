const express = require('express');
const router = express.Router();
const { signup, login, getSecurityQuestion, verifySecurityQuestion, resetPassword, updateSecurityQuestion } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/security-question', getSecurityQuestion);
router.post('/verify-security', verifySecurityQuestion);
router.post('/reset-password', resetPassword);
router.post('/update-security', updateSecurityQuestion);

module.exports = router;