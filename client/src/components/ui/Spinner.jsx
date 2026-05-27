import React from 'react';
import { cn } from '../../utils/cn.js';

export const Spinner = ({ className, size = 'md' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div className={cn(
        'animate-spin rounded-full border-t-blue-600 border-blue-100',
        sizes[size],
        className
      )}></div>
    </div>
  );
};
