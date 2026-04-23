import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppFooter from '../../components/AppFooter/AppFooter';
import Button from '../../components/Button/Button';
import styles from './CourseDetails.module.scss';

import mainImg from '../../assets/Frontend Sol Image 1.png';
import videoThumb from '../../assets/Frontend Sol Image 2.jpg';
import related1 from '../../assets/Frontend Sol Image 3.jpg';
import related2 from '../../assets/Frontend Sol Image 4.jpg';
import related3 from '../../assets/Advanced HTML Concepts 2 Image.png';
import starIcon from '../../assets/Star.svg';
import bulletPoint from '../../assets/Bullet Point.svg';
import playButton from '../../assets/Large Play Button.svg';
import successTick from '../../assets/Success Tick.svg';
import userAvatar from '../../assets/noun_User_3779059.svg';
import demoVideo from '../../assets/Demo Video.mp4';
import selectedStar from '../../assets/Selected Star.svg';

const CourseDetails = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [userFeedbacks, setUserFeedbacks] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    const session = JSON.parse(localStorage.getItem('user_session') || 'null');
    const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const currentUser = allUsers.find(u => u.email === session?.email) || {};
    const fullName = currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : "User Profile";

    const handleSubmit = () => {
        if (rating === 0 || comment.trim() === '') return;

        const newFeedback = {
            id: Date.now(),
            name: fullName,
            rating: rating,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            text: comment
        };

        setUserFeedbacks([newFeedback, ...userFeedbacks]);
        setRating(0);
        setComment('');
        setShowSuccess(true);

        setTimeout(() => setShowSuccess(false), 5000);
    };

    const relatedCourses = [
        { id: 1, img: related1, title: 'Advanced HTML Concepts', desc: 'Lorem ipsum is simply dummy text of the printing typesetting industry. Lorem ipsum has Industry\'s dummy.' },
        { id: 2, img: related2, title: 'Advanced CSS', desc: 'Lorem ipsum is simply dummy text of the printing typesetting industry. Lorem ipsum.' },
        { id: 3, img: related3, title: 'Advanced HTML Concepts', desc: 'Lorem ipsum is simply dummy text of the printing industry. Lorem ipsum has Industry\'s dummy.' }
    ];

    return (
        <div className={styles.wrapper}>
            <AppHeader />

            <main className={styles.mainContent}>
                <div className={styles.centeredContainer}>

                    <div className={styles.breadcrumb}>
                        <Link to="/home" className={styles.linkHome}>Home</Link>
                        <span className={styles.linkSeparator}> | </span>
                        <Link to="/training" className={styles.linkHome}>Training</Link>
                        <span className={styles.linkSeparator}> | </span>
                        <Link to="/frontend-solutions" className={styles.linkHome}>Frontend Solutions</Link>
                        <span className={styles.linkSeparator}> | </span>
                        <span className={styles.linkActive}>Web Development Basic - HTML</span>
                    </div>

                    <h1 className={styles.pageTitle}>Web Development Basic - HTML</h1>

                    <p className={styles.bodyText}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing.
                    </p>

                    <div className={styles.bannerContainer}>
                        <img src={mainImg} alt="HTML Code" className={styles.bannerImage} />
                    </div>

                    <p className={styles.bodyText}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing.
                    </p>

                    <section className={styles.section}>
                        <h2 className={styles.sectionHeading}>Web Development Basic - HTML</h2>
                        <ul className={styles.objectivesList}>
                            {[1, 2, 3].map(i => (
                                <li key={i} className={styles.objectiveItem}>
                                    <img src={bulletPoint} alt="" className={styles.bulletIcon} />
                                    <span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <div className={styles.videoWrapper}>
                        <img src={videoThumb} alt="Video Thumbnail" className={styles.videoThumb} />
                        <button className={styles.playButton} onClick={() => setIsVideoOpen(true)}>
                            <img src={playButton} alt="Play" />
                        </button>
                    </div>

                    <p className={styles.bodyText}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>

                    <hr className={styles.divider} />

                    <section className={styles.relatedSection}>
                        <h2 className={styles.blockTitle}>Related Courses</h2>
                        <div className={styles.grid}>
                            {relatedCourses.map(course => (
                                <div key={course.id} className={styles.card}>
                                    <div className={styles.cardImgWrapper}>
                                        <img src={course.img} alt={course.title} />
                                    </div>
                                    <h3 className={styles.cardTitle}>{course.title}</h3>
                                    <p className={styles.cardDesc}>{course.desc}</p>
                                    <Button className={styles.cardBtn} onClick={() => navigate('/404')}>Learn more</Button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <hr className={styles.divider} />

                    {userFeedbacks.length > 0 && (
                        <section className={styles.feedbackListSection}>
                            <h2 className={styles.blockTitle}>Feedbacks</h2>
                            <div className={styles.feedbacksContainer}>
                                {userFeedbacks.map(fb => (
                                    <div key={fb.id} className={styles.feedbackItem}>
                                        <div className={styles.fbHeader}>
                                            <img src={userAvatar} alt="" className={styles.fbAvatar} />
                                            <div className={styles.fbUserMeta}>
                                                <h4 className={styles.fbUserName}>{fb.name}</h4>
                                                <div className={styles.fbStars}>
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <img
                                                            key={s}
                                                            src={fb.rating >= s ? selectedStar : starIcon}
                                                            alt=""
                                                            className={styles.fbStar}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className={styles.fbDate}>Reviewed on {fb.date}</p>
                                        <p className={styles.fbBody}>{fb.text}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className={styles.feedbackSection}>
                        {showSuccess && (
                            <div className={styles.successMessage} style={{ marginBottom: '40px' }}>
                                <div className={styles.successHeader}>
                                    <img src={successTick} alt="" className={styles.successIcon} />
                                    <h2 className={styles.successTitle}>Feedback submitted - Thank you!</h2>
                                </div>
                                <p className={styles.successSub}>Please refresh the page to view your feedback.</p>
                            </div>
                        )}

                        <h2 className={styles.blockTitle} style={{ fontSize: '24px' }}>Submit your Feedback</h2>
                        <textarea
                            className={styles.feedbackArea}
                            placeholder="Your Feedback"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className={styles.ratingRow}>
                            <span>Your Rating:</span>
                            <div className={styles.stars}>
                                {[1, 2, 3, 4, 5].map(s => (
                                    <img
                                        key={s}
                                        src={rating >= s ? selectedStar : starIcon}
                                        alt=""
                                        className={styles.star}
                                        onClick={() => setRating(s)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={styles.btnRow}>
                            <Button className={styles.submitBtn} onClick={handleSubmit}>Submit</Button>
                            <button className={styles.cancelBtn} onClick={() => { setComment(''); setRating(0); }}>Cancel</button>
                        </div>
                    </section>
                </div>
            </main>

            {isVideoOpen && (
                <div className={styles.videoOverlay} onClick={() => setIsVideoOpen(false)}>
                    <div className={styles.videoModal} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setIsVideoOpen(false)}>×</button>
                        <video
                            src={demoVideo}
                            controls
                            autoPlay
                            className={styles.modalVideo}
                        />
                    </div>
                </div>
            )}

            <AppFooter />
        </div>
    );
};

export default CourseDetails;
