import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import styles from './ForgotPassword.module.scss';
import accentBar from '../../assets/Rectangle 3 Copy 4.svg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Reset link sent to: ${email}`);
  };

  return (
    <div className={styles.wrapper}>
      <Header />

      <main className={styles.main}>
        <div className={styles.forgotBlock}>
          
          <div className={styles.accentContainer}>
            <img src={accentBar} alt="accent" className={styles.accentBarAsset} />
          </div>

          <h1 className={styles.pageTitle}>Forgot Password?</h1>
          <p className={styles.description}>
            Please enter in the email address associated with the account
          </p>

          <form onSubmit={handleSubmit} className={styles.forgotForm}>
            <div className={styles.emailGroup}>
              <label htmlFor="email">Email Address*</label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button className={styles.submitButton} type="submit">Submit</Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
