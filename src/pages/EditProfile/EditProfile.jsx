import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppFooter from '../../components/AppFooter/AppFooter';
import Button from '../../components/Button/Button';
import SelectDropdown from '../../components/SelectDropdown/SelectDropdown';
import styles from './EditProfile.module.scss';
import accentBar from '../../assets/Rectangle 3 Copy 4.svg';
import leftArrow from '../../assets/left Pointing Arrow.svg';
import calendarIcon from '../../assets/Calender.svg';
import { fetchProfile, updateProfile } from '../../utils/api';

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

  // Unified State management
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    role: '',
    email: '',
    phone: '',
    password: '••••••••••••',
    avatarUrl: ''
  });

  const [certifications, setCertifications] = useState([]);
  const [newCertName, setNewCertName] = useState('');
  const [newCertDate, setNewCertDate] = useState('');
  const [loading, setLoading] = useState(true);
  const dateInputRef = useRef(null);

  // 1. Fetch current profile from PostgreSQL on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCurrentDetails() {
      try {
        setLoading(true);
        const data = await fetchProfile();
        if (isMounted) {
          setFormData({
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            department: data.user.department || '',
            role: data.user.role || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            password: '••••••••••••',
            avatarUrl: data.user.avatarUrl || ''
          });
          setCertifications(data.certifications || []);
        }
      } catch (err) {
        console.error("Failed to load edit profile parameters:", err);
        if (err.message.toLowerCase().includes('unauthorized') || err.message.toLowerCase().includes('session')) {
          navigate('/login');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadCurrentDetails();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    if (!dateStr.includes('-') && dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0];
    }
    if (!dateStr.includes('-')) return dateStr;
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

  // 2. Submit edits securely to PostgreSQL API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile(
        formData.firstName,
        formData.lastName,
        formData.phone,
        formData.role,
        formData.avatarUrl,
        formData.department
      );

      // Local storage cache backward-sync
      const session = JSON.parse(localStorage.getItem('user_session') || '{}');
      const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const userIdx = allUsers.findIndex(u => u.email?.toLowerCase() === session?.email?.toLowerCase());
      if (userIdx !== -1) {
        allUsers[userIdx] = {
          ...allUsers[userIdx],
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          role: formData.role,
          department: formData.department,
          avatarUrl: formData.avatarUrl
        };
        localStorage.setItem('registered_users', JSON.stringify(allUsers));
      }

      navigate('/profile');
    } catch (err) {
      console.error("Failed to update profile database row:", err);
      alert(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <AppHeader />
        <main className={styles.main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center', fontFamily: 'inherit' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2D2E', marginBottom: '10px' }}>Syncing Database Rows...</div>
            <p style={{ color: '#6F6D6E' }}>Pushing profile updates securely to PostgreSQL.</p>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

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
                      required
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
                      required
                    />
                  </div>
                </div>

                {/* Profile Image URL text-input block */}
                <div className={styles.infoRow}>
                  <label htmlFor="avatarUrl" className={styles.infoLabel}>Profile Image URL</label>
                  <div className={styles.infoValueWrapper}>
                    <input
                      id="avatarUrl"
                      name="avatarUrl"
                      type="text"
                      className={styles.infoInput}
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      value={formData.avatarUrl}
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
