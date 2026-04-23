import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppFooter from '../../components/AppFooter/AppFooter';
import Button from '../../components/Button/Button';
import styles from './Home.module.scss';

import heroBg from '../../assets/Hero Image.png';
import accentBar from '../../assets/Rectangle 3 Copy 4.svg';

import iconSubs from '../../assets/Learning Subscriptions.svg';
import iconSolutions from '../../assets/Learning Solutions.svg';
import iconCert from '../../assets/certifications.svg';

import iconFrontend from '../../assets/Frontend Solutions.svg';
import iconBackend from '../../assets/Backend Solutions.svg';
import iconDevops from '../../assets/DevOps Solutions.svg';

const Home = () => {
  const navigate = useNavigate();
  const [activeExplore, setActiveExplore] = useState(null);

  const handleExploreClick = (id) => {
    setActiveExplore(id);
    setTimeout(() => {
      setActiveExplore(null);
    }, 300);
  };

  return (
    <div className={styles.wrapper}>
      <AppHeader />

      <main className={styles.mainContent}>

        <section className={styles.heroSection}>
          <div className={styles.heroOverlay}>
            <div className={styles.heroContainer}>
              <h1 className={styles.heroTitle}>Horizontal Learning!</h1>
              <p className={styles.heroText}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
              </p>
              <div className={styles.heroBtnWrapper}>
                <Button className={styles.heroBtn} onClick={() => navigate('/404')}>Read more</Button>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.welcomeSection}>
          <div className={styles.centeredContainer}>
            <div className={styles.welcomeTextWrapper}>
              <img src={accentBar} alt="accent bar" className={styles.accentBar} />
              <h2 className={styles.sectionTitleLeft}>Welcome to Horizontal Learning Portal</h2>
              <p className={styles.welcomeDesc}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum layout blocks.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.exploreSection}>
          <div className={styles.centeredContainer}>
            <h2 className={styles.sectionTitle}>Explore by</h2>
            <div className={styles.exploreGrid}>

              <div
                className={`${styles.exploreCard} ${activeExplore === 'subscriptions' ? styles.selected : ''}`}
                onClick={() => handleExploreClick('subscriptions')}
              >
                <img src={iconSubs} alt="Subscriptions" className={styles.cardIcon} />
                <h3 className={styles.cardLabel}>Learning Subscriptions</h3>
              </div>

              <div
                className={`${styles.exploreCard} ${activeExplore === 'solutions' ? styles.selected : ''}`}
                onClick={() => handleExploreClick('solutions')}
              >
                <img src={iconSolutions} alt="Solutions" className={styles.cardIcon} />
                <h3 className={styles.cardLabel}>Learning Solutions</h3>
              </div>

              <div
                className={`${styles.exploreCard} ${activeExplore === 'certifications' ? styles.selected : ''}`}
                onClick={() => handleExploreClick('certifications')}
              >
                <img src={iconCert} alt="Certifications" className={styles.cardIcon} />
                <h3 className={styles.cardLabel}>Certifications</h3>
              </div>

            </div>
          </div>
        </section>

        <section className={styles.featuredSection}>
          <div className={styles.centeredContainer}>
            <h2 className={styles.centerTitleWhite}>Featured Learnings</h2>
            <div className={styles.featuredFlex}>
              <div className={styles.featuredContent}>
                <p className={styles.sectionDescWhite}>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions
                </p>
                <div className={styles.featuredBtnWrapper}>
                  <Button className={styles.featuredBtn} onClick={() => navigate('/404')}>Learn more</Button>
                </div>
              </div>

              <div className={styles.featuredGrid}>
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className={styles.featuredCard}>
                    <img src={iconCert} alt="Certification" className={styles.certIcon} />
                    <h3 className={styles.cardLabelFeat}>Certifications</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.categorySection}>
          <div className={styles.centeredContainer}>
            <h2 className={styles.categoryTitle}>Category Listing</h2>
            <p className={styles.sectionDesc}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has<br />been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
            </p>

            <div className={styles.categoryGrid}>
              <div className={styles.catCard} onClick={() => navigate('/frontend-solutions')} style={{ cursor: 'pointer' }}>
                <img src={iconFrontend} alt="Frontend" className={styles.catIcon} />
                <h3 className={styles.cardLabel}>Frontend Solutions</h3>
                <div className={styles.catUnderline}></div>
              </div>
              <div className={styles.catCard} onClick={() => navigate('/backend-solutions')} style={{ cursor: 'pointer' }}>
                <img src={iconBackend} alt="Backend" className={styles.catIcon} />
                <h3 className={styles.cardLabel}>Backend Solutions</h3>
                <div className={styles.catUnderline}></div>
              </div>
              <div className={styles.catCard} onClick={() => navigate('/devops-solutions')} style={{ cursor: 'pointer' }}>
                <img src={iconDevops} alt="DevOps" className={styles.catIcon} />
                <h3 className={styles.cardLabel}>DevOps Solutions</h3>
                <div className={styles.catUnderline}></div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.certListSection}>
          <div className={styles.centeredContainer}>
            <h1 className={styles.sectionTitle}>Certifications</h1>
            <p className={styles.sectionDesc}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has<br />been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
            </p>

            <div className={styles.certEightGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className={styles.smallCertCard} onClick={() => navigate('/certification')} style={{ cursor: 'pointer' }}>
                  Lorem Ipsum is simply dummy text of the printing typesetting
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <AppFooter />
    </div>
  );
};

export default Home;
