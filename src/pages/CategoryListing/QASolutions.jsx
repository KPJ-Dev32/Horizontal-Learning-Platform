import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppFooter from '../../components/AppFooter/AppFooter';
import Button from '../../components/Button/Button';
import DepartmentDropdown from '../../components/DepartmentDropdown/DepartmentDropdown';
import styles from './CategoryListing.module.scss';
import heroBg from '../../assets/Hero Image.png';
import leftArrow from '../../assets/Left Arrow.svg';
import rightArrow from '../../assets/Right Arrow.svg';
import lineCopy from '../../assets/Line Copy 3.svg';

const QASolutions = () => {
  const navigate = useNavigate();
  const TAGS = ['All', 'Manual', 'Automation', 'Selenium', 'Cypress', 'API Testing'];
  const ALL_COURSES = [
    { id: 1, title: 'Introduction to QA Testing', desc: "Learn the fundamentals of manual testing and the software testing lifecycle.", duration: '40min', tags: ['Manual'] },
    { id: 2, title: 'Automation Testing with Selenium', desc: "Modern web automation using Selenium WebDriver and Java.", duration: '80min', tags: ['Automation', 'Selenium'] },
    { id: 3, title: 'Modern QA with Cypress', desc: "Fast and reliable end-to-end testing for modern web apps with Cypress.", duration: '60min', tags: ['Automation', 'Cypress'] },
    { id: 4, title: 'REST API Testing with Postman', desc: "Master API testing and automation using Postman and Newman.", duration: '45min', tags: ['API Testing'] },
    { id: 5, title: 'Performance Testing Basics', desc: "Introduction to load and performance testing for web applications.", duration: '50min', tags: ['Automation'] }
  ];
  const ITEMS_PER_PAGE = 4;
  const [activeTag, setActiveTag] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const filteredCourses = useMemo(() => activeTag === 'All' ? ALL_COURSES : ALL_COURSES.filter(c => c.tags.includes(activeTag)), [activeTag]);
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const handleTagChange = (tag) => { setActiveTag(tag); setCurrentPage(1); };
  return (
    <div className={styles.wrapper}>
      <AppHeader />
      <main className={styles.mainContent}>
        <section className={styles.heroSection} style={{ backgroundImage: `url("${heroBg}")` }}>
          <div className={styles.heroOverlay}><div className={styles.heroContainer}><h1 className={styles.heroTitle}>QA Solutions</h1></div></div>
        </section>
        <section className={styles.listingSection}>
          <div className={styles.centeredContainer}>
            <div className={styles.breadcrumbWrapper}>
              <div className={styles.breadcrumb}>
                <Link to="/home" className={styles.linkHome}>Home</Link><span className={styles.linkSeparator}> | </span>
                <Link to="/training" className={styles.linkHome}>Training</Link><span className={styles.linkSeparator}> | </span>
                <span className={styles.linkActive}>QA Solutions</span>
              </div>
            </div>
            <h2 className={styles.pageTitle}>QA Training Courses</h2>
            <div className={styles.tagBarWrapper}>
              <img src={lineCopy} alt="" className={styles.tagLine} />
              
              <div className={styles.mobileSortDropdownWrapper}>
                <DepartmentDropdown 
                  className={styles.mobileSortSelect} 
                  value={activeTag} 
                  onChange={(e) => handleTagChange(e.target.value)}
                  options={TAGS.map(tag => ({ value: tag, label: tag }))}
                />
              </div>

              <div className={styles.tagBar}>
                {TAGS.map((tag) => (
                  <button key={tag} className={`${styles.tag} ${activeTag === tag ? styles.tagActive : ''}`} onClick={() => handleTagChange(tag)}>{tag}</button>
                ))}
              </div>
              <img src={lineCopy} alt="" className={styles.tagLine} />
            </div>
            <ul className={styles.courseList}>
              {paginatedCourses.map((course, i) => (
                <li key={course.id} className={styles.courseItem}>
                  <div className={styles.courseInfo}><h3 className={styles.courseTitle}>{course.title}</h3><p className={styles.courseDesc}>{course.desc}</p></div>
                  <div className={styles.courseMeta}><span className={styles.courseDuration}>Duration - {course.duration}</span><Button className={styles.learnMoreBtn} onClick={() => navigate('/404')}>Learn more</Button></div>
                  {i < paginatedCourses.length - 1 && <hr className={styles.itemDivider} />}
                </li>
              ))}
            </ul>
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button className={styles.pageArrow} disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                  <img src={leftArrow} alt="" className={styles.arrowIcon} /><span>Previous</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (<button key={p} className={`${styles.pageNum} ${currentPage === p ? styles.pageActive : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>))}
                <button className={styles.pageArrow} disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                  <span>Next</span><img src={rightArrow} alt="" className={styles.arrowIcon} />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
};
export default QASolutions;
