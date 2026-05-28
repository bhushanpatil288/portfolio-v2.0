import React from 'react';
import { cn } from '../../utils/cn.js';

export const Card = ({ children, className }) => {
  return (
    <div className={cn('bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-200/50 dark:hover:border-blue-800/50 transition-all duration-300', className)}>
      {children}
    </div>
  );
};
