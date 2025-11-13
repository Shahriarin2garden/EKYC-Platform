import React from 'react';

interface TextAreaFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  isFocused?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  rows = 3,
  required = false,
  isFocused = false
}) => {
  const hasValue = value && value.length > 0;
  const charCount = value.length;
  const maxChars = 500;
  const isNearLimit = charCount > maxChars * 0.8;

  const getTextAreaClassName = (): string => {
    const baseClasses = 'w-full px-5 py-4 border-2 rounded-2xl transition-all duration-300 outline-none resize-none font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal';
    
    if (isFocused) {
      return `${baseClasses} border-blue-400 bg-blue-50/30 shadow-md shadow-blue-100/50 ring-2 ring-blue-200/50`;
    }
    if (hasValue) {
      return `${baseClasses} border-gray-300 bg-gray-50/50 hover:border-gray-400`;
    }
    return `${baseClasses} border-gray-200 bg-gray-50/50 hover:border-gray-300 focus:border-blue-500 focus:bg-blue-50/50 focus:ring-4 focus:ring-blue-100`;
  };

  return (
    <div className="group animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <label 
          className="text-sm font-bold text-gray-700 transition-colors group-focus-within:text-blue-600" 
          htmlFor={id}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hasValue && (
          <span className={`text-xs font-semibold transition-colors ${isNearLimit ? 'text-orange-600' : 'text-gray-500'}`}>
            {charCount} / {maxChars}
          </span>
        )}
      </div>
      <div className="relative">
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          rows={rows}
          required={required}
          maxLength={maxChars}
          className={getTextAreaClassName()}
          placeholder={placeholder}
        />
        
        {/* Focus Ring Effect - Subtle and non-distracting */}
        {isFocused && (
          <div className="absolute inset-0 -m-1 rounded-2xl bg-blue-400 opacity-10 blur-lg pointer-events-none"></div>
        )}

        {/* Character Count Progress Bar */}
        {hasValue && (
          <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isNearLimit 
                  ? 'bg-gradient-to-r from-orange-400 to-red-500' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }`}
              style={{ width: `${(charCount / maxChars) * 100}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextAreaField;
