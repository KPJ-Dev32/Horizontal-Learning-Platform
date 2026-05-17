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

  // Authorize User Session
  const decoded = verifyToken(req);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }

  const userId = decoded.id;

  try {
    // 1. GET Course metadata and user watch progress
    if (req.method === 'GET') {
      const { id } = req.query;

      if (!id) {
        // Return summary of all courses
        const coursesSummary = await pool.query('SELECT id, title, category, description, jsonb_array_length(videos) as video_count FROM courses');
        return res.status(200).json(coursesSummary.rows);
      }

      // Fetch course by specific ID
      const courseRes = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
      if (courseRes.rows.length === 0) {
        return res.status(404).json({ error: 'Horizontal course module not found.' });
      }

      const course = courseRes.rows[0];

      // Fetch user's watch progress for this course
      const progressRes = await pool.query('SELECT watched_videos, completed FROM user_progress WHERE user_id = $1 AND course_id = $2', [userId, id]);
      
      let watchedVideos = [];
      let completed = false;

      if (progressRes.rows.length > 0) {
        watchedVideos = progressRes.rows[0].watched_videos || [];
        completed = progressRes.rows[0].completed || false;
      }

      return res.status(200).json({
        course: {
          id: course.id,
          title: course.title,
          category: course.category,
          description: course.description,
          videos: course.videos
        },
        progress: {
          watchedVideos,
          completed
        }
      });
    }

    // 2. POST Update Video progress (Mark a video as completed in the playlist)
    if (req.method === 'POST') {
      const { courseId, videoId } = req.body;

      if (!courseId || videoId === undefined) {
        return res.status(400).json({ error: 'CourseId and VideoId are required.' });
      }

      // Retrieve course videos schema
      const courseRes = await pool.query('SELECT videos FROM courses WHERE id = $1', [courseId]);
      if (courseRes.rows.length === 0) {
        return res.status(404).json({ error: 'Course not found.' });
      }

      const totalVideosCount = courseRes.rows[0].videos.length;

      // Query if user has progress rows
      const progressRes = await pool.query('SELECT watched_videos FROM user_progress WHERE user_id = $1 AND course_id = $2', [userId, courseId]);

      let watchedArray = [];
      let hasProgress = false;

      if (progressRes.rows.length > 0) {
        watchedArray = progressRes.rows[0].watched_videos || [];
        hasProgress = true;
      }

      // Append video ID if not already watched
      const videoNum = Number(videoId);
      if (!watchedArray.includes(videoNum)) {
        watchedArray.push(videoNum);
      }

      // Check if all videos are watched
      const completed = watchedArray.length >= totalVideosCount;

      if (hasProgress) {
        // Update database row
        await pool.query(
          'UPDATE user_progress SET watched_videos = $1, completed = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3 AND course_id = $4',
          [JSON.stringify(watchedArray), completed, userId, courseId]
        );
      } else {
        // Create new progress record
        await pool.query(
          'INSERT INTO user_progress (user_id, course_id, watched_videos, completed) VALUES ($1, $2, $3, $4)',
          [userId, courseId, JSON.stringify(watchedArray), completed]
        );
      }

      return res.status(200).json({
        message: 'Progress saved.',
        progress: {
          watchedVideos: watchedArray,
          completed
        }
      });
    }

    return res.status(405).json({ error: 'Method not supported.' });
  } catch (error) {
    console.error("Courses handler error details:", error);
    return res.status(500).json({ error: 'Internal server database process execution failure.' });
  }
}
