import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-stone-600 font-serif text-sm">Memeriksa hak akses Kurator...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F6F0] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-900 mb-4 text-2xl font-serif">
          🛡️
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">Akses Terbatas Kurator</h1>
        <p className="text-stone-600 max-w-md mb-6 text-sm">
          Halaman ini khusus untuk Dewan Kurator / Admin JEJAK Museum Digital. Akun Anda saat ini memiliki role <strong>{user.role}</strong>.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-amber-50 rounded-lg text-sm font-medium transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return children;
};
