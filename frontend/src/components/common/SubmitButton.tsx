import React from 'react';

interface SubmitButtonProps {
  loading: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  type?: 'submit' | 'button' | 'reset';
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  loading, 
  disabled = false, 
  children,
  type = 'submit'
}) => {
  const isDisabled = loading || disabled;

  return (
    <div className="relative group">
      {/* Subtle glow effect behind button - only on hover */}
      {!isDisabled && (
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500"></div>
      )}
      
      <button
        type={type}
        disabled={isDisabled}
        className={`relative w-full py-5 px-8 rounded-2xl font-bold text-lg text-white shadow-xl transform transition-all duration-300 overflow-hidden ${
          loading
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 cursor-wait'
            : isDisabled
            ? 'bg-gray-400 cursor-not-allowed opacity-60'
            : 'btn-gradient hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]'
        }`}
      >
        {/* Shimmer effect - only when not loading */}
        {!isDisabled && !loading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
        )}
        
        {/* Loading state with progress indicator */}
        {loading && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/30 to-blue-600/20 animate-shimmer pointer-events-none"></div>
        )}
        
        {loading ? (
          <span className="flex items-center justify-center">
            {/* Enhanced Loading Spinner */}
            <div className="relative w-7 h-7 mr-3">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-white border-r-white rounded-full animate-spin"></div>
            </div>
            <span className="font-semibold">Processing with AI...</span>
          </span>
        ) : (
          children || (
            <span className="flex items-center justify-center group">
              <span className="mr-2">Submit KYC Form</span>
              <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )
        )}
      </button>
    </div>
  );
};

export default SubmitButton;
