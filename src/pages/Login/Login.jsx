import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import styles from './Login.module.scss';
import { login } from '../../utils/api';

import accentBar from '../../assets/Rectangle 3 Copy 4.svg';
import eyeIcon from '../../assets/Combined Shape Copy 3.svg';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await login(formData.email, formData.password);
      navigate('/home');
    } catch (err) {
      console.error("PostgreSQL Login failed, trying offline localStorage fallback:", err);
      
      const savedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const matchedUser = savedUsers.find(u => u.email?.toLowerCase().trim() === formData.email?.toLowerCase().trim() && u.password === formData.password);

      if (matchedUser) {
        // Safe fallback for demo presentation if server is stopped
        localStorage.setItem('user_session', JSON.stringify({ email: matchedUser.email, date: new Date() }));
        localStorage.setItem('user_token', 'mock-token-' + matchedUser.email);
        navigate('/home');
      } else {
        setError(err.message || "You have entered invalid credentials. Please try again.");
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <Header />

      <main className={styles.main}>
        <div className={styles.loginBlock}>

          <div className={styles.accentContainer}>
            <img src={accentBar} alt="accent" className={styles.accentBarAsset} />
          </div>

          <h1 className={styles.pageTitle}>Log into your account</h1>

          <form onSubmit={handleSubmit} className={styles.loginForm}>

            <div className={styles.emailGroup}>
              <label htmlFor="email">Email Address*</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.passwordGroup}>
              <label htmlFor="password">Password*</label>
              <div className={styles.inputIconWrapper}>
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
                  className={styles.eyeToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img src={eyeIcon} alt="visibility" className={styles.eyeAsset} />
                </button>
              </div>
            </div>

            <div className={styles.forgotPass}>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            {error && (
              <p className={styles.errorMessage}>
                {error}
              </p>
            )}

            <Button type="submit">
              Log In
            </Button>

            <hr className={styles.formDivider} />

            <p className={styles.signupPrompt}>
              Don't have an account with Horizontal Training Portal? <Link to="/create-account">Create an account now</Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
