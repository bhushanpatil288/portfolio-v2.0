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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm px-4 py-2.5';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-400 text-white shadow-sm hover:shadow active:scale-[0.98]',
    secondary: 'bg-blue-50 text-blue-800 hover:bg-blue-100 active:scale-[0.98]',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200'
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
