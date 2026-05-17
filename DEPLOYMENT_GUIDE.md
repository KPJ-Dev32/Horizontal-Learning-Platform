# 🚀 Deploying Horizontal Learning Platform to Vercel

This guide outlines the step-by-step instructions to deploy your full-stack React + Node (Serverless) application to **Vercel** connected to a cloud **PostgreSQL database** (such as Supabase, Neon, or Vercel Postgres). 

Because the backend is already fully optimized with Serverless rewrite routes (`vercel.json`) and secure SSL DB pooling (`api/_db.js`), it will work **exactly as it does locally** in less than 5 minutes!

---

## 🛠️ Step 1: Create a Cloud PostgreSQL Database
Since Vercel is serverless, you cannot connect to `localhost`. You need a cloud-hosted PostgreSQL database.

### Option A: Using Neon (Highly Recommended & Free)
1. Go to [Neon.tech](https://neon.tech/) and create a free account.
2. Create a new project named `horizontal-learning`.
3. In the Neon Dashboard, copy the **Connection String** (select `node-postgres` or just copy the direct URI). It will look similar to:
   `postgres://alex:pwd@ep-cool-snowflake-12345.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. Connect to your new database using a client (like pgAdmin or DBeaver) or Neon's online SQL Editor, and paste the contents of `database.sql` to build the database tables.

### Option B: Using Supabase (Free Tier)
1. Go to [Supabase.com](https://supabase.com/) and create a free project.
2. Go to **Project Settings > Database** and copy the **URI Connection String** under the transaction pooler.
3. Go to the **SQL Editor** tab in Supabase, and run the contents of your `database.sql` file.

---

## 📦 Step 2: Push Your Code to GitHub
Ensure your local code is version-controlled and pushed to GitHub:

1. Initialize git (if not already done):
   ```bash
   git init
   ```
2. Make sure your `.gitignore` correctly contains `.env` (so you don't leak database credentials publicly!).
3. Add and commit all files:
   ```bash
   git add .
   git commit -m "feat: complete full-stack dynamic horizontal learning platform"
   ```
4. Create a repository on GitHub and push your local commits:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

---

## ☁️ Step 3: Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com/) and log in with GitHub.
2. Click **Add New > Project** and import your repository.
3. Vercel will automatically auto-detect the configuration:
   * **Framework Preset:** `Vite`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Expand the **Environment Variables** section and add the following keys:

| Key | Value | Description |
| :--- | :--- | :--- |
| `POSTGRES_URL` | *Your copied cloud Connection String URI* | Cloud PostgreSQL connection string (automatically enables secure SSL pooling). |
| `JWT_SECRET` | *Any long random secure string* | Used by the serverless auth handlers to sign secure session tokens. |

5. Click **Deploy**! 🚀

---

## 🎯 Why It Works Out of The Box
* **Serverless Rewrite Routing (`vercel.json`):** Matches all `/api/*` endpoints to the serverless files under the `/api/` directory (e.g., `/api/exams` -> `api/exams.js`), and rewrites all single-page app frontend routes (like `/exams` or `/profile`) straight to `index.html`.
* **Dynamic DB SSL Pooling (`api/_db.js`):** Automatically detects `POSTGRES_URL` in the cloud environment, spins up an active serverless connection pool, and enables `ssl: { rejectUnauthorized: false }` required for secure cloud database transactions.

---

🎉 **Congratulations! Your high-performance, full-stack Horizontal Learning Platform is live!**
