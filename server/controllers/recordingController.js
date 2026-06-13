const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

const uploadRecording = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [consultation] = await pool.query('SELECT id FROM consultations WHERE id = ?', [id]);
    if (!consultation.length) return res.status(404).json({ error: 'Consultation not found' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { filename, path: filePath, size, mimetype } = req.file;

    const [existing] = await pool.query('SELECT file_path FROM recordings WHERE consultation_id = ?', [id]);
    if (existing.length) {
      if (fs.existsSync(existing[0].file_path)) fs.unlinkSync(existing[0].file_path);
      await pool.query('DELETE FROM recordings WHERE consultation_id = ?', [id]);
    }

    const [result] = await pool.query(
      'INSERT INTO recordings (consultation_id, file_name, file_path, file_size, file_type) VALUES (?, ?, ?, ?, ?)',
      [id, filename, filePath, size, mimetype]
    );
    await pool.query("UPDATE consultations SET status = 'completed' WHERE id = ?", [id]);

    res.status(201).json({ id: result.insertId, consultation_id: parseInt(id), file_name: filename, file_size: size, file_type: mimetype });
  } catch (err) { next(err); }
};

const generateSummary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { transcript } = req.body;

    const [recordings] = await pool.query('SELECT * FROM recordings WHERE consultation_id = ?', [id]);
    if (!recordings.length) return res.status(404).json({ error: 'No recording found' });

    const [consultation] = await pool.query(
      `SELECT c.topic, a.name AS astrologer, cl.name AS client
       FROM consultations c
       JOIN astrologers a ON c.astrologer_id = a.id
       JOIN clients cl ON c.client_id = cl.id
       WHERE c.id = ?`, [id]
    );

    const info = consultation[0];
    const transcriptText = transcript || recordings[0].transcript || 'No transcript available.';

    const prompt = `You are an assistant for an astrology consultation platform.
Summarize the following consultation in 3-4 sentences covering key topics, guidance given, and action items.

Astrologer: ${info.astrologer}
Client: ${info.client}
Topic: ${info.topic || 'General Consultation'}
Transcript: ${transcriptText}

Provide a professional, concise summary.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 500, messages: [{ role: 'user', content: prompt }] }),
    });

    const data = await response.json();
    const summary = data.content?.[0]?.text || 'Summary could not be generated.';

    await pool.query('UPDATE recordings SET transcript = ?, ai_summary = ? WHERE consultation_id = ?', [transcriptText, summary, id]);
    res.json({ summary, transcript: transcriptText });
  } catch (err) { next(err); }
};

const getRecording = async (req, res, next) => {
  try {
    const [recordings] = await pool.query('SELECT * FROM recordings WHERE consultation_id = ?', [req.params.id]);
    if (!recordings.length) return res.status(404).json({ error: 'No recording found' });

    const rec = recordings[0];
    const filePath = path.resolve(rec.file_path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on server' });

    res.setHeader('Content-Type', rec.file_type || 'audio/mpeg');
    res.setHeader('Content-Disposition', `inline; filename="${rec.file_name}"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) { next(err); }
};

const deleteRecording = async (req, res, next) => {
  try {
    const [recordings] = await pool.query('SELECT * FROM recordings WHERE consultation_id = ?', [req.params.id]);
    if (!recordings.length) return res.status(404).json({ error: 'No recording found' });

    if (fs.existsSync(recordings[0].file_path)) fs.unlinkSync(recordings[0].file_path);
    await pool.query('DELETE FROM recordings WHERE consultation_id = ?', [req.params.id]);
    res.json({ message: 'Recording deleted successfully' });
  } catch (err) { next(err); }
};

module.exports = { uploadRecording, generateSummary, getRecording, deleteRecording };