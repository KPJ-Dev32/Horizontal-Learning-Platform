import React from 'react';
import styles from './Navigation.module.scss';

const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <div className="container">
        <div className={styles.navContent}>
          <div className={styles.logo}>
            Horizontal
          </div>
          <ul className={styles.menu}>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className={styles.socials}>
            
            <span>Contact</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
