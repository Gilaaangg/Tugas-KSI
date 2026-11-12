import React from 'react';

export const EmptyState = ({ title = 'Belum Ada Konten', message = 'Tidak ditemukan data yang sesuai dengan pencarian atau filter Anda.', actionLabel, onAction }) => (
  <div className="py-16 px-4 text-center flex flex-col items-center justify-center max-w-md mx-auto">
    <div className="w-16 h-16 rounded-full bg-stone-200/80 flex items-center justify-center text-stone-500 mb-4 text-2xl font-serif">
      📜
    </div>
    <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">{title}</h3>
    <p className="text-stone-600 text-sm mb-6 leading-relaxed">{message}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="px-5 py-2 bg-amber-900 hover:bg-amber-950 text-amber-50 rounded-lg text-sm font-medium transition"
      >
        {actionLabel}
      </button>
    )}
  </div>
);
