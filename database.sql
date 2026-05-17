CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(50) DEFAULT 'eng', 
    role VARCHAR(100) DEFAULT 'Software Associate',
    phone VARCHAR(20) DEFAULT '',
    avatar_url VARCHAR(255) DEFAULT '',
    enrolled_primary VARCHAR(50) DEFAULT NULL,
    enrolled_target VARCHAR(50) DEFAULT NULL,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    videos JSONB NOT NULL 
);

CREATE TABLE IF NOT EXISTS user_progress (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
    watched_videos JSONB DEFAULT '[]'::jsonb, 
    completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS certifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    cert_name VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    issued_date DATE DEFAULT CURRENT_DATE
);

INSERT INTO courses (id, title, category, description, videos) VALUES
(
    'html-css',
    'HTML & CSS Fundamentals',
    'Frontend',
    'Master the building blocks of web markup and layout. Learn about HTML5 semantic tag layouts, CSS grids, flexboxes, and responsive mobile-first typography variables.',
    '[
        {"id": 1, "title": "Introduction to Web Standards", "duration": "08:45"},
        {"id": 2, "title": "HTML5 Semantic Document Schemas", "duration": "12:15"},
        {"id": 3, "title": "Advanced CSS Layouts with Flexbox", "duration": "15:30"},
        {"id": 4, "title": "Mastering CSS Grid Architectures", "duration": "18:20"},
        {"id": 5, "title": "Mobile Responsiveness & Media Queries", "duration": "14:10"}
    ]'::jsonb
),
(
    'backend-rest',
    'RESTful API & Database Architecture',
    'Backend',
    'Build powerful scalable APIs and secure backend connections. Learn server-side logic using Node.js, routing protocols with Express, database connections, and secure PostgreSQL schema query designs.',
    '[
        {"id": 1, "title": "Backend Architecture Fundamentals", "duration": "10:30"},
        {"id": 2, "title": "Setting Up Node.js and Express Servers", "duration": "14:15"},
        {"id": 3, "title": "Understanding HTTP Status Codes and Routes", "duration": "12:45"},
        {"id": 4, "title": "REST API Guidelines and Best Practices", "duration": "16:20"},
        {"id": 5, "title": "Connecting Express to PostgreSQL with pg-pool", "duration": "18:50"},
        {"id": 6, "title": "Writing SQL Schemas and CRUD Queries", "duration": "20:10"},
        {"id": 7, "title": "Middleware, Error Handlers, and Cors", "duration": "15:40"},
        {"id": 8, "title": "User Authentication & Hashed Passwords", "duration": "22:15"},
        {"id": 9, "title": "JSON Web Token (JWT) Security Frameworks", "duration": "19:30"},
        {"id": 10, "title": "Testing Server Endpoints with Postman", "duration": "11:50"}
    ]'::jsonb
),
(
    'devops-pipeline',
    'DevOps Pipelines & Infrastructure',
    'DevOps',
    'Automate builds, containerize services, and orchestrate cloud configurations. Deep dive into Docker multi-stage layers, Kubernetes clusters, service meshes, and Github Actions CI/CD workflows.',
    '[
        {"id": 1, "title": "Introduction to Cloud DevOps Culture", "duration": "09:15"},
        {"id": 2, "title": "Continuous Integration Pipelines Explained", "duration": "13:40"},
        {"id": 3, "title": "Docker Container Basics & Commands", "duration": "16:10"},
        {"id": 4, "title": "Multi-stage Docker Build Optimizations", "duration": "15:50"},
        {"id": 5, "title": "Kubernetes Clusters and Pod Specifications", "duration": "20:30"},
        {"id": 6, "title": "ReplicaSets and Workload Scaling Rules", "duration": "17:40"},
        {"id": 7, "title": "Service Meshes and Traffic Shaping with Istio", "duration": "22:10"},
        {"id": 8, "title": "Deploying Web Apps to Vercel Serverless Platform", "duration": "14:25"}
    ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    videos = EXCLUDED.videos;
