import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import styles from './ErrorPage.module.scss';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <Header />

      <main className={styles.main}>
        <div className={styles.errorBlock}>
          <h2 className={styles.errorCode}> 404 ERROR</h2>
          <h1 className={styles.pageTitle}>
            Whoops. You've reached a page <br />that doesn't exist.
          </h1>
          <p className={styles.description}>
            Let's bring you back to a better place.
          </p>

          <Button className={styles.returnBtn} onClick={() => {
            const session = localStorage.getItem('user_session');
            if (session) {
              navigate('/home');
            } else {
              navigate('/login');
            }
          }}>
            Return to homepage
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ErrorPage;
