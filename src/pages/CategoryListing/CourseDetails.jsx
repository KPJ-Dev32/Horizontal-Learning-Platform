import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppFooter from '../../components/AppFooter/AppFooter';
import Button from '../../components/Button/Button';
import styles from './CourseDetails.module.scss';
import { fetchCourse, markVideoWatched } from '../../utils/api';

import starIcon from '../../assets/Star.svg';
import successTick from '../../assets/Success Tick.svg';
import userAvatar from '../../assets/noun_User_3779059.svg';
import demoVideo from '../../assets/Demo Video.mp4';
import selectedStar from '../../assets/Selected Star.svg';

const EXAM_CTA_MAP = {
  'html-css': { cert: 'frontend', title: 'Frontend Architecture & HTML/CSS' },
  'backend-rest': { cert: 'sitecore', title: 'Sitecore DAM & Content Hub' },
  'devops-pipeline': { cert: 'devops', title: 'DevOps Infrastructure & Pipelines' }
};

// Dynamic playlist generator based on course title to make lectures unique and uneven
const generateCourseVideos = (title) => {
  const t = (title || "").toLowerCase();
  
  // Deterministic video count based on course keyword complexity
  let videoCount = 6; // default equal count
  if (t.includes("beginner") || t.includes("basic") || t.includes("intro") || t.includes("getting started")) {
    videoCount = 3; // less count
  } else if (t.includes("fundamentals") || t.includes("basics") || t.includes("principles")) {
    videoCount = 4; // less count
  } else if (t.includes("advanced") || t.includes("mastering") || t.includes("architecture") || t.includes("pipeline") || t.includes("concurrency") || t.includes("design patterns") || t.includes("complex")) {
    videoCount = 12; // way more count!
  } else if (t.includes("intermediate") || t.includes("practical") || t.includes("scaling")) {
    videoCount = 8; // more count!
  }

  const list = [];
  
  // Custom templates based on category keywords
  if (t.includes("html") || t.includes("css")) {
    const templates = [
      "Getting Started with HTML & CSS",
      "Semantic HTML5 Documents & Schemas",
      "CSS Grid Layout Architectures",
      "Flexbox Alignments and Box Model Rules",
      "Responsive Typography & Mobile Queries",
      "CSS Custom Variables and Local Scopes",
      "Modern Web Layout Sandbox Exercises",
      "Advanced CSS Selectors and Pseudo-classes",
      "Debugging Rendering Pipelines & Layout Shifts",
      "Web Accessibility Standards and ARIA Attributes",
      "CSS Grid vs Flexbox: Deep Architectural Tradeoffs",
      "Deploying and Validating Production HTML Pages"
    ];
    for (let i = 0; i < videoCount; i++) {
      const idx = i % templates.length;
      list.push({
        id: i + 1,
        title: videoCount > 5 ? templates[idx] : `${templates[idx]} (${title})`,
        duration: `${8 + (i * 2) % 15}:${(30 + i * 12) % 60 === 0 ? "00" : (30 + i * 12) % 60}`
      });
    }
  } else if (t.includes("javascript") || t.includes("js") || t.includes("ajax")) {
    const templates = [
      "Introduction to ES6 Javascript Syntax",
      "Variables, Primitive Types and References",
      "Understanding Callbacks and Functions",
      "Asynchronous JS with Ajax and Fetch",
      "Promises, Async/Await and Error Blocks",
      "DOM Traversal and Event Bubbling Systems",
      "Object-Oriented Javascript & Class Prototypes",
      "Modern ES Modules and Tree Shaking Rules",
      "Functional Programming and Array Iterations",
      "JavaScript Garbage Collection and Memory Profiles",
      "Building Highly Concurrent Dynamic Client Interfaces",
      "Securing Web Request Payloads against XSS Attacks"
    ];
    for (let i = 0; i < videoCount; i++) {
      const idx = i % templates.length;
      list.push({
        id: i + 1,
        title: videoCount > 5 ? templates[idx] : `${templates[idx]} (${title})`,
        duration: `${9 + (i * 3) % 12}:${(15 + i * 18) % 60 === 0 ? "00" : (15 + i * 18) % 60}`
      });
    }
  } else if (t.includes("python") || t.includes("node") || t.includes("django") || t.includes("spring") || t.includes("backend") || t.includes("sql") || t.includes("api")) {
    const templates = [
      "RESTful Backend Systems Design Fundamentals",
      "Server Routing and HTTP Request Lifecycle Protocols",
      "Middleware Schemas and CORS Configuration Handlers",
      "Database Normalization and Structured SQL Normal Forms",
      "Optimizing Query Indexing and Joining in PostgreSQL",
      "NoSQL Database Modeling with Dynamic MongoDB Documents",
      "Building Secured JWT Token Authentication Pipelines",
      "Hashing User Credentials with BCrypt Middleware Layers",
      "Writing Comprehensive Endpoint Tests using Postman",
      "Express/Node Scale Strategies & Event Loops",
      "Handling Relational Schema Migrations Safely in Production",
      "Secure API Gateway Implementations and Rate Limiters"
    ];
    for (let i = 0; i < videoCount; i++) {
      const idx = i % templates.length;
      list.push({
        id: i + 1,
        title: videoCount > 5 ? templates[idx] : `${templates[idx]} (${title})`,
        duration: `${10 + (i * 2) % 10}:${(20 + i * 15) % 60 === 0 ? "00" : (20 + i * 15) % 60}`
      });
    }
  } else if (t.includes("docker") || t.includes("kubernetes") || t.includes("devops") || t.includes("aws") || t.includes("ci/cd") || t.includes("terraform")) {
    const templates = [
      "DevOps Foundations: Core Automation Principles",
      "Docker Image Containerization and Multi-stage Layers",
      "Creating and Configuring Local Docker-Compose Networks",
      "Kubernetes Architecture: Master Nodes and Pod Specs",
      "ReplicaSets, Deployments and Service DNS Networking",
      "GitHub Actions Workflows for Continuous Integration",
      "Infrastructure as Code: Writing Terraform State Files",
      "Monitoring Infrastructure with Prometheus and Grafana Logs",
      "Deploying Scalable Containerized Clusters on AWS EKS",
      "Service Meshes: Traffic Shaking and Istio Configurations",
      "Zero-Downtime Rolling Update Deployments in Production",
      "Advanced Disaster Recovery and Cloud Backup Workflows"
    ];
    for (let i = 0; i < videoCount; i++) {
      const idx = i % templates.length;
      list.push({
        id: i + 1,
        title: videoCount > 5 ? templates[idx] : `${templates[idx]} (${title})`,
        duration: `${11 + (i * 3) % 9}:${(10 + i * 22) % 60 === 0 ? "00" : (10 + i * 22) % 60}`
      });
    }
  } else if (t.includes("qa") || t.includes("test") || t.includes("selenium") || t.includes("cypress")) {
    const templates = [
      "Quality Assurance Foundations: Standard Plan Schemas",
      "Manual vs Automated Assertions: Core Testing Matrix",
      "Writing Selenium Web Element Selector Test Suites",
      "Modern Front-end E2E Spec Testing with Cypress Tools",
      "Integration testing and API Verification Assertions",
      "Configuring Automated Tests inside CI/CD Build Pipelines",
      "Visual Regression Testing and Snapshot Validation Rules",
      "Load Testing Server Benchmarks with Dynamic JMeter Suites",
      "Reporting Code Coverage Logs and Bug Ticket Workflows",
      "Simulating High Concurrency Browser Interactions",
      "Behavior-Driven Development (BDD) with Cucumber Syntaxes",
      "Delivering ISO-Certified Compliant QA Release Audits"
    ];
    for (let i = 0; i < videoCount; i++) {
      const idx = i % templates.length;
      list.push({
        id: i + 1,
        title: videoCount > 5 ? templates[idx] : `${templates[idx]} (${title})`,
        duration: `${8 + (i * 2) % 14}:${(12 + i * 25) % 60 === 0 ? "00" : (12 + i * 25) % 60}`
      });
    }
  } else if (t.includes("design") || t.includes("ui") || t.includes("ux") || t.includes("figma")) {
    const templates = [
      "Visual Design Theory: Harmonic Color and Spacings",
      "Figma Essentials: Frames, Groups and Vector Toolpaths",
      "Typography Scale hierarchies and Main Fonts Mapping",
      "Wireframing User Flow Blueprints and Interactive Paths",
      "Dynamic Components, Variants and Auto-Layout in Figma",
      "High Fidelity Prototyping and Complex Motion Curves",
      "User Research methodologies and Persona Profile Models",
      "Design Systems: Building Reusable Style Tokens Guides",
      "Developer Handoff Workflows and CSS Styles Translation",
      "Conducting Accredited A/B User Testing Sessions",
      "Accessibility Standards: Contrast Ratios and Font Scaling",
      "Post-Launch Design Audits and Usability Improvement Logs"
    ];
    for (let i = 0; i < videoCount; i++) {
      const idx = i % templates.length;
      list.push({
        id: i + 1,
        title: videoCount > 5 ? templates[idx] : `${templates[idx]} (${title})`,
        duration: `${7 + (i * 4) % 11}:${(14 + i * 15) % 60 === 0 ? "00" : (14 + i * 15) % 60}`
      });
    }
  } else {
    // Generic Fallback
    const templates = [
      "Getting Started with the Technical Platform Essentials",
      "Core Sandboxing Concepts and Workspace Setups",
      "Practical Hands-on Lab Tutorials and Guidelines",
      "Scaling Service Architectures & Advanced Workflows",
      "Security Auditing Guidelines and Compliance Frameworks",
      "Final Accreditation Assessment & Next Certification Steps",
      "Optimizing Client Feedback Metrics and Performance Logs",
      "Deployment Strategies and Secure Production Releases"
    ];
    for (let i = 0; i < videoCount; i++) {
      const idx = i % templates.length;
      list.push({
        id: i + 1,
        title: videoCount > 5 ? templates[idx] : `${templates[idx]} (${title})`,
        duration: `${9 + (i * 2) % 8}:${(25 + i * 11) % 60 === 0 ? "00" : (25 + i * 11) % 60}`
      });
    }
  }
  
  return list;
};

const CourseDetails = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('id') || 'html-css';
    const courseTitleParam = searchParams.get('title');

    // React Data Loading States
    const [course, setCourse] = useState(null);
    const [watchedVideos, setWatchedVideos] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Feedback Ratings states
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [userFeedbacks, setUserFeedbacks] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    // Fetch user details for feedback attribution
    const session = JSON.parse(localStorage.getItem('user_session') || 'null');
    const [fullName, setFullName] = useState('User Profile');

    // 1. Fetch Course Playlist data and watched status on Mount
    useEffect(() => {
      let isMounted = true;
      
      async function loadCourseProgress() {
        try {
          setLoading(true);
          setError('');
          const data = await fetchCourse(courseId);
          
          if (isMounted) {
            const courseTitle = courseTitleParam ? decodeURIComponent(courseTitleParam) : data.course.title;
            data.course.title = courseTitle;
            data.course.description = `Master the core capabilities of ${courseTitle}. Learn from expert industry practitioners with hands-on labs, step-by-step guides, and accredited validation pathways.`;
            
            // 1. Generate customized playlist videos for this course
            const customVideos = generateCourseVideos(courseTitle);
            data.course.videos = customVideos;
            
            // 2. Query title-isolated unique local storage progress
            const progressKey = `progress_${courseId}_${courseTitle.replace(/\s+/g, '_')}`;
            const localProgress = JSON.parse(localStorage.getItem(progressKey) || 'null');
            
            if (localProgress) {
              setWatchedVideos(localProgress.watchedVideos || []);
              setCompleted(localProgress.completed || false);
            } else {
              setWatchedVideos([]);
              setCompleted(false);
            }

            // 3. Query title-isolated unique persistent feedbacks
            const feedbackKey = `feedbacks_${courseId}_${courseTitle.replace(/\s+/g, '_')}`;
            const cachedFeedbacks = JSON.parse(localStorage.getItem(feedbackKey) || 'null');
            
            if (cachedFeedbacks) {
              setUserFeedbacks(cachedFeedbacks);
            } else {
              // Seed custom initial reviews tailored specifically to this course title
              const seededFeedbacks = [
                {
                  id: 1,
                  name: "Amit Patel",
                  rating: 5,
                  date: "12 May 2026",
                  text: `Excellent course! The lectures on ${courseTitle} are extremely clear, structured, and contain highly practical industrial applications.`
                },
                {
                  id: 2,
                  name: "Sarah Jenkins",
                  rating: 4,
                  date: "04 May 2026",
                  text: `Very detailed and easy to follow. The sandbox assignments really helped cement the ${courseTitle} architectures.`
                }
              ];
              setUserFeedbacks(seededFeedbacks);
              localStorage.setItem(feedbackKey, JSON.stringify(seededFeedbacks));
            }

            setCourse(data.course);
            setCurrentVideoIdx(0); // Reset index to first lecture
          }
        } catch (err) {
          console.error("Error fetching course data:", err);
          if (isMounted) {
            setError(err.message || 'Failed to load course details.');
            // Route unauthorized sessions back to login automatically
            if (err.message.toLowerCase().includes('unauthorized') || err.message.toLowerCase().includes('session')) {
              navigate('/login');
            }
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }

      loadCourseProgress();

      // Retrieve full name for feedback matching
      const storedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const current = storedUsers.find(u => u.email === session?.email);
      if (current) {
        setFullName(`${current.firstName} ${current.lastName}`);
      }

      return () => {
        isMounted = false;
      };
    }, [courseId, courseTitleParam, navigate, session?.email]);

    // 2. Mark Video Watched action (isolated unique per course title)
    const handleMarkAsWatched = async (videoId) => {
      if (!course) return;
      
      const updatedWatched = watchedVideos.includes(videoId) 
        ? watchedVideos 
        : [...watchedVideos, videoId];
      
      const isCourseCompleted = updatedWatched.length >= course.videos.length;
      
      setWatchedVideos(updatedWatched);
      setCompleted(isCourseCompleted);

      // Save unique isolated progress per course title
      const progressKey = `progress_${courseId}_${course.title.replace(/\s+/g, '_')}`;
      localStorage.setItem(progressKey, JSON.stringify({
        watchedVideos: updatedWatched,
        completed: isCourseCompleted
      }));

      try {
        // Keep backend in sync for primary course database tables
        await markVideoWatched(course.id, videoId);
      } catch (err) {
        console.error("Failed to sync backend watched status:", err);
      }
    };

    // 3. Submit Feedbacks (persist permanently unique to this course title)
    const handleSubmitFeedback = () => {
        if (rating === 0 || comment.trim() === '') return;

        const newFeedback = {
            id: Date.now(),
            name: fullName || 'Anonymous User',
            rating: rating,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            text: comment
        };

        const updatedFeedbacks = [newFeedback, ...userFeedbacks];
        setUserFeedbacks(updatedFeedbacks);
        
        // Save persistent array under dynamic course title
        const feedbackKey = `feedbacks_${courseId}_${course.title.replace(/\s+/g, '_')}`;
        localStorage.setItem(feedbackKey, JSON.stringify(updatedFeedbacks));

        setRating(0);
        setComment('');
        setShowSuccess(true);

        setTimeout(() => setShowSuccess(false), 5000);
    };

    if (loading) {
      return (
        <div className={styles.wrapper}>
          <AppHeader />
          <main className={styles.mainContent} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center', fontFamily: 'inherit' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2D2E', marginBottom: '10px' }}>Loading Course Modules...</div>
              <p style={{ color: '#6F6D6E' }}>Retrieving playlist resources from PostgreSQL database.</p>
            </div>
          </main>
          <AppFooter />
        </div>
      );
    }

    if (error || !course) {
      return (
        <div className={styles.wrapper}>
          <AppHeader />
          <main className={styles.mainContent} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center', maxWidth: '500px', padding: '20px' }}>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#B91C1C', marginBottom: '15px' }}>Access Error</div>
              <p style={{ color: '#4A4A4A', marginBottom: '25px', lineHeight: '1.6' }}>{error || 'Course not found or unauthorized session.'}</p>
              <Button onClick={() => navigate('/home')}>Return to Dashboard</Button>
            </div>
          </main>
          <AppFooter />
        </div>
      );
    }

    // Determine target exam details based on course
    const targetExam = EXAM_CTA_MAP[courseId] || { cert: 'frontend', title: 'Frontend Architecture' };

    return (
        <div className={styles.wrapper}>
            <AppHeader />

            <main className={styles.mainContent}>
                <div className={styles.centeredContainer}>

                    <div className={styles.breadcrumb}>
                        <Link to="/home" className={styles.linkHome}>Home</Link>
                        <span className={styles.linkSeparator}> | </span>
                        <Link to="/training" className={styles.linkHome}>Training</Link>
                        <span className={styles.linkSeparator}> | </span>
                        <span className={styles.linkActive}>{course.title}</span>
                    </div>

                    <h1 className={styles.pageTitle}>{course.title}</h1>

                    <p className={styles.bodyText}>{course.description}</p>

                    {/* Celebration / course complete notification banner */}
                    {completed && (
                      <div className={styles.celebrationBanner}>
                        <span className={styles.celebIcon}>🎉</span>
                        <div>
                          <h4 className={styles.celebTitle}>Course Fully Completed!</h4>
                          <p className={styles.celebText}>
                            Awesome job! You have watched all {course.videos.length} training lectures. You are now officially eligible to take the certification exam!
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Dynamic Split Player & Playlist Grid */}
                    <div className={styles.courseViewerLayout}>
                      
                      {/* Left: Video Player Pane */}
                      <div className={styles.playerPane}>
                        <div className={styles.videoContainer}>
                          <video 
                            src={demoVideo} 
                            controls 
                            key={currentVideoIdx}
                            autoPlay={false}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>

                        {/* Interactive Lecture controls bar */}
                        <div className={styles.videoControls}>
                          <div className={styles.videoTitleInfo}>
                            <h4>Lecture {currentVideoIdx + 1}: {course.videos[currentVideoIdx].title}</h4>
                            <span>⏱ Lecture Duration: {course.videos[currentVideoIdx].duration}</span>
                          </div>
                          
                          {watchedVideos.includes(course.videos[currentVideoIdx].id) ? (
                            <div className={styles.watchedBadge}>
                              🛡 Lecture Completed ✓
                            </div>
                          ) : (
                            <Button 
                              onClick={() => handleMarkAsWatched(course.videos[currentVideoIdx].id)}
                              className={styles.watchBtn}
                            >
                              Mark as Watched
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Right: Scrollable Playlist Sidebar */}
                      <div className={styles.playlistPane}>
                        <h4 className={styles.playlistHeader}>Course Lectures ({course.videos.length})</h4>
                        <div className={styles.playlistItemsList}>
                          {course.videos.map((lecture, idx) => {
                            const isActive = currentVideoIdx === idx;
                            const isWatched = watchedVideos.includes(lecture.id);

                            return (
                              <div 
                                key={lecture.id} 
                                className={`${styles.playlistItemCard} ${isActive ? styles.activeItem : ''}`}
                                onClick={() => setCurrentVideoIdx(idx)}
                              >
                                <span className={styles.itemIndex}>{idx + 1}</span>
                                <div className={styles.itemDetails}>
                                  <span className={styles.itemTitle}>{lecture.title}</span>
                                  <span className={styles.itemDuration}>⏱ {lecture.duration}</span>
                                </div>
                                {isWatched && <span className={styles.watchedCheck}>✓</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    <p className={styles.bodyText}>
                        This training course provides high-converting skills mapped directly to industry leading standards. Watch all videos, take detailed notes, and practice inside the local sandboxes. Upon finishing the module, challenge yourself with the accredited quiz to demonstrate capability alignment!
                    </p>

                    {/* CTA Box for taking Exam (Only unlocked / useful if course completed) */}
                    <div className={styles.ctaBox} style={{ margin: '45px 0', padding: '30px', background: '#F8FAFC', border: '1px solid #ECECEC', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2F2D2E', marginBottom: '8px', fontFamily: 'inherit' }}>
                              Test your {course.title} knowledge!
                            </h3>
                            <p style={{ fontSize: '14px', color: '#6F6D6E', margin: 0 }}>
                              {completed 
                                ? '🎉 You are eligible! Take the certification exam now and earn your horizontal specialist badge.' 
                                : '🔒 Locked: You must watch all training playlist videos above to unlock the formal accreditation.'}
                            </p>
                        </div>
                        <Button 
                          onClick={() => navigate(`/exams?cert=${targetExam.cert}&title=${encodeURIComponent(course.title)}`)} 
                          style={{ 
                            padding: '14px 28px', 
                            backgroundColor: completed ? '#7FC3BA' : '#CBD5E1', 
                            borderColor: completed ? '#7FC3BA' : '#CBD5E1', 
                            color: completed ? '#2F2D2E' : '#94A3B8', 
                            fontWeight: 'bold',
                            cursor: completed ? 'pointer' : 'not-allowed'
                          }}
                          disabled={!completed}
                        >
                          {completed ? 'Begin Exam Now' : 'Locked (Finish Course)'}
                        </Button>
                    </div>

                    <hr className={styles.divider} />

                    {userFeedbacks.length > 0 && (
                        <section className={styles.feedbackListSection}>
                            <h2 className={styles.blockTitle}>Feedbacks</h2>
                            <div className={styles.feedbacksContainer}>
                                {userFeedbacks.map(fb => (
                                    <div key={fb.id} className={styles.feedbackItem}>
                                        <div className={styles.fbHeader}>
                                            <img src={userAvatar} alt="" className={styles.fbAvatar} style={{ filter: 'none' }} />
                                            <div className={styles.fbUserMeta}>
                                                <h4 className={styles.fbUserName}>{fb.name}</h4>
                                                <div className={styles.fbStars}>
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <img
                                                            key={s}
                                                            src={fb.rating >= s ? selectedStar : starIcon}
                                                            alt=""
                                                            className={styles.fbStar}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className={styles.fbDate}>Reviewed on {fb.date}</p>
                                        <p className={styles.fbBody}>{fb.text}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className={styles.feedbackSection}>
                        {showSuccess && (
                            <div className={styles.successMessage} style={{ marginBottom: '40px' }}>
                                <div className={styles.successHeader}>
                                    <img src={successTick} alt="" className={styles.successIcon} />
                                    <h2 className={styles.successTitle}>Feedback submitted - Thank you!</h2>
                                </div>
                                <p className={styles.successSub}>Thank you for your valuable input. It has been successfully posted to our records.</p>
                            </div>
                        )}

                        <h2 className={styles.blockTitle} style={{ fontSize: '24px' }}>Submit your Feedback</h2>
                        <textarea
                            className={styles.feedbackArea}
                            placeholder="Share your thoughts about this training module..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className={styles.ratingRow}>
                            <span>Your Rating:</span>
                            <div className={styles.stars}>
                                {[1, 2, 3, 4, 5].map(s => (
                                    <img
                                        key={s}
                                        src={rating >= s ? selectedStar : starIcon}
                                        alt=""
                                        className={styles.star}
                                        onClick={() => setRating(s)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={styles.btnRow}>
                            <Button className={styles.submitBtn} onClick={handleSubmitFeedback}>Submit</Button>
                            <button className={styles.cancelBtn} onClick={() => { setComment(''); setRating(0); }}>Cancel</button>
                        </div>
                    </section>
                </div>
            </main>

            <AppFooter />
        </div>
    );
};

export default CourseDetails;
