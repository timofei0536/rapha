"use client";

import { useState, useRef, useEffect } from "react";
import "./Select.scss";

export default function Select({
  name,
  options = [],
  placeholder = "",
  defaultValue = "",
  className = "",
  required = false,
}) {
  const [value, setValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef(null);
  const nativeSelectRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    const sel = nativeSelectRef.current;
    if (!sel) return;
    if (required && !value) {
      sel.setCustomValidity("Please select an option.");
    } else {
      sel.setCustomValidity("");
    }
  }, [required, value]);

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
      aria-required={required}
    >
      <select
        ref={nativeSelectRef}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => wrapRef.current?.focus()}
        required={required}
        className="select__native"
        tabIndex={-1}
        aria-hidden="true"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="select__value">
        <span className="select__value-text">{displayText}</span>
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
