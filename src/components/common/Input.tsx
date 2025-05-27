import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  limit?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  className = '',
  required,
  limit,
  value = '',
  onChange,
  ...props
}) => {
  const currentLength = typeof value === 'string' ? value.length : 0;
  const isOverLimit = limit !== undefined && currentLength > limit;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (limit !== undefined && e.target.value.length > limit) {
      return;
    }
    onChange?.(e);
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none ${
            error || isOverLimit ? 'border-red-500' : ''
          } ${className}`}
          required={required}
          value={value}
          onChange={handleChange}
          {...props}
        />
        {limit !== undefined && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            {currentLength}/{limit}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {isOverLimit && (
        <p className="mt-1 text-sm text-red-500">Character limit exceeded</p>
      )}
    </div>
  );
};

export default Input; 