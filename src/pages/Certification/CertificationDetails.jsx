import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppFooter from '../../components/AppFooter/AppFooter';
import Button from '../../components/Button/Button';
import styles from './CertificationDetails.module.scss';

import sitecoreMain from '../../assets/Sitecore Image.png';
import videoThumbnail from '../../assets/Thumbnail Image.png';
import playButton from '../../assets/Large Play Button.svg';
import bulletPoint from '../../assets/Bullet Point.svg';

import relatedSitecore from '../../assets/Advanced HTML Concepts Image.png';
import relatedHTML from '../../assets/Advanced HTML Concepts 2 Image.png';
import relatedCSS from '../../assets/Advanced CSS Image.png';

const CertificationDetails = () => {
    const navigate = useNavigate();

    const objectives = [
        "Define data modeling for the Domain Model.",
        "Implement full UI with the Search framework using CRUD operations.",
        "Incorporate complex metadata including taxonomy and other genericized metadata.",
        "Enable and customize advanced medium migration and extraction.",
        "Setup and configure the security model.",
        "Implement custom state machine authentication scripts.",
        "Design, implement, and customize BPM workflows for the Recipes trainer."
    ];

    const relatedCerts = [
        { id: 1, img: relatedSitecore, title: 'Advanced HTML Concepts', desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s dummy.' },
        { id: 2, img: relatedCSS, title: 'Advanced CSS', desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s dummy.' },
        { id: 3, img: relatedHTML, title: 'Advanced HTML Concepts', desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s dummy.' }
    ];

    const employees = [
        { name: 'Shama Jha', desc: 'Designation - Project Manager', email: 'shama.jha@gmail.com', date: '12/03/2022' },
        { name: 'Khushboo Sonkar', desc: 'Designation - FE Team Lead', email: 'khushboo@gmail.com', date: '05/03/2022' },
        { name: 'Ajay Tejavath', desc: 'Designation - Backend dev', email: 'ajayteja@gmail.com', date: '14/03/2022' },
        { name: 'Sumit More', desc: 'Designation - Sr. QA Analyst', email: 'sumit.more@gmail.com', date: '12/01/2022' },
        { name: 'Chhaya Sharma', desc: 'Designation - Front-end Lead', email: 'chhayasharma@gmail.com', date: '14/03/2022' },
        { name: 'Gautam Pandey', desc: 'Designation - UX Designer', email: 'gautam@gmail.com', date: '15/03/2022' },
        { name: 'Piyush Arora', desc: 'Designation - Sr. QA Analyst', email: 'piyush@gmail.com', date: '12/01/2022' },
        { name: 'Chhaya Sharma', desc: 'Designation - Front-end Team Lead', email: 'chhayasharma@gmail.com', date: '14/03/2022' },
        { name: 'Kjay Kashyap', desc: 'Designation - QA Lead', email: 'ajay_kashyap@gmail.com', date: '12/03/2022' }
    ];

    return (
        <div className={styles.wrapper}>
            <AppHeader />

            <main className={styles.mainContent}>
                <div className={styles.centeredContainer}>

                    <div className={styles.breadcrumb}>
                        <Link to="/home" className={styles.linkHome}>Home</Link>
                        <span className={styles.linkSeparator}> | </span>
                        <Link to="/certification" className={styles.linkHome}>Certification</Link>
                        <span className={styles.linkSeparator}> | </span>
                        <span className={styles.linkActive}>Sitecore Professional – Product Solution</span>
                    </div>

                    <h1 className={styles.pageTitle}>Sitecore Professional – Product Solution</h1>

                    <section className={styles.section}>
                        <h2 className={styles.sectionHeading}>Summary</h2>
                        <p className={styles.bodyText}>
                            The Content Hub™ Enterprise Mock DAM Implementation is designed for Sitecore partners, customers, or Sitecore employees who may be implementing the product for a customer with enterprise level requirements. A sandbox is provided with the course and will run for 30 days from the first day of class. All mock implementations must be submitted at least one week before the expiration of the sandbox, preferably in the week following the last day of class. This course will guide you through the implementation process using a fictitious holdings company.
                        </p>
                    </section>

                    <div className={styles.bannerContainer}>
                        <img src={sitecoreMain} alt="Sitecore" className={styles.bannerImage} />
                    </div>

                    <section className={styles.section}>
                        <h2 className={styles.sectionHeading}>Duration</h2>
                        <p className={styles.bodyText}>4 Days</p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionHeading}>Objectives</h2>
                        <p className={styles.bodyText}>
                            By the end of this course, students will be able to configure and customize Content Hub enterprise implementations. This includes being able to:
                        </p>
                        <ul className={styles.objectivesList}>
                            {objectives.map((obj, i) => (
                                <li key={i} className={styles.objectiveItem}>
                                    <img src={bulletPoint} alt="" className={styles.bulletIcon} />
                                    <span>{obj}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <div className={styles.videoWrapper}>
                        <img src={videoThumbnail} alt="Video Thumbnail" className={styles.videoThumb} />
                        <button className={styles.playButton}>
                            <img src={playButton} alt="Play" />
                        </button>
                    </div>

                    <section className={styles.section}>
                        <h2 className={styles.sectionHeading}>Setup requirements</h2>
                        <p className={styles.bodyText}>
                            Each attendee will need to have a laptop with Wi-Fi and a set of quality headphones with a speaker capable of noise cancellation. For the training, we will use a sandbox environment. The sandbox will be provided to you by your course instructor prior to the beginning of the course.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionHeading}>Additional Notes</h2>
                        <p className={styles.bodyText}>
                            For information on our software sales or licensed in-day training, contact the Sitecore Training Team at globaltraining@sitecore.com.
                        </p>
                        <p className={styles.bodyText} style={{ marginTop: '20px' }}>
                            The course comes with a comprehensive set of training materials available for download from the interactive training page.
                        </p>
                        <p className={styles.bodyText} style={{ marginTop: '20px' }}>
                            The sandbox protocol will run for 30 days from the first day of class. All mock implementation must be submitted at least one week before the expiration of the sandbox preferably in the first week after the end of the training.
                        </p>
                    </section>

                    <hr className={styles.divider} />

                    <section className={styles.relatedSection}>
                        <h2 className={styles.blockTitle}>Related Certifications</h2>
                        <div className={styles.certsGrid}>
                            {relatedCerts.map(cert => (
                                <div key={cert.id} className={styles.certCard}>
                                    <div className={styles.cardImgWrapper}>
                                        <img src={cert.img} alt={cert.title} />
                                    </div>
                                    <h3 className={styles.cardTitle}>{cert.title}</h3>
                                    <p className={styles.cardDesc}>{cert.desc}</p>
                                    <Button className={styles.cardBtn} onClick={() => navigate('/404')}>Learn more</Button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className={styles.employeeSection}>
                        <h2 className={styles.blockTitle}>Recently Certified Employees</h2>
                        <div className={styles.employeeGrid}>
                            {employees.map((emp, i) => (
                                <div key={i} className={styles.employeeCard}>
                                    <h4 className={styles.empName}>{emp.name}</h4>
                                    <p className={styles.empInfo}>{emp.desc}</p>
                                    <p className={styles.empInfo}>Email - {emp.email}</p>
                                    <p className={styles.empInfo}>Date: {emp.date}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </main>

            <AppFooter />
        </div>
    );
};

export default CertificationDetails;
