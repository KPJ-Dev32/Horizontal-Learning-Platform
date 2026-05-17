import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppFooter from '../../components/AppFooter/AppFooter';
import Button from '../../components/Button/Button';
import styles from './GrowthHub.module.scss';
import accentBar from '../../assets/Rectangle 3 Copy 4.svg';

const SKILLS = ['Frontend', 'Backend', 'DevOps', 'QA', 'Design'];

// Coordinate constants for 5-axis Radar SVG
const centerX = 150;
const centerY = 150;
const radius = 110;

// Angle calculations
const getCoordinatesForValue = (index, value) => {
  const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
  const valRad = (value / 100) * radius;
  return {
    x: centerX + valRad * Math.cos(angle),
    y: centerY + valRad * Math.sin(angle),
  };
};

const GrowthHub = () => {
  const navigate = useNavigate();

  // Load session & user certifications
  const session = JSON.parse(localStorage.getItem('user_session') || 'null');
  const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
  const currentUser = allUsers.find(u => u.email === session?.email) || {};
  const currentCerts = currentUser.certifications || [];

  // Determine current skills based on department
  const initialDept = currentUser.department || 'eng';
  const defaultPrimary = useMemo(() => {
    if (initialDept === 'eng') return 'Frontend';
    if (initialDept === 'hr') return 'QA';
    if (initialDept === 'mkt') return 'Design';
    return 'Backend';
  }, [initialDept]);

  // Primary & Target selection states
  const [primaryRole, setPrimaryRole] = useState(defaultPrimary);
  const [targetRole, setTargetRole] = useState('DevOps');
  const [showRoadmap, setShowRoadmap] = useState(true);
  const [visualMode, setVisualMode] = useState('bars'); // 'bars' or 'radar'

  // Persistence: User Enrollment state
  const [enrolledTrack, setEnrolledTrack] = useState(currentUser.enrolledTrack || null);

  // Sync state if selections change or database loads
  useEffect(() => {
    if (currentUser.enrolledTrack) {
      setEnrolledTrack(currentUser.enrolledTrack);
      setPrimaryRole(currentUser.enrolledTrack.primary);
      setTargetRole(currentUser.enrolledTrack.target);
    }
  }, [currentUser.enrolledTrack]);

  // Simulation parameters for projected growth
  const [studyHours, setStudyHours] = useState(6); // range 2 to 20
  const [studyMonths, setStudyMonths] = useState(3); // range 1 to 6

  // Proficiencies base calculation
  const proficiencies = useMemo(() => {
    const base = {
      Frontend: 25,
      Backend: 20,
      DevOps: 15,
      QA: 30,
      Design: 20
    };

    if (primaryRole) {
      base[primaryRole] = 85;
    }

    currentCerts.forEach(cert => {
      const name = cert.name.toLowerCase();
      if (name.includes('sitecore') || name.includes('backend')) {
        base.Backend = Math.max(base.Backend, 75);
      }
      if (name.includes('frontend') || name.includes('html') || name.includes('css')) {
        base.Frontend = Math.max(base.Frontend, 80);
      }
      if (name.includes('devops') || name.includes('pipeline')) {
        base.DevOps = Math.max(base.DevOps, 80);
      }
    });

    if (targetRole && base[targetRole] < 45) {
      base[targetRole] = 45;
    }

    return base;
  }, [primaryRole, targetRole, currentCerts]);

  // Calculate dynamic simulator values for target specialty
  const projectedTargetValue = useMemo(() => {
    const currentVal = proficiencies[targetRole] || 20;
    // Growth multiplier: 0.6 per hour/month study unit
    const growth = studyHours * studyMonths * 0.65;
    return Math.min(95, Math.round(currentVal + growth));
  }, [proficiencies, targetRole, studyHours, studyMonths]);

  // Dynamic secondary path milestones
  const pathMilestones = useMemo(() => {
    const key = `${primaryRole}->${targetRole}`;
    
    const paths = {
      'Frontend->DevOps': [
        {
          id: 'html-css',
          title: 'HTML & CSS Fundamentals',
          type: 'Course',
          status: 'Completed',
          desc: 'Primary core course in web layout and document structures.',
          link: '/course-details?id=html-css'
        },
        {
          id: 'sitecore-dam',
          title: 'Sitecore DAM & Content Hub Implementation',
          type: 'Certification',
          status: currentCerts.some(c => c.name.toLowerCase().includes('sitecore')) ? 'Completed' : 'In Progress',
          desc: 'Intermediate course covering asset schemas and BPM workflows.',
          link: '/certification-details'
        },
        {
          id: 'devops-cert',
          title: 'DevOps Pipelines & Infrastructure Certification',
          type: 'Exam',
          status: currentCerts.some(c => c.name.toLowerCase().includes('devops')) ? 'Completed' : 'Locked',
          desc: 'Final milestone: Take the horizontal DevOps CI/CD exam to unlock certification.',
          link: '/exams?cert=devops'
        }
      ],
      'Frontend->Backend': [
        {
          id: 'html-css',
          title: 'HTML & CSS Fundamentals',
          type: 'Course',
          status: 'Completed',
          desc: 'Primary core course in web layouts and responsive design.',
          link: '/course-details?id=html-css'
        },
        {
          id: 'backend-rest',
          title: 'RESTful API & Database Architecture',
          type: 'Course',
          status: 'In Progress',
          desc: 'Learn Node.js, Express, and modern PostgreSQL schema designs.',
          link: '/course-details?id=backend-rest'
        },
        {
          id: 'sitecore-dam',
          title: 'Sitecore DAM Professional Certification',
          type: 'Exam',
          status: currentCerts.some(c => c.name.toLowerCase().includes('sitecore')) ? 'Completed' : 'Locked',
          desc: 'Backend milestone: Master the Sitecore DAM Hub integration patterns.',
          link: '/exams?cert=sitecore'
        }
      ],
      'Backend->Frontend': [
        {
          id: 'backend-base',
          title: 'RESTful API Fundamentals',
          type: 'Course',
          status: 'Completed',
          desc: 'Core backend knowledge: APIs, Routing, and DB connections.',
          link: '/course-details?id=backend-rest'
        },
        {
          id: 'html-css-course',
          title: 'Web Development Basic - HTML',
          type: 'Course',
          status: 'In Progress',
          desc: 'Deep dive into standard layouts and document structures.',
          link: '/course-details?id=html-css'
        },
        {
          id: 'frontend-cert',
          title: 'Modern Frontend & HTML/CSS Certification',
          type: 'Exam',
          status: currentCerts.some(c => c.name.toLowerCase().includes('frontend')) ? 'Completed' : 'Locked',
          desc: 'Take the Frontend exam to earn your horizontal developer badge.',
          link: '/exams?cert=frontend'
        }
      ]
    };

    return paths[key] || [
      {
        id: 'intro',
        title: `Introduction to ${targetRole}`,
        type: 'Course',
        status: 'In Progress',
        desc: `Getting started with horizontal domain crossover in ${targetRole}.`,
        link: '/training'
      },
      {
        id: 'exam',
        title: `${targetRole} Crossover Certification`,
        type: 'Exam',
        status: 'Locked',
        desc: `Pass the ${targetRole} exam to successfully validate horizontal proficiency.`,
        link: '/exams'
      }
    ];
  }, [primaryRole, targetRole, currentCerts]);

  // Active Radar String Points
  const radarPointsString = useMemo(() => {
    return SKILLS.map((skill, index) => {
      const val = proficiencies[skill];
      const coords = getCoordinatesForValue(index, val);
      return `${coords.x},${coords.y}`;
    }).join(' ');
  }, [proficiencies]);

  // Projected Radar Area (with simulator boost on Target specialty)
  const projectedPointsString = useMemo(() => {
    return SKILLS.map((skill, index) => {
      const val = skill === targetRole ? projectedTargetValue : proficiencies[skill];
      const coords = getCoordinatesForValue(index, val);
      return `${coords.x},${coords.y}`;
    }).join(' ');
  }, [proficiencies, targetRole, projectedTargetValue]);

  // coordinate concentric grids
  const gridPentagons = [30, 60, 90, 100].map(level => {
    return SKILLS.map((_, index) => {
      const coords = getCoordinatesForValue(index, level);
      return `${coords.x},${coords.y}`;
    }).join(' ');
  });

  // completion percentage
  const completionPercentage = useMemo(() => {
    const completedCount = pathMilestones.filter(m => m.status === 'Completed').length;
    return Math.round((completedCount / pathMilestones.length) * 100);
  }, [pathMilestones]);

  // Persistent enrollment lock handler
  const handleEnrollInTrack = () => {
    const updatedUsers = allUsers.map(u => {
      if (u.email === currentUser.email) {
        return {
          ...u,
          enrolledTrack: { primary: primaryRole, target: targetRole }
        };
      }
      return u;
    });

    localStorage.setItem('registered_users', JSON.stringify(updatedUsers));
    setEnrolledTrack({ primary: primaryRole, target: targetRole });
  };

  const handleDisenrollTrack = () => {
    const updatedUsers = allUsers.map(u => {
      if (u.email === currentUser.email) {
        const copy = { ...u };
        delete copy.enrolledTrack;
        return copy;
      }
      return u;
    });

    localStorage.setItem('registered_users', JSON.stringify(updatedUsers));
    setEnrolledTrack(null);
  };

  // Dynamic Corporate Mentors list based on selected target role
  const recommendedMentors = useMemo(() => {
    const pool = {
      DevOps: [
        { name: 'Khushboo Sonkar', role: 'DevOps Solutions Architect', certs: '3 Certifications', avatar: 'KS' },
        { name: 'Ajay Tejavath', role: 'Principal Cloud Systems Lead', certs: '4 Certifications', avatar: 'AT' }
      ],
      Backend: [
        { name: 'Ajay Tejavath', role: 'Lead Backend Developer', certs: '5 Certifications', avatar: 'AT' },
        { name: 'Gautam Pandey', role: 'Enterprise Database Manager', certs: '3 Certifications', avatar: 'GP' }
      ],
      Frontend: [
        { name: 'Gautam Pandey', role: 'Lead UX Specialist & UI Dev', certs: '4 Certifications', avatar: 'GP' },
        { name: 'Khushboo Sonkar', role: 'Senior React Developer', certs: '3 Certifications', avatar: 'KS' }
      ],
      QA: [
        { name: 'Ajay Tejavath', role: 'Software Development Lead in Test', certs: '2 Certifications', avatar: 'AT' }
      ],
      Design: [
        { name: 'Khushboo Sonkar', role: 'Corporate Brand Creative Director', certs: '4 Certifications', avatar: 'KS' }
      ]
    };
    return pool[targetRole] || pool.DevOps;
  }, [targetRole]);

  return (
    <div className={styles.wrapper}>
      <AppHeader />

      <main className={styles.mainContent}>
        <div className={styles.centeredContainer}>
          
          <div className={styles.breadcrumb}>
            <Link to="/home" className={styles.linkHome}>Home</Link>
            <span className={styles.linkSeparator}> | </span>
            <span className={styles.linkActive}>Horizontal Growth Hub</span>
          </div>

          <div className={styles.headerBlock}>
            <img src={accentBar} alt="accent" className={styles.accentBar} />
            <h1 className={styles.pageTitle}>Horizontal Growth Hub</h1>
            <p className={styles.pageSubtitle}>
              Empowering professional flexibility. Assess your cross-functional capability, simulate study plans, lock goals, and connect with corporate mentors.
            </p>
          </div>

          {/* Simple How It Works Guide Banner */}
          <div className={styles.howItWorksBanner}>
            <span className={styles.bannerIcon}>💡</span>
            <div className={styles.bannerContent}>
              <h3>How Horizontal Growth Hub Works</h3>
              <p>
                Switching specialties expands your versatility! Simply: 
                <strong> 1. Select your current field</strong>, 
                <strong> 2. Choose your target domain crossover</strong>, 
                <strong> 3. Complete the recommended courses</strong>, and 
                <strong> 4. Pass the exam</strong> to unlock horizontal certification and connect with corporate mentors.
              </p>
            </div>
          </div>

          {/* Interactive Role Trajectory Matrix Selector */}
          <section className={styles.matrixSelectorSection}>
            <div className={styles.glassCard}>
              <div className={styles.matrixHeaderRow}>
                <div>
                  <h2 className={styles.cardHeading} style={{ margin: 0 }}>Trajectory Planner & Enrollment</h2>
                  <p className={styles.cardDesc} style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#6B7280' }}>
                    Select your starting field and crossover target to instantly map your learning trajectory.
                  </p>
                </div>
                {enrolledTrack && (
                  <div className={styles.activeTrackBadge}>
                    ⚡ Enrolled Track: {enrolledTrack.primary} ➔ {enrolledTrack.target}
                  </div>
                )}
              </div>
              
              <div className={styles.visualPillSelector}>
                <div className={styles.selectorBlock}>
                  <h4>Select Your Current Field:</h4>
                  <div className={styles.pillContainer}>
                    {SKILLS.map(skill => {
                      const isActive = primaryRole === skill;
                      return (
                        <button
                          key={skill}
                          onClick={() => {
                            if (enrolledTrack) return;
                            setPrimaryRole(skill);
                            if (skill === targetRole) {
                              setTargetRole(SKILLS.find(s => s !== skill));
                            }
                          }}
                          className={`${styles.pillBtn} ${isActive ? styles.pillActive : ''}`}
                          disabled={!!enrolledTrack}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.selectorConnector}>
                  <span>➔</span>
                </div>

                <div className={styles.selectorBlock}>
                  <h4>Select Crossover Goal:</h4>
                  <div className={styles.pillContainer}>
                    {SKILLS.map(skill => {
                      const isActive = targetRole === skill;
                      const isPrimary = primaryRole === skill;
                      return (
                        <button
                          key={skill}
                          onClick={() => {
                            if (enrolledTrack) return;
                            setTargetRole(skill);
                          }}
                          className={`${styles.pillBtn} ${isActive ? styles.pillActiveTarget : ''}`}
                          disabled={isPrimary || !!enrolledTrack}
                          style={{
                            opacity: isPrimary ? 0.35 : 1,
                            cursor: isPrimary ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {skill} Specialist
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={styles.btnRow}>
                {!enrolledTrack ? (
                  <Button onClick={handleEnrollInTrack} className={`${styles.plannerBtn} ${styles.primaryBtn}`}>
                    🔒 Lock Target Goal & Enroll in Track
                  </Button>
                ) : (
                  <Button onClick={handleDisenrollTrack} className={`${styles.plannerBtn} ${styles.dangerBtn}`}>
                    🔓 Modify Track Selection
                  </Button>
                )}
                <Button onClick={() => setShowRoadmap(p => !p)} className={`${styles.plannerBtn} ${styles.outlineBtn}`}>
                  {showRoadmap ? 'Hide Roadmap' : 'Show Roadmap'}
                </Button>
              </div>
            </div>
          </section>

          {/* Dashboard Layout columns */}
          <div className={styles.dashboardLayout}>
            
            {/* Visual Column */}
            <div className={styles.chartCol}>
              
              {/* Dynamic Competency Matrix Card */}
              <div className={styles.glassCard} style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '15px' }}>
                  <div>
                    <h2 className={styles.cardTitle} style={{ margin: 0 }}>Skill Progression & Competency</h2>
                    <p className={styles.cardDesc} style={{ margin: '4px 0 0 0' }}>Visualizing active competency vs projected growth.</p>
                  </div>
                  
                  <div className={styles.toggleRow}>
                    <button 
                      className={`${styles.toggleBtn} ${visualMode === 'bars' ? styles.toggleActive : ''}`} 
                      onClick={() => setVisualMode('bars')}
                    >
                      📊 Skill Bars
                    </button>
                    <button 
                      className={`${styles.toggleBtn} ${visualMode === 'radar' ? styles.toggleActive : ''}`} 
                      onClick={() => setVisualMode('radar')}
                    >
                      🕸️ Radar Web
                    </button>
                  </div>
                </div>
                
                {visualMode === 'bars' ? (
                  <div className={styles.skillBarsContainer}>
                    {SKILLS.map(skill => {
                      const val = proficiencies[skill];
                      const isTarget = skill === targetRole;
                      const projVal = isTarget ? projectedTargetValue : val;
                      
                      return (
                        <div key={skill} className={styles.skillBarRow}>
                          <div className={styles.skillBarLabel}>
                            <span className={styles.skillName} style={{ fontWeight: skill === primaryRole || isTarget ? '800' : '500' }}>
                              {skill} {skill === primaryRole && ' (Primary)'} {isTarget && ' (Target)'}
                            </span>
                            <span className={styles.skillScore}>
                              {val}% {isTarget && `➔ Projected ${projVal}%`}
                            </span>
                          </div>
                          
                          <div className={styles.progressBarBg}>
                            {isTarget && (
                              <div 
                                className={styles.progressBarProjectedFill} 
                                style={{ width: `${projVal}%` }}
                              />
                            )}
                            <div 
                              className={styles.progressBarFill} 
                              style={{ width: `${val}%`, background: skill === primaryRole ? 'linear-gradient(90deg, #7FC3BA, #449c90)' : 'linear-gradient(90deg, #94A3B8, #64748B)' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    <div className={styles.radarWrapper}>
                      <svg viewBox="0 0 300 300" className={styles.radarSvg}>
                        {/* Concentric grid rings */}
                        {gridPentagons.map((points, idx) => (
                          <polygon 
                            key={idx} 
                            points={points} 
                            className={styles.radarGridLine} 
                          />
                        ))}

                        {/* Grid axes */}
                        {SKILLS.map((_, index) => {
                          const coords = getCoordinatesForValue(index, 100);
                          return (
                            <line 
                              key={index} 
                              x1={centerX} 
                              y1={centerY} 
                              x2={coords.x} 
                              y2={coords.y} 
                              className={styles.radarAxis}
                            />
                          );
                        })}

                        {/* Projected growth polygon overlay (Dashed) */}
                        <polygon 
                          points={projectedPointsString} 
                          className={styles.radarAreaProjected} 
                        />

                        {/* Filled base radar area */}
                        <polygon 
                          points={radarPointsString} 
                          className={styles.radarArea} 
                        />

                        {/* Labels and dots */}
                        {SKILLS.map((skill, index) => {
                          const val = proficiencies[skill];
                          const dotCoords = getCoordinatesForValue(index, val);
                          const textCoords = getCoordinatesForValue(index, 118);

                          let anchor = "middle";
                          if (textCoords.x < centerX - 10) anchor = "end";
                          if (textCoords.x > centerX + 10) anchor = "start";

                          return (
                            <g key={skill}>
                              <circle 
                                cx={dotCoords.x} 
                                cy={dotCoords.y} 
                                r="4.5" 
                                className={styles.radarPoint} 
                              />
                              <text 
                                x={textCoords.x} 
                                y={textCoords.y + 4} 
                                textAnchor={anchor} 
                                className={styles.radarLabel}
                              >
                                {skill} ({skill === targetRole ? `${val}% ➔ Projected ${projectedTargetValue}%` : `${val}%`})
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    <div className={styles.radarLegend}>
                      <div className={styles.legendBlock}>
                        <span className={styles.legendDotBase}></span>
                        <span className={styles.legendText}>Active Competency</span>
                      </div>
                      <div className={styles.legendBlock}>
                        <span className={styles.legendDotProj}></span>
                        <span className={styles.legendText}>Projected Trajectory</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Functional Study Commitment Simulator */}
              <div className={styles.glassCard} style={{ marginBottom: '30px' }}>
                <h2 className={styles.cardTitle}>Skill Crossover Simulator</h2>
                <p className={styles.cardDesc}>Drag sliders to calculate potential target capability gains based on study commitment.</p>
                
                <div className={styles.sliderGroupContainer}>
                  <div className={styles.simulatorSliderRow}>
                    <div className={styles.sliderLabelRow}>
                      <span className={styles.sliderLabelName}>Weekly Study Commitment</span>
                      <span className={styles.sliderLabelValue}>{studyHours} Hours/Week</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="20" 
                      value={studyHours} 
                      onChange={(e) => setStudyHours(Number(e.target.value))} 
                      className={styles.simRange}
                    />
                  </div>

                  <div className={styles.simulatorSliderRow}>
                    <div className={styles.sliderLabelRow}>
                      <span className={styles.sliderLabelName}>Plan Duration</span>
                      <span className={styles.sliderLabelValue}>{studyMonths} Months</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="6" 
                      value={studyMonths} 
                      onChange={(e) => setStudyMonths(Number(e.target.value))} 
                      className={styles.simRange}
                    />
                  </div>
                </div>

                <div className={styles.simulationFeedback}>
                  📈 Committing <strong>{studyHours} hours/week</strong> for <strong>{studyMonths} months</strong> will boost your <strong>{targetRole}</strong> competence from <strong>{proficiencies[targetRole]}%</strong> to <strong>{projectedTargetValue}%</strong>!
                </div>
              </div>

              {/* Dynamic Corporate Mentor Matcher */}
              <div className={styles.glassCard}>
                <h2 className={styles.cardTitle}>Internal Mentor Matcher</h2>
                <p className={styles.cardDesc}>Recommended peers in the company holding horizontal credentials in {targetRole}.</p>
                
                <div className={styles.mentorsGrid}>
                  {recommendedMentors.map((mentor, index) => (
                    <div key={index} className={styles.mentorCard}>
                      <div className={styles.mentorAvatar}>
                        {mentor.avatar}
                      </div>
                      <div className={styles.mentorDetails}>
                        <h4 className={styles.mentorName}>{mentor.name}</h4>
                        <p className={styles.mentorRole}>{mentor.role}</p>
                        <p className={styles.mentorCerts}>🏆 {mentor.certs} completed</p>
                      </div>
                      <a href={`mailto:${mentor.name.toLowerCase().replace(' ', '.')}@horizontal.com?subject=Horizontal Learning Mentorship request`} className={styles.connectLink}>
                        Connect
                      </a>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Pathway Column */}
            {showRoadmap && (
              <div className={styles.roadmapCol}>
                <div className={styles.glassCard}>
                  <div className={styles.roadmapHeader}>
                    <div>
                      <h2 className={styles.cardTitle}>Crossover Pathway: {primaryRole} ➔ {targetRole}</h2>
                      <p className={styles.cardDesc}>Complete these modules to unlock horizontal certification status.</p>
                    </div>
                    <div className={styles.progressCircleWrapper}>
                      <div className={styles.progressValue}>{completionPercentage}%</div>
                      <div className={styles.progressLabel}>Completed</div>
                    </div>
                  </div>

                  <div className={styles.timeline}>
                    {pathMilestones.map((milestone, idx) => {
                      const isCompleted = milestone.status === 'Completed';
                      const isInProgress = milestone.status === 'In Progress';
                      const isLocked = milestone.status === 'Locked';

                      return (
                        <div 
                          key={milestone.id} 
                          className={`${styles.timelineItem} ${isCompleted ? styles.completed : ''} ${isInProgress ? styles.inProgress : ''} ${isLocked ? styles.locked : ''}`}
                        >
                          <div className={styles.timelineBadge}>
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          
                          <div className={styles.timelineContent}>
                            <div className={styles.nodeMeta}>
                              <span className={`${styles.nodeType} ${styles[milestone.type.toLowerCase()]}`}>
                                {milestone.type}
                              </span>
                              <span className={`${styles.nodeStatus} ${styles[milestone.status.toLowerCase().replace(' ', '')]}`}>
                                {milestone.status}
                              </span>
                            </div>

                            <h3 className={styles.nodeTitle}>{milestone.title}</h3>
                            <p className={styles.nodeDesc}>{milestone.desc}</p>
                            
                            {!isLocked ? (
                              <Link to={milestone.link} className={styles.nodeLink}>
                                {isCompleted ? 'Review Content ➔' : isInProgress ? 'Resume Module ➔' : 'Start Exam ➔'}
                              </Link>
                            ) : (
                              <span className={styles.nodeLinkLocked}>🔒 Unlocks upon previous module completion</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default GrowthHub;
