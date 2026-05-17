import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppFooter from '../../components/AppFooter/AppFooter';
import styles from './Profile.module.scss';
import accentBar from '../../assets/Rectangle 3 Copy 4.svg';
import editProfileIcon from '../../assets/Edit Profile.svg';
import { fetchProfile } from '../../utils/api';

const Profile = () => {
  const navigate = useNavigate();

  // Full-stack API State
  const [profile, setProfile] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch Profile and Certifications from PostgreSQL on mount
  useEffect(() => {
    let isMounted = true;

    async function loadProfileData() {
      try {
        setLoading(true);
        const data = await fetchProfile();
        
        if (isMounted) {
          setProfile(data.user);
          setCertifications(data.certifications);
        }

        // Secondary cache sync to maintain backward compatibility for other parts of the site
        const localSession = JSON.parse(localStorage.getItem('user_session') || '{}');
        const localUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        
        const updatedUsers = localUsers.map(u => {
          if (u.email?.toLowerCase() === data.user.email?.toLowerCase()) {
            return {
              ...u,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              phone: data.user.phone,
              role: data.user.role,
              department: data.user.department,
              avatarUrl: data.user.avatarUrl,
              certifications: data.certifications
            };
          }
          return u;
        });

        localStorage.setItem('registered_users', JSON.stringify(updatedUsers));
      } catch (err) {
        console.error("Profile load failed:", err);
        if (isMounted) {
          setError(err.message || 'Failed to retrieve profile.');
          // Gracefully boot out sessions that are expired or invalid
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

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <AppHeader />
        <main className={styles.main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center', fontFamily: 'inherit' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2D2E', marginBottom: '10px' }}>Loading Profile Details...</div>
            <p style={{ color: '#6F6D6E' }}>Accessing secure database credentials in PostgreSQL.</p>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={styles.wrapper}>
        <AppHeader />
        <main className={styles.main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center', maxWidth: '500px', padding: '20px' }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#B91C1C', marginBottom: '15px' }}>Access Blocked</div>
            <p style={{ color: '#4A4A4A', marginBottom: '25px', lineHeight: '1.6' }}>{error || 'Unable to retrieve employee profile.'}</p>
            <button onClick={() => navigate('/login')} style={{ padding: '12px 24px', backgroundColor: '#2F2D2E', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Proceed to Login
            </button>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || "Not provided";
  const deptMap = { hr: "HR", eng: "Engineering", mkt: "Marketing", fin: "Finance" };
  const departmentDisplay = deptMap[profile.department] || profile.department || "Not provided";
  const roleDisplay = profile.role || "Not provided";
  const emailDisplay = profile.email || "Not provided";
  const mobileDisplay = profile.phone || "Not provided";
  const avatarUrl = profile.avatarUrl;

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    if (!dateStr.includes('-') && dateStr.includes('T')) {
      // Handles full ISO formats
      dateStr = dateStr.split('T')[0];
    }
    if (!dateStr.includes('-')) return dateStr;
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className={styles.wrapper}>
      <AppHeader />

      <main className={styles.main}>
        <div className={styles.profileContainer}>
          <div className={styles.profileContentWrapper}>
            <div className={styles.editProfileContainer}>
              <button className={styles.editProfileBtn} onClick={() => navigate('/edit-profile')}>
                <img src={editProfileIcon} alt="edit" className={styles.pencilIcon} />
                <span>Edit Profile</span>
              </button>
              <div className={styles.lineWrapper}>
                <svg width="80" height="3" viewBox="0 0 82 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.499996 0.5H80.5443" stroke="#2F2D2E" strokeLinecap="square" />
                </svg>
              </div>
            </div>

            <div className={styles.accentContainer}>
              <img src={accentBar} alt="accent" className={styles.accentBarAsset} />
            </div>

            {/* Premium Circular Avatar Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: '#7FC3BA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '34px',
                fontWeight: 'bold',
                color: '#2F2D2E',
                border: '3px solid #2F2D2E',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
              }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  profile.firstName ? profile.firstName.charAt(0).toUpperCase() : 'U'
                )}
              </div>
              <div>
                <h1 className={styles.pageTitle} style={{ margin: 0, paddingBottom: 0 }}>My Profile</h1>
                <p style={{ margin: '6px 0 0 0', color: '#6F6D6E', fontSize: '14px', fontFamily: 'inherit', fontWeight: '600' }}>
                  Professional ID: #00{profile.id} • Authorized Session
                </p>
              </div>
            </div>

            <div className={styles.sectionsWrapper}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Personal Information</h2>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Full Name</span>
                  <div className={styles.infoValueWrapper}>
                    <span className={styles.infoValue}>{fullName}</span>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Department</span>
                  <div className={styles.infoValueWrapper}>
                    <span className={styles.infoValue}>{departmentDisplay}</span>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Role</span>
                  <div className={styles.infoValueWrapper}>
                    <span className={styles.infoValue}>{roleDisplay}</span>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Contact Information</h2>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Password</span>
                  <div className={styles.infoValueWrapper}>
                    <span className={styles.infoValue}>••••••••••••</span>
                    <button className={styles.changeBtn} onClick={() => navigate('/change-password')}>Change</button>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email Address</span>
                  <div className={styles.infoValueWrapper}>
                    <span className={styles.infoValue}>{emailDisplay}</span>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Mobile Number</span>
                  <div className={styles.infoValueWrapper}>
                    <span className={styles.infoValue}>{mobileDisplay}</span>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Certification</h2>

                {certifications && certifications.length > 0 ? (
                  certifications.map((cert, i) => {
                    const name = cert.name.toLowerCase();
                    let theme = { primary: '#FBBF24', secondary: '#2E2D2E', title: 'SITECORE' };
                    let gradId = 'sitecoreGradProfile';

                    if (name.includes('frontend') || name.includes('html')) {
                      theme = { primary: '#7FC3BA', secondary: '#2E2D2E', title: 'FRONTEND' };
                      gradId = 'frontendGradProfile';
                    } else if (name.includes('devops') || name.includes('pipeline')) {
                      theme = { primary: '#C084FC', secondary: '#2E2D2E', title: 'DEVOPS' };
                      gradId = 'devopsGradProfile';
                    }

                    return (
                      <div key={i} className={styles.certEntry}>
                        <svg width="60" height="60" viewBox="0 0 200 200" style={{ marginRight: '20px', flexShrink: 0, overflow: 'visible' }}>
                          <defs>
                            <linearGradient id="frontendGradProfile" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#7FC3BA" />
                              <stop offset="100%" stopColor="#4E9C92" />
                            </linearGradient>
                            <linearGradient id="devopsGradProfile" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#C084FC" />
                              <stop offset="100%" stopColor="#7C3AED" />
                            </linearGradient>
                            <linearGradient id="sitecoreGradProfile" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#FBBF24" />
                              <stop offset="100%" stopColor="#D97706" />
                            </linearGradient>
                          </defs>
                          <circle cx="100" cy="100" r="90" fill="none" stroke={theme.primary} strokeWidth="6" />
                          <circle cx="100" cy="100" r="85" fill={theme.secondary} />
                          <circle cx="100" cy="100" r="60" fill={`url(#${gradId})`} />
                          <text x="100" y="90" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" letterSpacing="0.8">
                            {theme.title}
                          </text>
                          <text x="100" y="115" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" letterSpacing="0.5">
                            SPECIALIST
                          </text>
                        </svg>
                        <div className={styles.certDetails}>
                          <h4 className={styles.certName}>{cert.name}</h4>
                          <span className={styles.certDateBadge}>Date : {formatDisplayDate(cert.date)}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className={styles.infoValue}>No certifications earned yet. Complete dynamic training modules to unlock credentials!</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default Profile;
