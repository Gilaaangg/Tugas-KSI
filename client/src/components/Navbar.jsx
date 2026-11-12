import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    addToast('Anda telah keluar dari sesi museum', 'info');
    navigate('/');
  };

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Jelajah Museum', path: '/jelajah' },
    { name: 'Peta Sejarah', path: '/peta' },
    { name: 'Garis Waktu', path: '/garis-waktu' },
    { name: 'Bagikan Jejak', path: '/bagikan-jejak' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F9F6F0]/90 backdrop-blur-md shadow-sm border-b border-stone-200/60 py-3'
          : 'bg-[#F9F6F0] py-4 border-b border-stone-200/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-amber-900 flex items-center justify-center text-amber-50 font-serif font-bold text-xl shadow-sm group-hover:bg-amber-950 transition">
            J
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg text-stone-900 tracking-wide leading-none group-hover:text-amber-900 transition">
              JEJAK
            </span>
            <span className="text-[10px] text-amber-800 font-sans font-medium tracking-wider uppercase">
              Museum Digital Lampung
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-sans font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-amber-900 font-semibold border-b-2 border-amber-900 pb-0.5'
                  : 'text-stone-700 hover:text-amber-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions: Search + Auth */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/pencarian"
            className="p-2 text-stone-600 hover:text-amber-900 transition rounded-full hover:bg-stone-200/50"
            title="Cari Konten Museum"
          >
            🔍
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-stone-200/60 transition focus:outline-none border border-stone-300"
              >
                <img
                  src={user?.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover border border-amber-800/30"
                />
                <span className="text-xs font-medium text-stone-800 max-w-[100px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
                <span className="text-xs text-stone-500">▾</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#F9F6F0] rounded-xl shadow-xl border border-stone-300 py-2 z-50 animate-fade-in font-sans">
                  <div className="px-4 py-2 border-b border-stone-200">
                    <p className="text-xs font-semibold text-stone-900 truncate">{user?.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded bg-amber-900/10 text-amber-900">
                      Role: {user?.role}
                    </span>
                  </div>

                  <Link
                    to="/bagikan-jejak"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-stone-700 hover:bg-amber-900/10 hover:text-amber-900"
                  >
                    ✍️ Bagikan Cerita/Kontribusi
                  </Link>
                  <Link
                    to="/kontribusi-saya"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-stone-700 hover:bg-amber-900/10 hover:text-amber-900"
                  >
                    📂 Riwayat Kontribusi Saya
                  </Link>
                  <Link
                    to="/favorit"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-stone-700 hover:bg-amber-900/10 hover:text-amber-900"
                  >
                    ⭐ Koleksi Favorit Saya
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-100/60 hover:bg-amber-200/80 border-t border-b border-amber-200/60 my-1"
                    >
                      🛡️ Admin & Konsol Kurasi
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 font-medium"
                  >
                    🚪 Keluar dari Sesi
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-amber-50 rounded-lg text-xs font-medium transition shadow-sm"
            >
              Masuk / Daftar
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-stone-800 hover:text-amber-900 text-xl focus:outline-none"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F9F6F0] border-b border-stone-200 px-4 pt-2 pb-6 flex flex-col gap-3 font-sans shadow-lg animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2 text-sm font-medium border-b border-stone-200/50 ${
                isActive(link.path) ? 'text-amber-900 font-semibold' : 'text-stone-700'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/pencarian"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-stone-700 border-b border-stone-200/50 flex items-center gap-2"
          >
            <span>🔍 Pencarian Museum</span>
          </Link>

          {isAuthenticated ? (
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center gap-3 p-2 rounded bg-stone-200/50">
                <img
                  src={user?.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                  alt={user?.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="text-xs">
                  <p className="font-semibold text-stone-900">{user?.name}</p>
                  <p className="text-stone-500">{user?.role}</p>
                </div>
              </div>
              <Link
                to="/kontribusi-saya"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-xs text-stone-700"
              >
                📂 Riwayat Kontribusi Saya
              </Link>
              <Link
                to="/favorit"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-xs text-stone-700"
              >
                ⭐ Koleksi Favorit
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 text-xs font-bold text-amber-900"
                >
                  🛡️ Admin & Konsol Kurasi
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-left py-1.5 text-xs text-rose-700 font-medium"
              >
                🚪 Keluar
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 w-full text-center py-2.5 bg-amber-900 text-amber-50 rounded-lg text-sm font-medium"
            >
              Masuk / Daftar
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
