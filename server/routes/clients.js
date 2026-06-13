const express = require('express');
const router = express.Router();
const { getAllClients, getClientById, createClient } = require('../controllers/clientController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, getAllClients);
router.get('/:id', authenticate, getClientById);
router.post('/', authenticate, authorize('admin', 'astrologer'), createClient);

module.exports = router;