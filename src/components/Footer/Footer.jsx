import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.scss';
import footerLogo from '../../assets/Fill 14 Copy.svg';
import linkedinIcon from '../../assets/Combined Shape Copy.svg';
import instagramIcon from '../../assets/Combined Shape Copy 2.svg';
import twitterIcon from '../../assets/Path Copy 2.svg';
import facebookIcon from '../../assets/Path Copy.svg';

const Footer = () => {
  const navigate = useNavigate();

  const handleErrorNav = () => {
    navigate('/404');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoSlot}>
          <img src={footerLogo} alt="H" className={styles.footerIcon} />
        </div>
        
        <div className={styles.contactPoint}>Contact us</div>
        
        <div className={styles.socialIconsRow}>
          <img onClick={handleErrorNav} src={linkedinIcon} alt="LinkedIn" className={styles.socAsset} />
          <img onClick={handleErrorNav} src={instagramIcon} alt="Instagram" className={styles.socAsset} />
          <img onClick={handleErrorNav} src={twitterIcon} alt="Twitter" className={styles.socAsset} />
          <img onClick={handleErrorNav} src={facebookIcon} alt="Facebook" className={styles.socAsset} />
        </div>

        <div className={styles.legalNotice}>
          <span onClick={handleErrorNav} className={styles.legalLink}>Privacy Policy</span>
          <span className={styles.separator}>|</span>
          <span onClick={handleErrorNav} className={styles.legalLink}>Disclaimer</span>
          <span className={styles.separator}>|</span>
          <span>© Horizontal Digital 2022</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
