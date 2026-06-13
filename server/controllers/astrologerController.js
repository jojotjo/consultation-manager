const { pool } = require('../config/db');

const getAllAstrologers = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM astrologers ORDER BY name ASC');
    res.json(rows);
  } catch (err) { next(err); }
};

const getAstrologerById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM astrologers WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Astrologer not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const createAstrologer = async (req, res, next) => {
  try {
    const { name, specialization, email, phone } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const [result] = await pool.query(
      'INSERT INTO astrologers (name, specialization, email, phone) VALUES (?, ?, ?, ?)',
      [name, specialization, email, phone]
    );
    res.status(201).json({ id: result.insertId, name, specialization, email, phone });
  } catch (err) { next(err); }
};

module.exports = { getAllAstrologers, getAstrologerById, createAstrologer };