import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppFooter from '../../components/AppFooter/AppFooter';
import styles from './Certification.module.scss';

import heroBg from '../../assets/Hero Image.png';
import accentBar from '../../assets/Rectangle 3 Copy 4.svg';

import iconFrontend from '../../assets/Frontend Solutions.svg';
import iconBackend from '../../assets/Backend Solutions.svg';
import iconDevops from '../../assets/DevOps Solutions.svg';
import iconQA from '../../assets/QA Solutions.svg';
import iconUI from '../../assets/UI Solutions.svg';
import iconOpen from '../../assets/Open Solutions.svg';

const Certification = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.wrapper}>
            <AppHeader />

            <main className={styles.mainContent}>

                <section className={styles.heroSection} style={{ backgroundImage: `url("${heroBg}")` }}>
                    <div className={styles.heroOverlay}>
                        <div className={styles.heroContainer}>
                            <h1 className={styles.heroTitle}>Certification</h1>
                        </div>
                    </div>
                </section>

                <section className={styles.welcomeSection}>
                    <div className={styles.centeredContainer}>
                        <div className={styles.welcomeTextWrapper}>
                            <div className={styles.breadcrumb}>
                                <Link to="/home" className={styles.linkHome}>Home</Link>
                                <span className={styles.linkSeparator}> | </span>
                                <span className={styles.linkActive}>Certification</span>
                            </div>

                            <img src={accentBar} alt="accent bar" className={styles.accentBar} />
                            <h2 className={styles.sectionTitleLeft}>Horizontal Certification</h2>
                            <p className={styles.welcomeDesc}>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.categorySection}>
                    <div className={styles.centeredContainer}>
                        <h2 className={styles.categoryTitle}>Certifications</h2>
                        <p className={styles.sectionDesc}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has<br />been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
                        </p>

                        <div className={styles.categoryGrid}>
                            <div className={styles.catCard} onClick={() => navigate('/frontend-certifications')}>
                                <img src={iconFrontend} alt="Frontend" className={styles.catIcon} />
                                <h3 className={styles.cardLabel}>Frontend Certifications</h3>
                                <div className={styles.catUnderline}></div>
                            </div>
                            <div className={styles.catCard} onClick={() => navigate('/backend-certifications')}>
                                <img src={iconBackend} alt="Backend" className={styles.catIcon} />
                                <h3 className={styles.cardLabel}>Backend Certifications</h3>
                                <div className={styles.catUnderline}></div>
                            </div>
                            <div className={styles.catCard} onClick={() => navigate('/devops-certifications')}>
                                <img src={iconDevops} alt="DevOps" className={styles.catIcon} />
                                <h3 className={styles.cardLabel}>DevOps Certifications</h3>
                                <div className={styles.catUnderline}></div>
                            </div>

                            <div className={styles.catCard} onClick={() => navigate('/certification')}>
                                <img src={iconQA} alt="QA" className={styles.catIcon} />
                                <h3 className={styles.cardLabel}>QA Certifications</h3>
                                <div className={styles.catUnderline}></div>
                            </div>
                            <div className={styles.catCard} onClick={() => navigate('/certification')}>
                                <img src={iconUI} alt="UI" className={styles.catIcon} />
                                <h3 className={styles.cardLabel}>UI Certifications</h3>
                                <div className={styles.catUnderline}></div>
                            </div>
                            <div className={styles.catCard} onClick={() => navigate('/certification')}>
                                <img src={iconOpen} alt="Open" className={styles.catIcon} />
                                <h3 className={styles.cardLabel}>Other Certifications</h3>
                                <div className={styles.catUnderline}></div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <AppFooter />
        </div>
    );
};

export default Certification;
