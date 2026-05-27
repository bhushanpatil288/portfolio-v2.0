import React from 'react';
import { cn } from '../../utils/cn.js';

export const Button = ({
  children,
  className,
  variant = 'primary',
  type = 'button',
  disabled,
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm px-4 py-2.5';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-400 text-white shadow-sm hover:shadow active:scale-[0.98]',
    secondary: 'bg-blue-50 dark:bg-blue-900/35 text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/60 active:scale-[0.98]',
    ghost: 'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 active:bg-slate-200 dark:active:bg-slate-700'
  };

  return (
    <button
      type={type}
      className={cn(baseStyles, variants[variant], className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
