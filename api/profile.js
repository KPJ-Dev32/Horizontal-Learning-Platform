import pool from './_db.js';
import { verifyToken } from './_auth.js';

export default async function handler(req, res) {
  // CORS Headers support
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Authorize User Token
  const decoded = verifyToken(req);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized session. Please log in again.' });
  }

  const userId = decoded.id;

  try {
    // 1. GET User Details + Earned Certifications
    if (req.method === 'GET') {
      const userRes = await pool.query('SELECT id, first_name, last_name, email, department, role, phone, avatar_url, enrolled_primary, enrolled_target FROM users WHERE id = $1', [userId]);
      if (userRes.rows.length === 0) {
        return res.status(404).json({ error: 'Employee profile not found.' });
      }

      const user = userRes.rows[0];

      // Fetch dynamic certificates
      const certsRes = await pool.query('SELECT cert_name as name, score, issued_date as date FROM certifications WHERE user_id = $1 ORDER BY issued_date DESC', [userId]);

      return res.status(200).json({
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
        },
        certifications: certsRes.rows
      });
    }

    // 2. PUT Updates (Profile parameters or Enrollment actions)
    if (req.method === 'PUT') {
      const { action } = req.body || {};

      // A. Update personal profile parameters
      if (action === 'update-profile') {
        const { firstName, lastName, phone, role, avatarUrl, department } = req.body;

        if (!firstName || !lastName) {
          return res.status(400).json({ error: 'First and Last name are required.' });
        }

        await pool.query(
          'UPDATE users SET first_name = $1, last_name = $2, phone = $3, role = $4, avatar_url = $5, department = $6 WHERE id = $7',
          [firstName.trim(), lastName.trim(), phone || '', role || 'Software Associate', avatarUrl || '', department || 'eng', userId]
        );

        return res.status(200).json({ message: 'Profile updated successfully!' });
      }

      // B. Lock a learning path target goal
      if (action === 'enroll-track') {
        const { primary, target } = req.body;

        if (!primary || !target) {
          return res.status(400).json({ error: 'Primary specialty and target goals are required.' });
        }

        await pool.query(
          'UPDATE users SET enrolled_primary = $1, enrolled_target = $2 WHERE id = $3',
          [primary, target, userId]
        );

        return res.status(200).json({ message: 'Successfully enrolled in secondary track!' });
      }
    }

    // 3. DELETE Crossover Pathway Goals (Disenrollment)
    if (req.method === 'DELETE') {
      await pool.query(
        'UPDATE users SET enrolled_primary = NULL, enrolled_target = NULL WHERE id = $1',
        [userId]
      );

      return res.status(200).json({ message: 'Successfully disenrolled from current track.' });
    }

    return res.status(405).json({ error: 'Method not supported on this endpoint.' });
  } catch (error) {
    console.error("Profile handler database error:", error);
    return res.status(500).json({ error: 'Server database query processing error.' });
  }
}
