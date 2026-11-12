import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  let styles = 'bg-stone-100 text-stone-800 border-stone-200';

  if (variant === 'verified') {
    styles = 'bg-amber-900/10 text-amber-900 border-amber-800/30 font-medium';
  } else if (variant === 'sejarah') {
    styles = 'bg-amber-900/10 text-amber-900 border-amber-800/20';
  } else if (variant === 'budaya') {
    styles = 'bg-emerald-900/10 text-emerald-900 border-emerald-800/20';
  } else if (variant === 'artefak') {
    styles = 'bg-amber-700/10 text-amber-950 border-amber-700/20';
  } else if (variant === 'tokoh') {
    styles = 'bg-purple-900/10 text-purple-900 border-purple-800/20';
  } else if (variant === 'tempat') {
    styles = 'bg-sky-900/10 text-sky-900 border-sky-800/20';
  } else if (variant === 'SUBMITTED' || variant === 'UNDER_REVIEW') {
    styles = 'bg-sky-50 text-sky-800 border-sky-200';
  } else if (variant === 'APPROVED') {
    styles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (variant === 'REVISION') {
    styles = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (variant === 'REJECTED') {
    styles = 'bg-rose-50 text-rose-800 border-rose-200';
  } else if (variant === 'DRAFT') {
    styles = 'bg-stone-100 text-stone-600 border-stone-300';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border tracking-wide font-sans transition ${styles} ${className}`}
    >
      {children}
    </span>
  );
};
