import React from 'react';
import { cn } from '../../utils/cn.js';

export const Card = ({ children, className }) => {
  return (
    <div className={cn('bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300', className)}>
      {children}
    </div>
  );
};
