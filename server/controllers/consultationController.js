const { pool } = require('../config/db');

const BASE_QUERY = `
  SELECT 
    c.id, c.scheduled_at, c.duration_minutes, c.topic, c.notes, c.status, c.created_at,
    a.id AS astrologer_id, a.name AS astrologer_name, a.specialization,
    cl.id AS client_id, cl.name AS client_name, cl.email AS client_email, cl.phone AS client_phone
  FROM consultations c
  JOIN astrologers a ON c.astrologer_id = a.id
  JOIN clients cl ON c.client_id = cl.id
`;

const formatConsultation = (row) => ({
  id: row.id,
  scheduled_at: row.scheduled_at,
  duration_minutes: row.duration_minutes,
  topic: row.topic,
  notes: row.notes,
  status: row.status,
  created_at: row.created_at,
  astrologer: { id: row.astrologer_id, name: row.astrologer_name, specialization: row.specialization },
  client: { id: row.client_id, name: row.client_name, email: row.client_email, phone: row.client_phone },
});

const getAllConsultations = async (req, res, next) => {
  try {
    const { status, astrologer_id, client_id, search } = req.query;
    let query = BASE_QUERY + ' WHERE 1=1';
    const params = [];

    if (status) { query += ' AND c.status = ?'; params.push(status); }
    if (astrologer_id) { query += ' AND c.astrologer_id = ?'; params.push(astrologer_id); }
    if (client_id) { query += ' AND c.client_id = ?'; params.push(client_id); }
    if (search) {
      query += ' AND (cl.name LIKE ? OR a.name LIKE ? OR c.topic LIKE ?)';
      const t = `%${search}%`;
      params.push(t, t, t);
    }
    query += ' ORDER BY c.scheduled_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows.map(formatConsultation));
  } catch (err) { next(err); }
};

const getConsultationById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(BASE_QUERY + ' WHERE c.id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Consultation not found' });

    const consultation = formatConsultation(rows[0]);
    const [recordings] = await pool.query(
      'SELECT * FROM recordings WHERE consultation_id = ? ORDER BY uploaded_at DESC LIMIT 1',
      [req.params.id]
    );
    consultation.recording = recordings[0] || null;
    res.json(consultation);
  } catch (err) { next(err); }
};

const createConsultation = async (req, res, next) => {
  try {
    const { astrologer_id, client_id, scheduled_at, topic, notes, duration_minutes } = req.body;
    if (!astrologer_id || !client_id || !scheduled_at)
      return res.status(400).json({ error: 'astrologer_id, client_id, and scheduled_at are required' });

    const [result] = await pool.query(
      `INSERT INTO consultations (astrologer_id, client_id, scheduled_at, topic, notes, duration_minutes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [astrologer_id, client_id, scheduled_at, topic || null, notes || null, duration_minutes || 0]
    );
    const [newRows] = await pool.query(BASE_QUERY + ' WHERE c.id = ?', [result.insertId]);
    res.status(201).json(formatConsultation(newRows[0]));
  } catch (err) { next(err); }
};

const updateConsultation = async (req, res, next) => {
  try {
    const { topic, notes, status, duration_minutes, scheduled_at } = req.body;
    const { id } = req.params;
    const [existing] = await pool.query('SELECT id FROM consultations WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ error: 'Consultation not found' });

    await pool.query(
      `UPDATE consultations 
       SET topic = COALESCE(?, topic), notes = COALESCE(?, notes),
           status = COALESCE(?, status), duration_minutes = COALESCE(?, duration_minutes),
           scheduled_at = COALESCE(?, scheduled_at)
       WHERE id = ?`,
      [topic, notes, status, duration_minutes, scheduled_at, id]
    );
    const [updated] = await pool.query(BASE_QUERY + ' WHERE c.id = ?', [id]);
    res.json(formatConsultation(updated[0]));
  } catch (err) { next(err); }
};

const deleteConsultation = async (req, res, next) => {
  try {
    const [existing] = await pool.query('SELECT id FROM consultations WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ error: 'Consultation not found' });
    await pool.query('DELETE FROM consultations WHERE id = ?', [req.params.id]);
    res.json({ message: 'Consultation deleted successfully' });
  } catch (err) { next(err); }
};

const getStats = async (req, res, next) => {
  try {
    const [[total]] = await pool.query('SELECT COUNT(*) as total FROM consultations');
    const [[completed]] = await pool.query("SELECT COUNT(*) as total FROM consultations WHERE status = 'completed'");
    const [[scheduled]] = await pool.query("SELECT COUNT(*) as total FROM consultations WHERE status = 'scheduled'");
    const [[recordings]] = await pool.query('SELECT COUNT(*) as total FROM recordings');
    res.json({ total_consultations: total.total, completed: completed.total, scheduled: scheduled.total, total_recordings: recordings.total });
  } catch (err) { next(err); }
};

module.exports = { getAllConsultations, getConsultationById, createConsultation, updateConsultation, deleteConsultation, getStats };