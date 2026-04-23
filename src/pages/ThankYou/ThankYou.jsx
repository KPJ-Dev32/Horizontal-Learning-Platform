import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import styles from './ThankYou.module.scss';
import accentBar from '../../assets/Rectangle 3 Copy 4.svg';

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <Header />

      <main className={styles.main}>
        <div className={styles.thankYouBlock}>
          <div className={styles.accentContainer}>
            <img src={accentBar} alt="accent" className={styles.accentBarAsset} />
          </div>

          <h1 className={styles.pageTitle}>Thank you!</h1>
          <p className={styles.description}>
            You've successfully created your account with Horizontal Training Portal.
          </p>

          <Button className={styles.button} onClick={() => navigate('/login')}>
            Log in for continue browsing
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ThankYou;
