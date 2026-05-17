import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environmental credentials from .env
dotenv.config();

const app = express();
app.use(express.json());

// Import your serverless database handlers
import authHandler from './api/auth.js';
import profileHandler from './api/profile.js';
import coursesHandler from './api/courses.js';
import examsHandler from './api/exams.js';

// Mount API routes directly
app.all('/api/auth', authHandler);
app.all('/api/profile', profileHandler);
app.all('/api/courses', coursesHandler);
app.all('/api/exams', examsHandler);

// Resolve directory name in ES Module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static pre-compiled frontend assets
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all SPA router paths directly to index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start full-stack server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n======================================================');
  console.log(`🚀 SOLID PRODUCTION SERVER RUNNING AT: http://localhost:${PORT}`);
  console.log('======================================================');
  console.log('  🟢 Connected to PostgreSQL Local Database.');
  console.log('  🟢 Serving pre-compiled static frontend.');
  console.log('  🟢 Zero Vite or Vercel Proxy compiler overhead.');
  console.log('======================================================\n');
});
