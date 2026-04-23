import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './AppHeader.module.scss';
import logoHeader from '../../assets/Group 2.svg';
import userIcon from '../../assets/noun_User_3779059.svg';
import dropdownIcon from '../../assets/Dropdown Icon.svg';
import menuIconSVG from '../../assets/AppHeader Menu Icon.svg';
import crossIconSVG from '../../assets/AppHeader Cross.svg';
import rightArrowSVG from '../../assets/Right Arrow.svg';
import leftArrowSVG from '../../assets/Left Arrow.svg';
import Button from '../Button/Button';

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState(null); // 'training' or 'certification' or null

  const session = JSON.parse(localStorage.getItem('user_session') || 'null');
  const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
  const currentUser = allUsers.find(u => u.email === session?.email) || {};

  const fullName = currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : "User Name";
  const emailDisplay = currentUser.email || "gravaliya@horizontal.com";

  const handleRefresh = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  const handleMouseEnter = (menu) => setActiveDropdown(menu);
  const handleMouseLeave = () => setActiveDropdown(null);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/home" onClick={handleRefresh} className={styles.logoWrapper}>
          <img src={logoHeader} alt="Horizontal" className={styles.hLogo} />
        </a>

        <nav className={styles.navbar}>
          <Link to="/home" className={`${styles.navLink} ${location.pathname === '/home' ? styles.active : ''}`}>Home</Link>

          <div
            className={styles.navItemDropdown}
            onMouseEnter={() => handleMouseEnter('training')}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/training" className={`${styles.navLink} ${(location.pathname.startsWith('/training') || activeDropdown === 'training') ? styles.active : ''}`}>
              Training <img src={dropdownIcon} alt="v" className={styles.dropIcon} />
            </Link>
            {activeDropdown === 'training' && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>Training Solutuions</div>
                <Link to="/frontend-solutions">Frontend Solutuions</Link>
                <Link to="/backend-solutions">Backend Solutions</Link>
                <Link to="/devops-solutions">DevOps Solutions</Link>
                <Link to="/qa-solutions">QA Solutions</Link>
                <Link to="/design-solutions">Design Solutions</Link>
              </div>
            )}
          </div>

          <div
            className={styles.navItemDropdown}
            onMouseEnter={() => handleMouseEnter('certification')}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/certification" className={`${styles.navLink} ${(location.pathname.startsWith('/certification') || activeDropdown === 'certification') ? styles.active : ''}`}>
              Certification <img src={dropdownIcon} alt="v" className={styles.dropIcon} />
            </Link>
            {activeDropdown === 'certification' && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>Certification Solutuions</div>
                <Link to="/frontend-certifications">Frontend</Link>
                <Link to="/backend-certifications">Backend</Link>
                <Link to="/devops-certifications">DevOps</Link>
              </div>
            )}
          </div>

          <Link to="/contact-us" className={`${styles.navLink} ${location.pathname === '/contact-us' ? styles.active : ''}`}>Contact us</Link>

          <div
            className={`${styles.navItemDropdown} ${styles.accountDropdown}`}
            onMouseEnter={() => handleMouseEnter('account')}
            onMouseLeave={handleMouseLeave}
          >
            <span className={`${styles.navLink} ${styles.accountLink} ${(location.pathname === '/profile' || activeDropdown === 'account') ? styles.active : ''}`}>
              <img src={userIcon} alt="User" className={styles.uIcon} />
              My Account <img src={dropdownIcon} alt="v" className={styles.dropIcon} />
            </span>
            {activeDropdown === 'account' && (
              <div className={`${styles.dropdownMenu} ${styles.accountDropdownMenu}`}>
                <div className={styles.dropdownUserInfo}>
                  <img src={userIcon} alt="Profile" className={styles.largeProfileIcon} />
                  <div className={styles.userName}>{fullName}</div>
                  <div className={styles.userEmail}>{emailDisplay}</div>

                  <Button
                    className={styles.manageProfileBtn}
                    onClick={() => {
                      setActiveDropdown(null);
                      navigate('/profile');
                    }}
                  >
                    Manage your Profile
                  </Button>

                  <Link
                    to="/login"
                    className={styles.logoutLink}
                    onClick={() => localStorage.removeItem('user_session')}
                  >
                    Log out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className={styles.mobileMenuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <img src={isMenuOpen ? crossIconSVG : menuIconSVG} alt="menu" />
        </div>
      </div>

      {isMenuOpen && (
        <nav className={styles.mobileNavbar}>
          {!mobileSubMenu ? (
            <>
              <div className={styles.mobileNavLinks}>
                <Link to="/home" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Home</Link>
                <div className={styles.mobileNavLinkWithArrow}>
                  <Link to="/training" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Training</Link>
                  <img src={rightArrowSVG} alt=">" className={styles.mobileArrow} onClick={() => setMobileSubMenu('training')} />
                </div>
                <div className={styles.mobileNavLinkWithArrow}>
                  <Link to="/certification" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Certification</Link>
                  <img src={rightArrowSVG} alt=">" className={styles.mobileArrow} onClick={() => setMobileSubMenu('certification')} />
                </div>
                <Link to="/contact-us" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Contact us</Link>
              </div>
              <div className={styles.mobileAccountSection}>
                <div className={styles.mobileUserInfo} onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}>
                  <img src={userIcon} alt="User" className={styles.mobileUIcon} />
                  <span className={styles.mobileUserName}>My Account</span>
                </div>
                <div 
                  className={styles.mobileLogout} 
                  onClick={() => { 
                    localStorage.removeItem('user_session'); 
                    setIsMenuOpen(false); 
                    navigate('/login'); 
                  }}
                >
                  Log out
                </div>
              </div>
            </>
          ) : mobileSubMenu === 'training' ? (
            <div className={styles.mobileSubMenu}>
              <div className={styles.subMenuHeader} onClick={() => setMobileSubMenu(null)}>
                <img src={leftArrowSVG} alt="<" className={styles.mobileBackArrow} /> Training
              </div>
              <div className={styles.subMenuLinks}>
                <div className={styles.subMenuTitle}>Training Solutuions</div>
                <Link to="/frontend-solutions" onClick={() => setIsMenuOpen(false)}>Frontend Solutuions</Link>
                <Link to="/backend-solutions" onClick={() => setIsMenuOpen(false)}>Backend Solutions</Link>
                <Link to="/devops-solutions" onClick={() => setIsMenuOpen(false)}>DevOps Solutions</Link>
                <Link to="/qa-solutions" onClick={() => setIsMenuOpen(false)}>QA Solutions</Link>
                <Link to="/design-solutions" onClick={() => setIsMenuOpen(false)}>Design Solutions</Link>
              </div>
            </div>
          ) : (
            <div className={styles.mobileSubMenu}>
              <div className={styles.subMenuHeader} onClick={() => setMobileSubMenu(null)}>
                <img src={leftArrowSVG} alt="<" className={styles.mobileBackArrow} /> Certification
              </div>
              <div className={styles.subMenuLinks}>
                <div className={styles.subMenuTitle}>Certification Solutuions</div>
                <Link to="/frontend-certifications" onClick={() => setIsMenuOpen(false)}>Frontend</Link>
                <Link to="/backend-certifications" onClick={() => setIsMenuOpen(false)}>Backend</Link>
                <Link to="/devops-certifications" onClick={() => setIsMenuOpen(false)}>DevOps</Link>
              </div>
            </div>
          )}
        </nav>
      )}

      {(activeDropdown || isMenuOpen) && <div className={styles.pageOverlay} onClick={() => { setIsMenuOpen(false); setMobileSubMenu(null); }}></div>}
    </header>
  );
};

export default AppHeader;
