import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  let base = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/40 disabled:opacity-50 disabled:cursor-not-allowed';

  let variants = {
    primary: 'bg-amber-900 hover:bg-amber-950 text-amber-50 shadow-sm',
    secondary: 'bg-stone-900 hover:bg-black text-stone-100',
    outline: 'border border-amber-900/30 text-amber-950 hover:bg-amber-900/5',
    ghost: 'text-stone-700 hover:bg-stone-200/60',
    danger: 'bg-rose-900 hover:bg-rose-950 text-rose-50',
  };

  let sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Memuat...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
