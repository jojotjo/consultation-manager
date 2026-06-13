const { pool } = require('../config/db');

const getAllClients = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients ORDER BY name ASC');
    res.json(rows);
  } catch (err) { next(err); }
};

const getClientById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Client not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const createClient = async (req, res, next) => {
  try {
    const { name, email, phone, birth_date } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const [result] = await pool.query(
      'INSERT INTO clients (name, email, phone, birth_date) VALUES (?, ?, ?, ?)',
      [name, email, phone, birth_date || null]
    );
    res.status(201).json({ id: result.insertId, name, email, phone, birth_date });
  } catch (err) { next(err); }
};

module.exports = { getAllClients, getClientById, createClient };