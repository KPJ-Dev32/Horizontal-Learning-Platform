import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppFooter from '../../components/AppFooter/AppFooter';
import Button from '../../components/Button/Button';
import styles from './ChangePassword.module.scss';
import eyeIcon from '../../assets/Combined Shape Copy 3.svg';
import captchaLogo from '../../assets/Captcha Image.png';
import accentBar from '../../assets/Rectangle 3 Copy 4.svg';

const ChangePassword = () => {
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('user_session') || 'null');
    const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const user = allUsers.find(u => u.email === session?.email) || null;
    if (!user) {
      navigate('/login');
    } else {
      setCurrentUser(user);
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!currentUser) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrorMsg('');
    setSuccessMsg('');
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCaptchaClick = () => {
    if (isVerified || isVerifying) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1000);
  };

  const hasMinChars = formData.newPassword.length >= 10;
  const hasUppercase = /[A-Z]/.test(formData.newPassword);
  const hasLowercase = /[a-z]/.test(formData.newPassword);
  const hasNumeric = /[0-9]/.test(formData.newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);
  const passwordsMatch = formData.newPassword.length > 0 && formData.newPassword === formData.confirmPassword;
  const isValidNewPassword = hasMinChars && hasUppercase && hasLowercase && hasNumeric && hasSpecial && passwordsMatch;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.currentPassword !== currentUser.password) {
      setErrorMsg('Current password is incorrect.');
      return;
    }
    if (formData.newPassword === currentUser.password) {
      setErrorMsg('New password must be different from the current password.');
      return;
    }
    if (!isValidNewPassword) {
      setErrorMsg('Please meet all password criteria.');
      return;
    }
    if (!isVerified) {
      setErrorMsg('Please verify you are not a robot first!');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const userIndex = existingUsers.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
      existingUsers[userIndex].password = formData.newPassword;
      localStorage.setItem('registered_users', JSON.stringify(existingUsers));
      
      const session = JSON.parse(localStorage.getItem('user_session') || '{}');
      if (session && session.email === currentUser.email) {
        session.password = formData.newPassword;
        localStorage.setItem('user_session', JSON.stringify(session));
      }

      setSuccessMsg('Password successfully changed! Redirecting...');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } else {
        setErrorMsg('User not found.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <AppHeader />
      <main className={styles.main}>
        <div className={styles.boxContent}>
          <button className={styles.closeBtn} onClick={() => navigate('/profile')}><span className={styles.closeX}>X</span> Close</button>
          
          <div className={styles.innerContent}>
            <div className={styles.accentContainer}>
              <img src={accentBar} alt="accent" className={styles.accentBarAsset} />
            </div>
            
            <h2 className={styles.title}>Change Password</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
               <div className={styles.inputGroup}>
                <label htmlFor="currentPassword">Current Password*</label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    id="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                  <button type="button" className={styles.eyeButton} onClick={() => setShowCurrent(!showCurrent)}>
                    <img src={eyeIcon} alt="visibility" className={styles.eyeIcon} />
                  </button>
                </div>
              </div>

              <div className={styles.passwordCriteria}>
                <p className={styles.criteriaTitle}>Password must contain:</p>
                <div className={styles.criteriaGrid}>
                  <div className={styles.criterion}>
                    <span className={`${styles.checkIcon} ${hasMinChars ? styles.valid : ''}`}></span>
                    minimum 10 characters
                  </div>
                  <div className={styles.criterion}>
                    <span className={`${styles.checkIcon} ${hasNumeric ? styles.valid : ''}`}></span>
                    1 numeric character
                  </div>
                  <div className={styles.criterion}>
                    <span className={`${styles.checkIcon} ${hasUppercase ? styles.valid : ''}`}></span>
                    1 uppercase letter
                  </div>
                  <div className={styles.criterion}>
                    <span className={`${styles.checkIcon} ${hasSpecial ? styles.valid : ''}`}></span>
                    1 special character (such as !, %, @, #)
                  </div>
                  <div className={styles.criterion}>
                    <span className={`${styles.checkIcon} ${hasLowercase ? styles.valid : ''}`}></span>
                    1 lowercase letter
                  </div>
                  <div className={styles.criterion}>
                    <span className={`${styles.checkIcon} ${passwordsMatch ? styles.valid : ''}`}></span>
                    Passwords match
                  </div>
                </div>
              </div>

              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="newPassword">New Password*</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                    />
                    <button type="button" className={styles.eyeButton} onClick={() => setShowNew(!showNew)}>
                      <img src={eyeIcon} alt="visibility" className={styles.eyeIcon} />
                    </button>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword">Confirm Password*</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button type="button" className={styles.eyeButton} onClick={() => setShowConfirm(!showConfirm)}>
                      <img src={eyeIcon} alt="visibility" className={styles.eyeIcon} />
                    </button>
                  </div>
                </div>
              </div>

              <div className={`${styles.recaptchaPlaceholder} ${isVerified ? styles.verified : ''}`} onClick={handleCaptchaClick}>
                <img src={captchaLogo} alt="captcha" className={styles.captchaLogo} />
                {isVerifying && <div className={styles.spinner}></div>}
                {isVerified && (
                  <div className={styles.verifiedTick}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="#2B73EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>

              {errorMsg && <p className={styles.errorMessage}>{errorMsg}</p>}
              {successMsg && <p className={styles.successMessage}>{successMsg}</p>}

              <Button type="submit" className={styles.submitBtn}>Submit</Button>
            </form>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default ChangePassword;
