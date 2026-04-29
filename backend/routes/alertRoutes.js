const express = require('express');
const router = express.Router();
const { sendAlert, getAlertHistory } = require('../controllers/alertController');

router.post('/send', sendAlert);
router.get('/history/:user_id', getAlertHistory);

module.exports = router;