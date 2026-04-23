import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AppFooter.module.scss';
import footerLogo from '../../assets/Fill 14 Copy.svg';
import linkedinIcon from '../../assets/Combined Shape Copy.svg';
import instagramIcon from '../../assets/Combined Shape Copy 2.svg';
import twitterIcon from '../../assets/Path Copy 2.svg';
import facebookIcon from '../../assets/Path Copy.svg';

const AppFooter = () => {
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoSlot}>
          <img src={footerLogo} alt="H" className={styles.footerIcon} />
        </div>

        <div className={styles.linksStack}>
          <div onClick={() => handleNav('/training')} className={styles.footerLink}>Training</div>
          <div onClick={() => handleNav('/404')} className={styles.footerLink}>Certifications</div>
          <div onClick={() => handleNav('/contact-us')} className={styles.footerLink}>Contact us</div>
        </div>

        <div className={styles.socialIconsRow}>
          <img onClick={() => handleNav('/404')} src={linkedinIcon} alt="LinkedIn" className={styles.socAsset} />
          <img onClick={() => handleNav('/404')} src={instagramIcon} alt="Instagram" className={styles.socAsset} />
          <img onClick={() => handleNav('/404')} src={twitterIcon} alt="Twitter" className={styles.socAsset} />
          <img onClick={() => handleNav('/404')} src={facebookIcon} alt="Facebook" className={styles.socAsset} />
        </div>

        <div className={styles.legalNotice}>
          <span onClick={() => handleNav('/404')} className={styles.legalLink}>Privacy Policy</span>
          <span className={styles.separator}>|</span>
          <span onClick={() => handleNav('/404')} className={styles.legalLink}>Disclaimer</span>
          <span className={styles.separator}>|</span>
          <span>© Horizontal Digital 2022</span>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
