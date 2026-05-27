import React from 'react';

export const PageWrapper = ({ children, className = '' }) => {
  return (
    <div className={`max-w-6xl mx-auto px-4 py-8 md:py-12 w-full flex flex-col flex-grow ${className}`}>
      {children}
    </div>
  );
};
