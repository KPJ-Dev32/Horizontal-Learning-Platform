import pool from './_db.js';
import { verifyToken } from './_auth.js';

// Maps exam IDs to their required course IDs for eligibility validation
const EXAM_COURSE_MAP = {
  frontend: 'html-css',
  sitecore: 'backend-rest',
  devops: 'devops-pipeline'
};

const EXAM_NAMES_MAP = {
  frontend: 'Modern Frontend Architecture & HTML/CSS Certification',
  sitecore: 'Sitecore DAM & Content Hub Professional Certification',
  devops: 'DevOps Infrastructure & CI/CD Pipeline Certification'
};

export default async function handler(req, res) {
  // CORS Headers support
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Authorize User Session
  const decoded = verifyToken(req);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized credentials.' });
  }

  const userId = decoded.id;

  try {
    // 1. GET Check Exam eligibility (Have they finished watching all course videos?)
    if (req.method === 'GET') {
      const { examId } = req.query;

      if (!examId) {
        return res.status(400).json({ error: 'Missing Exam ID parameter.' });
      }

      const requiredCourseId = EXAM_COURSE_MAP[examId];
      if (!requiredCourseId) {
        return res.status(400).json({ error: 'Invalid Exam ID mapped.' });
      }

      // Check if course is completed in user_progress
      const progressRes = await pool.query(
        'SELECT completed FROM user_progress WHERE user_id = $1 AND course_id = $2',
        [userId, requiredCourseId]
      );

      const isEligible = progressRes.rows.length > 0 && progressRes.rows[0].completed === true;

      return res.status(200).json({
        eligible: isEligible,
        requiredCourse: requiredCourseId,
        message: isEligible ? 'Eligible to take exam' : 'Requires completing corresponding training course videos first!'
      });
    }

    // 2. POST Save Certified Exam Score & Claim Badge
    if (req.method === 'POST') {
      const { examId, score, title, totalQuestions } = req.body;

      if (!examId || score === undefined) {
        return res.status(400).json({ error: 'Missing ExamId or Score parameters.' });
      }

      const certName = title || EXAM_NAMES_MAP[examId];
      if (!certName) {
        return res.status(400).json({ error: 'Invalid exam specified.' });
      }

      const qCount = totalQuestions ? Number(totalQuestions) : 5;
      const passingScore = Math.ceil(qCount * 0.8);
      const isPassed = Number(score) >= passingScore;

      if (!isPassed) {
        return res.status(400).json({ error: `Did not score 80% or higher (required: ${passingScore} out of ${qCount}). Certification not earned.` });
      }

      // Check duplicate certification
      const duplicateRes = await pool.query(
        'SELECT id FROM certifications WHERE user_id = $1 AND cert_name = $2',
        [userId, certName]
      );

      if (duplicateRes.rows.length > 0) {
        return res.status(200).json({ message: 'Certification already claimed.' });
      }

      // Save certification in database
      await pool.query(
        'INSERT INTO certifications (user_id, cert_name, score) VALUES ($1, $2, $3)',
        [userId, certName, Number(score)]
      );

      return res.status(201).json({
        message: 'Success! Certification registered and badge claimed.',
        certification: {
          name: certName,
          score: Number(score),
          date: new Date().toISOString().split('T')[0]
        }
      });
    }

    return res.status(405).json({ error: 'Method not supported.' });
  } catch (error) {
    console.error("Exams handler database error details:", error);
    return res.status(500).json({ error: 'Internal server database execution query failure.' });
  }
}
