import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const NAV_LINKS = [
  { to: '/',            label: 'Beranda',     exact: true },
  { to: '/jelajah',     label: 'Jelajah' },
  { to: '/peta',        label: 'Peta Sejarah' },
  { to: '/garis-waktu', label: 'Garis Waktu' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-[#FBF8F4]/95 backdrop-blur-xl border-b border-[#E3DDD3] shadow-[0_2px_12px_rgba(0,0,0,0.05)]'
          : 'bg-[#FBF8F4]/90 backdrop-blur-xl border-b border-[#E3DDD3]'
        }`}
    >
      <div className="h-20 container-page flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '18px' }}>
              museum
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-semibold text-primary leading-none tracking-wide"
                  style={{ fontSize: '1.25rem' }}>
              JEJAK
            </span>
            <span className="font-sans text-on-surface-variant uppercase tracking-widest mt-0.5"
                  style={{ fontSize: '0.575rem', letterSpacing: '0.18em', fontWeight: 700 }}>
              Museum Digital Lampung
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `font-sans uppercase tracking-wider transition-colors duration-200 pb-1 text-sm font-semibold
                 ${isActive
                   ? 'text-primary border-b-2 border-primary'
                   : 'text-on-surface-variant hover:text-on-surface'
                 }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            aria-label="Pencarian"
            onClick={() => navigate('/pencarian')}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low
                       rounded-full transition-colors duration-200"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
          </button>

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full
                                 hover:bg-surface-container transition-colors">
                {user.picture ? (
                  <img src={user.picture} alt={user.name}
                       className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary"
                          style={{ fontSize: '15px' }}>person</span>
                  </div>
                )}
                <span className="font-sans text-sm text-on-surface">
                  {user.name?.split(' ')[0]}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant"
                      style={{ fontSize: '16px' }}>expand_more</span>
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-52 bg-surface-container-lowest
                              border border-outline-variant rounded-lg shadow-lg
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible
                              transition-all duration-200 z-50">
                <div className="p-3 border-b border-outline-variant">
                  <p className="font-sans text-sm text-on-surface font-medium truncate">{user.name}</p>
                  <p className="font-sans text-xs text-on-surface-variant truncate">{user.email}</p>
                </div>
                <div className="p-1">
                  {user.role === 'ADMIN' && (
                    <Link to="/admin"
                          className="flex items-center gap-2 px-3 py-2 rounded
                                     text-on-surface text-sm hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-primary"
                            style={{ fontSize: '16px' }}>admin_panel_settings</span>
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/kontribusi-saya"
                        className="flex items-center gap-2 px-3 py-2 rounded
                                   text-on-surface text-sm hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-primary"
                          style={{ fontSize: '16px' }}>folder_open</span>
                    Kontribusi Saya
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded
                               text-on-surface text-sm hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant"
                          style={{ fontSize: '16px' }}>logout</span>
                    Keluar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/masuk"
                  className="flex items-center gap-1.5 px-3 py-2 rounded
                             text-on-surface-variant text-sm font-sans
                             hover:text-on-surface hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person</span>
              Masuk
            </Link>
          )}

          <Link to="/bagikan-jejak"
                className="inline-flex items-center gap-2 px-4 py-2 rounded
                           border border-primary text-primary font-sans text-sm uppercase tracking-wider font-semibold
                           hover:bg-primary hover:text-on-primary transition-all duration-300">
            Bagikan Jejak
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Buka menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-outline-variant bg-surface-container-lowest">
          <nav className="container-page py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded font-sans text-sm uppercase tracking-wider transition-colors
                   ${isActive
                     ? 'bg-surface-container text-primary font-semibold'
                     : 'text-on-surface hover:bg-surface-container-low'
                   }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="mt-3 pt-3 border-t border-outline-variant flex flex-col gap-2">
              <Link to="/bagikan-jejak"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary w-full justify-center">
                Bagikan Jejak
              </Link>
              {!user && (
                <Link to="/masuk"
                      onClick={() => setMobileOpen(false)}
                      className="btn-ghost w-full justify-center">
                  Masuk
                </Link>
              )}
              {user && (
                <>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin"
                          onClick={() => setMobileOpen(false)}
                          className="btn-ghost w-full justify-center">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/kontribusi-saya"
                        onClick={() => setMobileOpen(false)}
                        className="btn-ghost w-full justify-center">
                    Kontribusi Saya
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="btn-ghost w-full justify-center text-error"
                  >
                    Keluar
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
