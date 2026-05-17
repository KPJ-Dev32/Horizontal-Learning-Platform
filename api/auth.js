import pool from './_db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'horizontal-super-secret-key';

export default async function handler(req, res) {
  // Add CORS headers for API accessibility
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { action } = req.body || {};

  try {
    // 1. User Registration / Account Creation
    if (action === 'register') {
      const { firstName, lastName, email, password, department, role } = req.body;
      
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'Missing required parameters.' });
      }

      // Check duplicate email
      const checkUser = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
      if (checkUser.rows.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user entry
      const result = await pool.query(
        'INSERT INTO users (first_name, last_name, email, password, department, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email',
        [firstName.trim(), lastName.trim(), email.toLowerCase().trim(), hashedPassword, department || 'eng', role || 'Software Associate']
      );

      return res.status(201).json({ message: 'Success! Profile created.', userId: result.rows[0].id });
    }

    // 2. User Credentials Login
    if (action === 'login') {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email credentials or password.' });
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email credentials or password.' });
      }

      // Create secure signed session token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({
        token,
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          department: user.department,
          role: user.role,
          phone: user.phone || '',
          avatarUrl: user.avatar_url || '',
          enrolledTrack: user.enrolled_primary ? { primary: user.enrolled_primary, target: user.enrolled_target } : null
        }
      });
    }

    return res.status(400).json({ error: 'Invalid endpoint action.' });
  } catch (error) {
    console.error("Auth handler error details:", error);
    return res.status(500).json({ error: 'Database execution error on the server.' });
  }
}
