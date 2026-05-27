import React from 'react';
import { cn } from '../../utils/cn.js';

export const Badge = ({ children, className, variant = 'blue' }) => {
  const variants = {
    blue: 'bg-blue-100 text-blue-800 border border-blue-200',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    outline: 'border border-slate-300 text-slate-600'
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase', variants[variant], className)}>
      {children}
    </span>
  );
};
