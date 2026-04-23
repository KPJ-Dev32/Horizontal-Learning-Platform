import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import DepartmentDropdown from '../../components/DepartmentDropdown/DepartmentDropdown';
import styles from './CreateAccount.module.scss';
import accentBar from '../../assets/Rectangle 3 Copy 4.svg';
import leftArrow from '../../assets/left Pointing Arrow.svg';
import eyeIcon from '../../assets/Combined Shape Copy 3.svg';
import captchaLogo from '../../assets/Captcha Image.png';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [emailError, setEmailError] = useState('');
  const [submitError, setSubmitError] = useState(false);

  const handleCaptchaClick = () => {
    if (isVerified || isVerifying) return;
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError('Please enter valid email formats.');
      setSubmitError(false);
      return;
    }
    setEmailError('');

    if (!isVerified) {
      alert('Please verify you are not a robot first!');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const newUser = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      department: formData.department,
      role: formData.role
    };

    if (existingUsers.some(u => u.email === newUser.email)) {
      setSubmitError(true);
      return;
    }
    setSubmitError(false);

    existingUsers.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(existingUsers));
    
    navigate('/thank-you');
  };

  const hasMinChars = formData.password.length >= 10;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasNumeric = /[0-9]/.test(formData.password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const passwordsMatch = formData.password.length > 0 && formData.password === formData.confirmPassword;

  return (
    <div className={styles.wrapper}>
      <Header />

      <main className={styles.main}>
        <div className={styles.createBlock}>
          
          <Link to="/login" className={styles.backLink}>
            <img src={leftArrow} alt="back" className={styles.backIcon} />
            Back
          </Link>

          <div className={styles.accentContainer}>
            <img src={accentBar} alt="accent" className={styles.accentBarAsset} />
          </div>

          <h1 className={styles.pageTitle}>Create an account</h1>

          <form onSubmit={handleSubmit} className={styles.createForm}>
            
            <div className={styles.inputGroup}>
              <label htmlFor="firstName">First Name*</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="lastName">Last Name*</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address*</label>
              <input
                id="email"
                type="text" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {emailError && <p className={styles.errorMessage}>{emailError}</p>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone">Phone Number*</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="department">Department</label>
              <DepartmentDropdown
                id="department"
                name="department"
                className={styles.deptDropdown}
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="role">Role*</label>
              <input
                id="role"
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              />
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

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password*</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img src={eyeIcon} alt="visibility" className={styles.eyeIcon} />
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirm Password*</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img src={eyeIcon} alt="visibility" className={styles.eyeIcon} />
                </button>
              </div>
            </div>

            <div 
              className={`${styles.recaptchaPlaceholder} ${isVerified ? styles.verified : ''}`} 
              onClick={handleCaptchaClick}
            >
              <img src={captchaLogo} alt="captcha" className={styles.captchaLogo} />

              {isVerifying && (
                <div className={styles.spinner}></div>
              )}

              {isVerified && (
                <div className={styles.verifiedTick}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M20 6L9 17L4 12" 
                      stroke="#2B73EB" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>

            {submitError && (
              <p className={`${styles.errorMessage} ${styles.submitErrorMessage}`}>
                Email already associated with a Horizontal portal account - please <strong>log-in</strong> using those credentials or choose a different email.
              </p>
            )}
            
            <Button type="submit">Submit</Button>

            <div className={styles.formDivider}></div>

            <p className={styles.loginPrompt}>
              Already have an account? <Link to="/login">Sign in now</Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateAccount;
