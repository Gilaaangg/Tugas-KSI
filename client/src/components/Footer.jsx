import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-900 font-sans">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
      {/* Brand & Manifesto */}
      <div className="md:col-span-2 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-800 flex items-center justify-center text-amber-100 font-serif font-bold text-2xl">
            J
          </div>
          <span className="font-serif font-bold text-2xl text-stone-100 tracking-wide">
            JEJAK
          </span>
        </div>
        <p className="text-amber-200/80 font-serif italic text-base">
          "Temukan sejarahnya. Jaga ceritanya."
        </p>
        <p className="text-stone-400 text-sm leading-relaxed max-w-md">
          JEJAK adalah museum digital interaktif yang didedikasikan untuk mengenalkan, mendokumentasikan, dan memelihara kekayaan sejarah, artefak, tokoh, serta warisan kebudayaan provinsi Lampung.
        </p>
      </div>

      {/* Navigasi Museum */}
      <div className="flex flex-col gap-3">
        <h4 className="font-serif font-bold text-stone-100 text-sm tracking-wider uppercase border-b border-stone-800 pb-2">
          Jelajah Museum
        </h4>
        <Link to="/jelajah?type=sejarah" className="text-xs text-stone-400 hover:text-amber-300 transition">
          Peristiwa Sejarah
        </Link>
        <Link to="/jelajah?type=budaya" className="text-xs text-stone-400 hover:text-amber-300 transition">
          Warisan Budaya & Tradisi
        </Link>
        <Link to="/jelajah?type=artefak" className="text-xs text-stone-400 hover:text-amber-300 transition">
          Artefak & Tekstil Tapis
        </Link>
        <Link to="/jelajah?type=tokoh" className="text-xs text-stone-400 hover:text-amber-300 transition">
          Tokoh & Pahlawan Lampung
        </Link>
        <Link to="/jelajah?type=tempat" className="text-xs text-stone-400 hover:text-amber-300 transition">
          Cagar Budaya & Situs
        </Link>
        <Link to="/jelajah?type=artikel" className="text-xs text-stone-400 hover:text-amber-300 transition">
          Artikel & Riset Editorial
        </Link>
      </div>

      {/* Fitur & Kontribusi */}
      <div className="flex flex-col gap-3">
        <h4 className="font-serif font-bold text-stone-100 text-sm tracking-wider uppercase border-b border-stone-800 pb-2">
          Partisipasi Warga
        </h4>
        <Link to="/peta" className="text-xs text-stone-400 hover:text-amber-300 transition">
          Peta Sejarah Interaktif
        </Link>
        <Link to="/garis-waktu" className="text-xs text-stone-400 hover:text-amber-300 transition">
          Garis Waktu Peradaban
        </Link>
        <Link to="/bagikan-jejak" className="text-xs text-stone-400 hover:text-amber-300 transition">
          Bagikan Jejak Cerita Lokal
        </Link>
        <Link to="/login" className="text-xs text-stone-400 hover:text-amber-300 transition">
          Sesi Pengguna & Kurator
        </Link>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-stone-900 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
      <p>© 2026 JEJAK Museum Digital Lampung. Hak Cipta Dilindungi.</p>
      <div className="flex items-center gap-6">
        <span>Falsafah Piil Pesenggiri</span>
        <span>Ruwa Jurai</span>
        <span>Sang Bumi Ruwa Jurai</span>
      </div>
    </div>
  </footer>
);
