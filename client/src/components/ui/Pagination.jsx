import React from 'react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded border border-stone-300 text-stone-700 disabled:opacity-40 hover:bg-stone-200 text-sm font-sans"
      >
        Sebelumnya
      </button>
      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded text-sm font-medium transition ${
              p === currentPage
                ? 'bg-amber-900 text-amber-50'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded border border-stone-300 text-stone-700 disabled:opacity-40 hover:bg-stone-200 text-sm font-sans"
      >
        Selanjutnya
      </button>
    </div>
  );
};
