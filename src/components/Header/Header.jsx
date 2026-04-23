import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import logoHeader from '../../assets/Group 2.svg';
import userIcon from '../../assets/noun_User_3779059.svg';

const Header = () => {
  const handleRefresh = (e) => {
    e.preventDefault();
    window.location.href = '/login';
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/login" onClick={handleRefresh} className={styles.logoWrapper}>
          <img src={logoHeader} alt="Horizontal" className={styles.hLogo} />
        </a>
        <a href="/login" onClick={handleRefresh} className={styles.loginAction}>
          <img src={userIcon} alt="user" className={styles.uIcon} />
          <span>Log in</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
