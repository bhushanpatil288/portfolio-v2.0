import React from 'react';
import { cn } from '../../utils/cn.js';

export const Badge = ({ children, className, variant = 'blue' }) => {
  const variants = {
    blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    outline: 'border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase', variants[variant], className)}>
      {children}
    </span>
  );
};
