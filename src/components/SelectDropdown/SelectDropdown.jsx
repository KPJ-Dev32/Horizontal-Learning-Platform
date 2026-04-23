import React, { useState, useRef, useEffect } from 'react';
import downwardArrow from '../../assets/Downward Arrow.svg';
import styles from './SelectDropdown.module.scss';

const SelectDropdown = ({ id, name, value, onChange, placeholder = 'Select option', className, options = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || { value: '', label: placeholder };

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
    onChange({ target: { name: name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className={`${styles.dropdownContainer} ${className || ''}`} ref={dropdownRef}>
      <div
        className={styles.dropdownHeader}
        onClick={() => setIsOpen(!isOpen)}
        id={id}
      >
        <span>{selectedOption.label}</span>
        <img src={downwardArrow} alt="v" className={styles.dropArrowIcon} />
      </div>

      {isOpen && (
        <ul className={styles.dropdownMenuList}>
          {options.map((opt, index) => {
            return (
              <React.Fragment key={opt.value}>
                <li
                  className={`${styles.dropdownItem} ${value === opt.value ? styles.selected : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </li>
                {index < options.length - 1 && (
                  <li className={styles.separator}></li>
                )}
              </React.Fragment>
            );
          })}
        </ul>
      )}
      <input type="hidden" name={name} value={value} />
    </div>
  );
};

export default SelectDropdown;
