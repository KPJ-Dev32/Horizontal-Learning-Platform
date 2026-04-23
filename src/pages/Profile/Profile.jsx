import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppFooter from '../../components/AppFooter/AppFooter';
import styles from './Profile.module.scss';
import accentBar from '../../assets/Rectangle 3 Copy 4.svg';
import editProfileIcon from '../../assets/Edit Profile.svg';

const Profile = () => {
  const navigate = useNavigate();

  const session = JSON.parse(localStorage.getItem('user_session') || 'null');
  const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
  const currentUser = allUsers.find(u => u.email?.toLowerCase() === session?.email?.toLowerCase()) || {};

  const fullName = currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : "Not provided";
  const deptMap = { hr: "HR", eng: "Engineering", mkt: "Marketing", fin: "Finance" };
  const departmentDisplay = deptMap[currentUser.department] || currentUser.department || "Not provided";
  const roleDisplay = currentUser.role || "Not provided";
  const passwordStr = currentUser.password ? '*'.repeat(currentUser.password.length) : "**********";
  const emailDisplay = currentUser.email || "Not provided";
  const mobileDisplay = currentUser.phone || "Not provided";

  const formatDisplayDate = (dateStr) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
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

            <h1 className={styles.pageTitle}>My Profile</h1>

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
                    <span className={styles.infoValue}>{passwordStr}</span>
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

                {currentUser.certifications && currentUser.certifications.length > 0 ? (
                  currentUser.certifications.map((cert, i) => (
                    <div key={i} className={styles.certEntry}>
                      <h4 className={styles.certName}>{cert.name}</h4>
                      <span className={styles.certDateBadge}>Date : {formatDisplayDate(cert.date)}</span>
                    </div>
                  ))
                ) : (
                  <p className={styles.infoValue}>No certifications added yet.</p>
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
