import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppFooter from '../../components/AppFooter/AppFooter';
import Button from '../../components/Button/Button';
import styles from '../CategoryListing/CategoryListing.module.scss';

import heroBg from '../../assets/Hero Image.png';
import leftArrow from '../../assets/Left Arrow.svg';
import rightArrow from '../../assets/Right Arrow.svg';
import lineCopy from '../../assets/Line Copy 3.svg';

const FrontendCertifications = () => {
  const navigate = useNavigate();

  const ALL_CERTS = [
    { id: 1, title: 'Sitecore Professional – Product Solution' },
    { id: 2, title: 'Sitecore Essentials – Product Solution' },
    { id: 3, title: '*UPDATED* Content Hub 4 Mock Implementations Bundle - Instructor-Led Training – Product Solution' },
    { id: 4, title: '*UPDATED* Content Hub 4 Professional Mock DAM Implementation – Instructor-Led Training – Product Solution' },
    { id: 5, title: 'Sitecore Headless Services for JSS Workshop – Instructor-Led Training' },
    { id: 6, title: 'Web Experience Management 9.3 – Instructor-Led Training' },
    { id: 7, title: 'Context Marketing Fundamentals 9.3 – Instructor-Led Training' },

    { id: 8, title: 'Frontend Architecture - Advanced Design Patterns' },
    { id: 9, title: 'React Performance Optimization Masterclass - Professional Track' },
    { id: 10, title: 'Modern CSS Frameworks: Deep Dive into Tailwind & PostCSS' },
    { id: 11, title: 'Static Site Generation with Next.js and Headless CMS' },
    { id: 12, title: 'WebGL & Low-Level Canvas Animation Techniques' },
    { id: 13, title: 'Web Accessibility Compliance (WCAG 2.1) Certified Expert' },
    { id: 14, title: 'PWA Builder: Transforming Web Apps into Native Experiences' },

    { id: 15, title: 'Advanced TypeScript for Large Scale Applications' },
    { id: 16, title: 'Micro-Frontends Architecture & Implementation' }
  ];

  const ITEMS_PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(ALL_CERTS.length / ITEMS_PER_PAGE);
  const paginatedCerts = useMemo(() => {
    return ALL_CERTS.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [currentPage]);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

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

        <section className={styles.listingSection}>
          <div className={styles.centeredContainer}>

            <div className={styles.breadcrumbWrapper}>
              <div className={styles.breadcrumb}>
                <Link to="/home" className={styles.linkHome}>Home</Link>
                <span className={styles.linkSeparator}> | </span>
                <Link to="/certification" className={styles.linkHome}>Certifications</Link>
                <span className={styles.linkSeparator}> | </span>
                <span className={styles.linkActive}>Frontend Certifications</span>
              </div>
            </div>

            <h2 className={styles.pageTitle}>Frontend Certifications</h2>

            <img src={lineCopy} alt="" className={styles.tagLine} style={{ marginTop: '20px' }} />

            <ul className={styles.courseList} style={{ marginTop: '0' }}>
              {paginatedCerts.map((cert, i) => (
                <li key={cert.id} className={styles.courseItem} style={{ padding: '35px 0' }}>
                  <div className={styles.courseInfo} style={{ display: 'flex', alignItems: 'center' }}>
                    <h3 className={styles.courseTitle} style={{ fontSize: '16px', margin: 0, lineHeight: '1.4' }}>
                      {cert.title}
                    </h3>
                  </div>
                  <div className={styles.courseMeta}>
                    <Button className={styles.learnMoreBtn} onClick={() => navigate('/certification-details')}>Learn more</Button>
                  </div>
                  {i < paginatedCerts.length - 1 && <hr className={styles.itemDivider} style={{ marginTop: '35px' }} />}
                </li>
              ))}
            </ul>

            <img src={lineCopy} alt="" className={styles.tagLine} />

            <div className={styles.pagination}>
              <button
                className={styles.pageArrow}
                disabled={currentPage === 1}
                onClick={handlePrev}
              >
                <img src={leftArrow} alt="" className={styles.arrowIcon} />
                <span>Previous</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`${styles.pageNum} ${currentPage === p ? styles.pageActive : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}

              <button
                className={styles.pageArrow}
                disabled={currentPage === totalPages}
                onClick={handleNext}
              >
                <span>Next</span>
                <img src={rightArrow} alt="" className={styles.arrowIcon} />
              </button>
            </div>

          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
};

export default FrontendCertifications;
