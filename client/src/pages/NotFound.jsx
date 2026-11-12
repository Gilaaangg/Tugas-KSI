import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicLayout from '../components/layout/PublicLayout.jsx';

export default function NotFound() {
  return (
    <PublicLayout>
      <section className="bg-[#F9F6F0] min-h-screen flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg w-full text-center"
        >
          {/* Decorative element */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <span className="font-serif text-[12rem] font-bold text-stone-900 select-none leading-none">
                404
              </span>
            </div>
            <div className="relative pt-12 pb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-100 to-amber-200/60 flex items-center justify-center shadow-lg border border-amber-200/50">
                <span className="text-5xl" role="img" aria-label="Peta gulungan">
                  🗺️
                </span>
              </div>
            </div>
          </div>

          {/* Text */}
          <p className="eyebrow text-amber-800 mb-3 tracking-widest text-xs uppercase font-sans font-semibold">
            Halaman Tidak Ditemukan
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            Jejak Ini Belum Terpetakan
          </h1>
          <p className="text-stone-600 font-sans text-base leading-relaxed mb-8 max-w-md mx-auto">
            Seperti artefak yang masih tersembunyi, halaman yang Anda cari belum ditemukan.
            Mungkin telah dipindahkan atau belum ada.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-900 hover:bg-amber-950 text-amber-50 rounded-lg text-sm font-medium font-sans transition shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Kembali ke Beranda
            </Link>
            <Link
              to="/jelajah"
              className="inline-flex items-center gap-2 px-6 py-3 border border-amber-900/30 text-amber-950 hover:bg-amber-900/5 rounded-lg text-sm font-medium font-sans transition"
            >
              Jelajahi Museum
            </Link>
          </div>

          {/* Subtle ornament */}
          <div className="mt-12 flex items-center justify-center gap-2 text-stone-300">
            <div className="w-8 h-px bg-stone-300" />
            <span className="text-xs font-serif italic text-stone-400">JEJAK — Museum Digital Lampung</span>
            <div className="w-8 h-px bg-stone-300" />
          </div>
        </motion.div>
      </section>
    </PublicLayout>
  );
}
