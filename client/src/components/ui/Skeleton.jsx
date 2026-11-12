import React from 'react';

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-stone-300/60 rounded ${className}`} />
);

export const StoryCardSkeleton = () => (
  <div className="bg-white/80 rounded-xl border border-stone-200/80 overflow-hidden shadow-sm flex flex-col h-full">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-5 flex flex-col flex-1 gap-3">
      <div className="flex gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="mt-auto pt-4 flex justify-between items-center border-t border-stone-100">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);
