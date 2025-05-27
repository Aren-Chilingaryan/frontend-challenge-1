import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
  className?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  trigger?: ReactNode;
  menuClassName?: string;
  position?: 'left' | 'right';
  variant?: 'form' | 'menu';
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  trigger,
  menuClassName = '',
  position = 'left',
  variant = 'form'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = value ? options.find(option => option.value === value) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option: DropdownOption) => {
    if (onChange) {
      onChange(option.value);
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${variant === 'form' ? 'w-full' : ''} ${className}`}>
      {trigger ? (
        <div onClick={() => setIsOpen(open => !open)}>
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left focus:outline-none flex justify-between items-center"
          onClick={() => setIsOpen(open => !open)}
        >
          <span>{selected ? selected.label : <span className="text-gray-400">{placeholder}</span>}</span>
          <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
      )}
      <div
        className={`absolute ${position === 'right' ? 'right-0' : 'left-0'} mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-all duration-200 z-50
          ${isOpen ? 'opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95 pointer-events-none'}
          ${menuClassName}
        `}
        style={{transformOrigin: 'top'}}
      >
        <div 
          className="max-h-[200px] overflow-y-auto "
        >
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-150 flex items-center gap-2
                ${option.value === value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
                ${option.className || ''}
              `}
              onClick={() => handleOptionClick(option)}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown; 