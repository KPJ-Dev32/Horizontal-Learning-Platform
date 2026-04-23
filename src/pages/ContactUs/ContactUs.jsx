import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppFooter from '../../components/AppFooter/AppFooter';
import Button from '../../components/Button/Button';
import DepartmentDropdown from '../../components/DepartmentDropdown/DepartmentDropdown';
import styles from './ContactUs.module.scss';

import heroBg from '../../assets/Hero Image.png';
import accentBar from '../../assets/Rectangle 3 Copy 4.svg';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    topic: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/thank-you');
  };

  const topicOptions = [
    { value: '', label: '' },
    { value: 'pricing', label: 'Pricing' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing Inquiries' },
    { value: 'partnerships', label: 'Partnerships' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className={styles.wrapper}>
      <AppHeader />

      <section className={styles.heroSection} style={{ backgroundImage: `url("${heroBg}")` }}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContainer}>
            <h1 className={styles.heroTitle}>Contact us</h1>
          </div>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.contactBlock}>
          
          <div className={styles.accentContainer}>
            <img src={accentBar} alt="accent" className={styles.accentBarAsset} />
          </div>

          <h2 className={styles.pageTitle}>Let's talk</h2>
          
          <p className={styles.descText}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry,<br />
            lorem Ipsum has been the industry's standard dummy.
          </p>

          <form onSubmit={handleSubmit} className={styles.contactForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName">First Name*</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="lastName">Last Name*</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address*</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="department">Department</label>
              <DepartmentDropdown 
                id="department" 
                name="department" 
                className={styles.deptDropdown}
                value={formData.department} 
                onChange={handleChange} 
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="role">Role*</label>
              <input type="text" id="role" name="role" value={formData.role} onChange={handleChange} required />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="topic">What would you like to talk about?</label>
              <DepartmentDropdown 
                id="topic" 
                name="topic" 
                className={styles.deptDropdown}
                value={formData.topic} 
                onChange={handleChange} 
                options={topicOptions}
              />
            </div>

            <div className={styles.textareaGroup}>
              <textarea 
                id="message" 
                name="message" 
                placeholder="Your message" 
                value={formData.message} 
                onChange={handleChange} 
                rows="6"
              />
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default ContactUs;
