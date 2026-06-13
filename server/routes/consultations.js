const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getAllConsultations, getConsultationById, createConsultation,
  updateConsultation, deleteConsultation, getStats,
} = require('../controllers/consultationController');
const { uploadRecording, generateSummary, getRecording, deleteRecording } = require('../controllers/recordingController');

router.get('/stats', authenticate, getStats);
router.get('/', authenticate, getAllConsultations);
router.get('/:id', authenticate, getConsultationById);
router.post('/', authenticate, authorize('admin', 'astrologer'), createConsultation);
router.put('/:id', authenticate, authorize('admin', 'astrologer'), updateConsultation);
router.delete('/:id', authenticate, authorize('admin'), deleteConsultation);

router.post('/:id/upload', authenticate, authorize('admin', 'astrologer'), upload.single('recording'), uploadRecording);
router.post('/:id/summary', authenticate, authorize('admin', 'astrologer'), generateSummary);
router.get('/:id/recording', authenticate, getRecording);
router.delete('/:id/recording', authenticate, authorize('admin', 'astrologer'), deleteRecording);

module.exports = router;