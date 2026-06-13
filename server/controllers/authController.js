const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, astrologer_id: user.astrologer_id, client_id: user.client_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ error: 'All fields are required' });

    if (!['admin', 'astrologer', 'client'].includes(role))
      return res.status(400).json({ error: 'Invalid role' });

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length)
      return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);

    let astrologer_id = null;
    let client_id = null;

    if (role === 'astrologer') {
      const [result] = await pool.query(
        'INSERT INTO astrologers (name, email) VALUES (?, ?)', [name, email]
      );
      astrologer_id = result.insertId;
    }

    if (role === 'client') {
      const [result] = await pool.query(
        'INSERT INTO clients (name, email) VALUES (?, ?)', [name, email]
      );
      client_id = result.insertId;
    }

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, astrologer_id, client_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashed, role, astrologer_id, client_id]
    );

    const user = { id: result.insertId, name, email, role, astrologer_id, client_id };
    res.status(201).json({ token: generateToken(user), user });
  } catch (err) { next(err); }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length)
      return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: 'Invalid credentials' });

    const { password: _, ...safeUser } = user;
    res.json({ token: generateToken(safeUser), user: safeUser });
  } catch (err) { next(err); }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, astrologer_id, client_id, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

// PUT /api/auth/update
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, specialization } = req.body;
    const { id, role, astrologer_id, client_id } = req.user;

    await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, id]);

    if (role === 'astrologer' && astrologer_id) {
      await pool.query(
        'UPDATE astrologers SET name = ?, specialization = ?, phone = ? WHERE id = ?',
        [name, specialization, phone, astrologer_id]
      );
    }

    if (role === 'client' && client_id) {
      await pool.query(
        'UPDATE clients SET name = ?, phone = ? WHERE id = ?',
        [name, phone, client_id]
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) { next(err); }
};

module.exports = { register, login, getMe, updateProfile };