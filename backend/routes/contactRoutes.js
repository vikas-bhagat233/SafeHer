const express = require('express');
const router = express.Router();
const {
  addContact,
  getContacts,
  updateContact,
  deleteContact
} = require('../controllers/contactController');

router.post('/add', addContact);
router.get('/:user_id', getContacts);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;