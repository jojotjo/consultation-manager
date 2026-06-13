const express = require('express');
const router = express.Router();
const { getAllAstrologers, getAstrologerById, createAstrologer } = require('../controllers/astrologerController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, getAllAstrologers);
router.get('/:id', authenticate, getAstrologerById);
router.post('/', authenticate, authorize('admin'), createAstrologer);

module.exports = router;