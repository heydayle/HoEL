import React from 'react';

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const Error: React.FC<ErrorProps> = ({ message = 'Something went wrong.', onRetry, className = '' }) => (
  <div className={`flex flex-col items-center justify-center text-center text-red-600 py-8 ${className}`}>
    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-2">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
    </svg>
    <div className="mb-2 font-semibold">{message}</div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Retry
      </button>
    )}
  </div>
);

export default Error;
