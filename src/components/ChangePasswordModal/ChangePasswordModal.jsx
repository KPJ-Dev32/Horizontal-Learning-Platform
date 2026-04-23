import React, { useState } from 'react';
import styles from './ChangePasswordModal.module.scss';
import Button from '../Button/Button';
import eyeIcon from '../../assets/Combined Shape Copy 3.svg';
import captchaLogo from '../../assets/Captcha Image.png';
import accentBar from '../../assets/Rectangle 3 Copy 4.svg';

const ChangePasswordModal = ({ isOpen, onClose, currentUser }) => {
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

  if (!isOpen || !currentUser) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrorMsg('');
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

      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsVerified(false);
      onClose();
    } else {
      setErrorMsg('User not found.');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>Close <span className={styles.closeX}>X</span></button>

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
                  <path d="M20 6L9 17L4 12" stroke="#2B73EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>

          {errorMsg && <p className={styles.errorMessage}>{errorMsg}</p>}

          <Button type="submit" className={styles.submitBtn}>Submit</Button>
        </form>
      </div>
    </div>
  );
};
export default ChangePasswordModal;
