import React from 'react';
import { FormStatus as FormStatusType } from '../../types';

interface FormStatusProps {
  status: FormStatusType;
}

const FormStatus: React.FC<FormStatusProps> = ({ status }) => {
  if (!status.message) {
    return null;
  }

  const isSuccess = status.type === 'success';

  return (
    <div className={`relative p-6 rounded-2xl animate-fade-in-up overflow-hidden shadow-lg ${
      isSuccess
        ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-2 border-green-400' 
        : 'bg-gradient-to-br from-red-50 via-rose-50 to-red-50 border-2 border-red-400'
    }`}>
      {/* Decorative background pattern - more subtle */}
      <div className="absolute inset-0 opacity-3">
        <div className={`absolute inset-0 ${isSuccess ? 'bg-green-600' : 'bg-red-600'}`} style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      <div className="relative flex items-start space-x-4">
        {/* Icon with subtle animation */}
        <div className="flex-shrink-0">
          {isSuccess ? (
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-20"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-red-400 rounded-full blur-lg opacity-20"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-red-400 to-rose-600 rounded-full flex items-center justify-center shadow-xl animate-shake">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pt-1">
          <h3 className={`text-base font-bold mb-1 ${
            isSuccess ? 'text-green-900' : 'text-red-900'
          }`}>
            {status.message}
          </h3>
          
          {status.summary && (
            <div className="mt-4 p-5 bg-white/95 backdrop-blur-sm rounded-xl border-2 border-blue-200 shadow-md">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-gray-900">AI-Generated Summary</p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed pl-12">{status.summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormStatus;
