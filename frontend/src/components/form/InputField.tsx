import React from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'number';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  isFocused?: boolean;
  showSuccessIcon?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  required = false,
  error,
  isFocused = false,
  showSuccessIcon = false
}) => {
  const hasValue = value && value.length > 0;
  const isValid = hasValue && !error;

  const getInputClassName = (): string => {
    const baseClasses = 'w-full px-5 py-4 border-2 rounded-2xl transition-all duration-300 outline-none font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal';
    
    if (error) {
      return `${baseClasses} border-red-400 bg-red-50/50 focus:border-red-500 focus:bg-red-50 focus:ring-4 focus:ring-red-100`;
    }
    if (isFocused) {
      return `${baseClasses} border-blue-400 bg-blue-50/30 shadow-md shadow-blue-100/50 ring-2 ring-blue-200/50`;
    }
    if (isValid && showSuccessIcon) {
      return `${baseClasses} border-green-400 bg-green-50/30 hover:border-green-500`;
    }
    return `${baseClasses} border-gray-200 bg-gray-50/50 hover:border-gray-300 focus:border-blue-500 focus:bg-blue-50/50 focus:ring-4 focus:ring-blue-100`;
  };

  return (
    <div className="group animate-slide-up">
      <label 
        className="block text-sm font-bold text-gray-700 mb-3 transition-colors group-focus-within:text-blue-600" 
        htmlFor={id}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          required={required}
          className={getInputClassName()}
          placeholder={placeholder}
        />
        
        {/* Success Icon */}
        {showSuccessIcon && isValid && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 animate-scale-in">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-40"></div>
              <div className="relative w-7 h-7 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Error Icon */}
        {error && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 animate-shake">
            <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        )}

        {/* Focus Ring Effect - Subtle and non-distracting */}
        {isFocused && !error && (
          <div className="absolute inset-0 -m-1 rounded-2xl bg-blue-400 opacity-10 blur-lg pointer-events-none"></div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-start space-x-1 animate-slide-in">
          <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default InputField;
