"use client";

import { useState, useRef, useEffect } from "react";
import "./Select.scss";

export default function Select({
  name,
  options = [],
  placeholder = "",
  defaultValue = "",
  className = "",
}) {
  const [value, setValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mouseup", handleClickOutside);
    return () => document.removeEventListener("mouseup", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setValue(option.value);
    setIsOpen(false);
  };

  const handleWrapperClick = (e) => {
    if (e.target.closest(".select__variant")) return;
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div
      ref={wrapRef}
      className={`select ${isOpen ? "select--active" : ""} ${className}`.trim()}
      onClick={handleWrapperClick}
      role="button"
      tabIndex={0}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      <input type="hidden" name={name} value={value} readOnly />
      <div className="select__value">
        {displayText}
      </div>
      <div className="select__variants">
        {options.map((option) => (
          <div
            key={option.value}
            className={`select__variant ${option.value === value ? "select__variant--active" : ""}`}
            onClick={() => handleSelect(option)}
            role="option"
            aria-selected={option.value === value}
          >
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
