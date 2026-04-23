import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppFooter from '../../components/AppFooter/AppFooter';
import Button from '../../components/Button/Button';
import SelectDropdown from '../../components/SelectDropdown/SelectDropdown';
import ChangePasswordModal from '../../components/ChangePasswordModal/ChangePasswordModal';
import styles from './EditProfile.module.scss';
import accentBar from '../../assets/Rectangle 3 Copy 4.svg';
import leftArrow from '../../assets/left Pointing Arrow.svg';
import downwardArrow from '../../assets/Downward Arrow.svg';
import calendarIcon from '../../assets/Calender.svg';

const CERTIFICATION_OPTIONS = [
  { value: 'Sitecore Professional – Product Solution', label: 'Sitecore Professional – Product Solution' },
  { value: 'Node.js Certified Developer - Professional Track', label: 'Node.js Certified Developer - Professional Track' },
  { value: 'Java Spring Framework Expert Certification', label: 'Java Spring Framework Expert Certification' },
  { value: 'Docker Certified Associate (DCA)', label: 'Docker Certified Associate (DCA)' },
  { value: 'Certified Kubernetes Administrator (CKA)', label: 'Certified Kubernetes Administrator (CKA)' },
  { value: 'AWS Certified DevOps Engineer - Professional', label: 'AWS Certified DevOps Engineer - Professional' },
  { value: 'Advanced HTML Concepts', label: 'Advanced HTML Concepts' },
  { value: 'Advanced CSS', label: 'Advanced CSS' },
  { value: 'React Performance Optimization', label: 'React Performance Optimization' },
  { value: 'MongoDB Certified Data Modeler & Architect', label: 'MongoDB Certified Data Modeler & Architect' },
];

const DEPARTMENT_OPTIONS = [
  { value: 'hr', label: 'HR' },
  { value: 'eng', label: 'Engineering' },
  { value: 'mkt', label: 'Marketing' },
  { value: 'fin', label: 'Finance' },
  { value: 'UI/UX Department', label: 'UI/UX Department' },
  { value: 'it', label: 'IT' },
  { value: 'sales', label: 'Sales' }
];

const EditProfile = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const session = JSON.parse(localStorage.getItem('user_session') || 'null');
  const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
  const userIndex = allUsers.findIndex(u => u.email?.toLowerCase() === session?.email?.toLowerCase());
  const currentUser = userIndex !== -1 ? allUsers[userIndex] : {};

  const [formData, setFormData] = useState({
    firstName: currentUser.firstName || '',
    lastName: currentUser.lastName || '',
    department: currentUser.department || '',
    role: currentUser.role || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    password: currentUser.password ? '*'.repeat(currentUser.password.length) : '**********'
  });

  const [certifications, setCertifications] = useState(currentUser.certifications || []);
  const [newCertName, setNewCertName] = useState('');
  const [newCertDate, setNewCertDate] = useState('');
  const dateInputRef = useRef(null);

  const formatDisplayDate = (dateStr) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCert = () => {
    if (newCertName && newCertDate) {
      setCertifications([...certifications, { name: newCertName, date: newCertDate }]);
      setNewCertName('');
      setNewCertDate('');
    }
  };

  const handleRemoveCert = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let finalCertifications = [...certifications];
    if (newCertName && newCertDate) {
      const alreadyExists = certifications.some(c => c.name === newCertName && c.date === newCertDate);
      if (!alreadyExists) {
        finalCertifications.push({ name: newCertName, date: newCertDate });
      }
    }

    if (userIndex !== -1) {
      const updatedUser = {
        ...currentUser,
        firstName: formData.firstName,
        lastName: formData.lastName,
        department: formData.department,
        role: formData.role,
        phone: formData.phone,
        certifications: finalCertifications
      };

      if (!formData.password.includes('*')) {
        updatedUser.password = formData.password;
      }

      allUsers[userIndex] = updatedUser;
      localStorage.setItem('registered_users', JSON.stringify(allUsers));
    }
    navigate('/profile');
  };

  return (
    <div className={styles.wrapper}>
      <AppHeader />

      <main className={styles.main}>
        <div className={styles.profileContainer}>
          <div className={styles.profileContentWrapper}>

            <button className={styles.backBtn} onClick={() => navigate('/profile')}>
              <img src={leftArrow} alt="back" className={styles.backIcon} />
              <span>Back to Profile</span>
            </button>

            <div className={styles.accentContainer}>
              <img src={accentBar} alt="accent" className={styles.accentBarAsset} />
            </div>

            <h1 className={styles.pageTitle}>Edit Profile</h1>

            <form className={styles.sectionsWrapper} onSubmit={handleSubmit}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Personal Information</h2>

                <div className={styles.infoRow}>
                  <label htmlFor="firstName" className={styles.infoLabel}>First Name</label>
                  <div className={styles.infoValueWrapper}>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className={styles.infoInput}
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <label htmlFor="lastName" className={styles.infoLabel}>Last Name</label>
                  <div className={styles.infoValueWrapper}>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className={styles.infoInput}
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <label htmlFor="department" className={styles.infoLabel}>Department</label>
                  <div className={styles.infoValueWrapper}>
                    <div className={styles.selectWrapper}>
                      <SelectDropdown
                        id="department"
                        name="department"
                        className={styles.infoSelect}
                        value={formData.department}
                        onChange={handleChange}
                        options={DEPARTMENT_OPTIONS}
                        placeholder="Select Department"
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <label htmlFor="role" className={styles.infoLabel}>Role</label>
                  <div className={styles.infoValueWrapper}>
                    <input
                      id="role"
                      name="role"
                      type="text"
                      className={styles.infoInput}
                      value={formData.role}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Contact Information</h2>

                <div className={styles.infoRow}>
                  <label htmlFor="password" className={styles.infoLabel}>Password</label>
                  <div className={styles.infoValueWrapper}>
                    <input
                      id="password"
                      name="password"
                      type="text"
                      className={styles.infoInput}
                      value={formData.password}
                      onChange={handleChange}
                      disabled
                    />
                    <button type="button" className={styles.changeBtn} onClick={() => navigate('/change-password')}>Change</button>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <label htmlFor="email" className={styles.infoLabel}>Email Address</label>
                  <div className={`${styles.infoValueWrapper} ${styles.readOnlyWrapper}`}>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`${styles.infoInput} ${styles.readOnlyInput}`}
                      value={formData.email}
                      readOnly
                    />
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <label htmlFor="phone" className={styles.infoLabel}>Mobile Number</label>
                  <div className={styles.infoValueWrapper}>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      className={styles.infoInput}
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Certification</h2>

                <div className={styles.addedCertsContainer}>
                  {certifications.length > 0 ? (
                    certifications.map((cert, i) => (
                      <div key={i} className={styles.certEntry}>
                        <div className={styles.certInfo}>
                          <span className={styles.certName}>{cert.name}</span>
                          <span className={styles.certDate}>Date : {formatDisplayDate(cert.date)}</span>
                        </div>
                        <button type="button" className={styles.removeBtn} onClick={() => handleRemoveCert(i)}>
                          Remove X
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className={styles.noCertsMsg}>No certifications added yet. Select from below to add.</p>
                  )}
                </div>

                <div className={styles.infoRow}>
                  <label className={styles.infoLabel}>Certification</label>
                  <div className={styles.infoValueWrapper}>
                    <div className={styles.selectWrapper}>
                      <SelectDropdown
                        className={styles.infoSelect}
                        value={newCertName}
                        onChange={(e) => setNewCertName(e.target.value)}
                        options={CERTIFICATION_OPTIONS}
                        placeholder="Certification list"
                        name="certification"
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <label className={styles.infoLabel}>Date</label>
                  <div className={styles.infoValueWrapper}>
                    <input
                      ref={dateInputRef}
                      type="date"
                      className={styles.infoInput}
                      value={newCertDate}
                      onChange={(e) => setNewCertDate(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.calendarBtn}
                      onClick={() => {
                        try {
                          dateInputRef.current.showPicker();
                        } catch (e) {
                          dateInputRef.current.focus();
                        }
                      }}
                    >
                      <img src={calendarIcon} alt="" className={styles.calendarIcon} />
                    </button>
                  </div>
                </div>

                {newCertName && newCertDate && (
                  <button type="button" className={styles.addCertBtn} onClick={handleAddCert}>
                    + Add Certification
                  </button>
                )}
              </div>

              <div className={styles.actions}>
                <Button type="submit" className={styles.saveBtn}>Save changes</Button>
                <Button type="button" className={styles.cancelBtn} onClick={() => navigate('/profile')}>Cancel</Button>
              </div>
            </form>
          </div>

        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default EditProfile;

