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

const BackendCertifications = () => {
  const navigate = useNavigate();
  const ALL_CERTS = [
    { id: 1, title: 'Node.js Certified Developer - Professional Track' },
    { id: 2, title: 'Java Spring Framework Expert Certification' },
    { id: 3, title: 'Python Django Backend Specialist' },
    { id: 4, title: 'PostgreSQL Database Administrator (DBA) Level 1' },
    { id: 5, title: 'MongoDB Certified Data Modeler & Architect' },
    { id: 6, title: 'RESTful API Design & Security Professional' },
    { id: 7, title: 'Microservices Architecture & Orchestration Expert' },
    { id: 8, title: 'AWS Serverless Developer (Lambda & API Gateway)' },
    { id: 9, title: 'Backend Performance Optimization & Scalability' },
    { id: 10, title: 'Distributed Systems & Message Queues (RabbitMQ/Kafka)' }
  ];
  const ITEMS_PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(ALL_CERTS.length / ITEMS_PER_PAGE);
  const paginatedCerts = useMemo(() => ALL_CERTS.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [currentPage]);
  return (
    <div className={styles.wrapper}>
      <AppHeader />
      <main className={styles.mainContent}>
        <section className={styles.heroSection} style={{ backgroundImage: `url("${heroBg}")` }}>
          <div className={styles.heroOverlay}><div className={styles.heroContainer}><h1 className={styles.heroTitle}>Certification</h1></div></div>
        </section>
        <section className={styles.listingSection}>
          <div className={styles.centeredContainer}>
            <div className={styles.breadcrumbWrapper}>
              <div className={styles.breadcrumb}>
                <Link to="/home" className={styles.linkHome}>Home</Link><span className={styles.linkSeparator}> | </span>
                <Link to="/certification" className={styles.linkHome}>Certifications</Link><span className={styles.linkSeparator}> | </span>
                <span className={styles.linkActive}>Backend Certifications</span>
              </div>
            </div>
            <h2 className={styles.pageTitle}>Backend Certifications</h2>
            <img src={lineCopy} alt="" className={styles.tagLine} style={{ marginTop: '20px' }} />
            <ul className={styles.courseList} style={{ marginTop: '0' }}>
              {paginatedCerts.map((cert, i) => (
                <li key={cert.id} className={styles.courseItem} style={{ padding: '35px 0' }}>
                  <div className={styles.courseInfo}><h3 className={styles.courseTitle} style={{ fontSize: '16px', margin: 0, lineHeight: '1.4' }}>{cert.title}</h3></div>
                  <div className={styles.courseMeta}><Button className={styles.learnMoreBtn} onClick={() => navigate('/404')}>Learn more</Button></div>
                  {i < paginatedCerts.length - 1 && <hr className={styles.itemDivider} style={{ marginTop: '35px' }} />}
                </li>
              ))}
            </ul>
            <img src={lineCopy} alt="" className={styles.tagLine} />
            <div className={styles.pagination}>
              <button className={styles.pageArrow} disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><img src={leftArrow} alt="" className={styles.arrowIcon} /><span>Previous</span></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (<button key={p} className={`${styles.pageNum} ${currentPage === p ? styles.pageActive : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>))}
              <button className={styles.pageArrow} disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><span>Next</span><img src={rightArrow} alt="" className={styles.arrowIcon} /></button>
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
};
export default BackendCertifications;
