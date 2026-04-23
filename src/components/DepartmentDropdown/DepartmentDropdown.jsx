import React, { useState, useRef, useEffect } from 'react';
import downwardArrow from '../../assets/Downward Arrow.svg';
import styles from './DepartmentDropdown.module.scss';

const defaultOptions = [
  { value: '', label: 'Select option' },
  { value: 'hr', label: 'HR' },
  { value: 'eng', label: 'Engineering' },
  { value: 'mkt', label: 'Marketing' },
  { value: 'fin', label: 'Finance' },
  { value: 'UI/UX Department', label: 'UI/UX Department' },
  { value: 'it', label: 'IT' },
  { value: 'sales', label: 'Sales' }
];

const DepartmentDropdown = ({ id, name, value, onChange, required, className, options = defaultOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name: name || 'department', value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className={`${styles.dropdownContainer} ${className || ''}`} ref={dropdownRef}>
      <div
        className={styles.dropdownHeader}
        onClick={() => setIsOpen(!isOpen)}
        id={id || 'department'}
      >
        <span>{selectedOption.label}</span>
        <img src={downwardArrow} alt="v" className={styles.dropArrowIcon} />
      </div>

      {isOpen && (
        <ul className={styles.dropdownMenuList}>
          {options.map((opt, index) => {
            if (opt.value === '') return null;
            return (
              <React.Fragment key={opt.value}>
                <li
                  className={`${styles.dropdownItem} ${value === opt.value ? styles.selected : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </li>
                {index < options.length - 1 && options[index + 1].value !== '' && (
                  <li className={styles.separator}></li>
                )}
              </React.Fragment>
            );
          })}
        </ul>
      )}
      <input type="hidden" name={name || 'department'} value={value} required={required} />
    </div>
  );
};

export default DepartmentDropdown;
