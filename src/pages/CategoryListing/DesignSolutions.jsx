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

const DesignSolutions = () => {
  const navigate = useNavigate();
  const TAGS = ['All', 'UI/UX', 'Figma', 'Sketch', 'Adobe XD', 'Prototyping'];
  const ALL_COURSES = [
    { id: 1, title: 'UI/UX Design Essentials', desc: "Learn the principles of user interface and user experience design.", duration: '70min', tags: ['UI/UX'] },
    { id: 2, title: 'Mastering Figma for Designers', desc: "Become a power user of Figma for layout and collaboration.", duration: '90min', tags: ['Figma'] },
    { id: 3, title: 'High-Fidelity Prototyping', desc: "Build interactive and realistic prototypes to test your designs.", duration: '55min', tags: ['Prototyping', 'Figma'] },
    { id: 4, title: 'Visual Design Fundamentals', desc: "Understand color theory, typography, and composition for web.", duration: '40min', tags: ['UI/UX'] },
    { id: 5, title: 'Designing for Accessibility', desc: "Learn to create inclusive designs that work for everyone.", duration: '50min', tags: ['UI/UX'] }
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
          <div className={styles.heroOverlay}><div className={styles.heroContainer}><h1 className={styles.heroTitle}>Design Solutions</h1></div></div>
        </section>
        <section className={styles.listingSection}>
          <div className={styles.centeredContainer}>
            <div className={styles.breadcrumbWrapper}>
              <div className={styles.breadcrumb}>
                <Link to="/home" className={styles.linkHome}>Home</Link><span className={styles.linkSeparator}> | </span>
                <Link to="/training" className={styles.linkHome}>Training</Link><span className={styles.linkSeparator}> | </span>
                <span className={styles.linkActive}>Design Solutions</span>
              </div>
            </div>
            <h2 className={styles.pageTitle}>Design Training Courses</h2>
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
export default DesignSolutions;
