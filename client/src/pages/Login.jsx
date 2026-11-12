import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import PublicLayout from '../components/layout/PublicLayout.jsx';

const configuredGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || '';
const GOOGLE_CLIENT_ID = /^(\d+-[a-z0-9-]+\.apps\.googleusercontent\.com)$/i.test(configuredGoogleClientId)
  ? configuredGoogleClientId
  : '';
const IS_DEV = import.meta.env.DEV;

export default function Login() {
  const { user, isAuthenticated, loginWithPassword, register, loginWithGoogle, devLogin, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [devLoading, setDevLoading] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    name: '',
    username: '',
    email: '',
  });

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fillQuickAccount = (username, password) => {
    setMode('login');
    setFormData((prev) => ({ ...prev, identifier: username, password }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!formData.identifier.trim() || !formData.password) {
          addToast('Username/Email dan password wajib diisi', 'warning');
          setLoading(false);
          return;
        }
        await loginWithPassword(formData.identifier, formData.password);
        addToast('Selamat datang kembali di Museum JEJAK!', 'success');
        navigate(from, { replace: true });
      } else {
        if (!formData.name.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password) {
          addToast('Semua kolom pendaftaran wajib diisi', 'warning');
          setLoading(false);
          return;
        }
        await register({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        addToast('Akun Anda berhasil didaftarkan!', 'success');
        navigate(from, { replace: true });
      }
    } catch (err) {
      addToast(err.message || 'Terjadi kesalahan saat masuk', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      addToast('Berhasil masuk dengan akun Google', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      addToast(err.message || 'Gagal masuk dengan Google', 'error');
    }
  };

  const handleGoogleError = () => {
    addToast('Login Google dibatalkan atau gagal', 'error');
  };

  const handleDevLogin = async (role) => {
    try {
      setDevLoading(role);
      await devLogin(role);
      addToast(`Masuk sebagai ${role} (mode dev)`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      addToast(err.message || 'Dev login gagal', 'error');
    } finally {
      setDevLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      addToast('Berhasil keluar dari sesi', 'info');
    } catch (err) {
      addToast('Gagal keluar', 'error');
    }
  };

  // Logged-in view
  if (isAuthenticated && user) {
    return (
      <PublicLayout>
        <section className="bg-[#F9F6F0] min-h-screen flex items-center justify-center py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="bg-white/80 backdrop-blur rounded-2xl border border-stone-200/80 shadow-xl p-8 text-center">
              <div className="mb-5">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || user.email}
                    className="w-20 h-20 rounded-full mx-auto border-4 border-amber-100 shadow-md object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full mx-auto bg-amber-900 flex items-center justify-center text-amber-100 text-2xl font-serif font-bold border-4 border-amber-100 shadow-md">
                    {(user.name || user.username || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <h2 className="font-serif text-xl font-bold text-stone-900 mb-1">
                {user.name || 'Pengguna'}
              </h2>
              {user.username && (
                <p className="text-xs text-amber-900 font-mono mb-1">@{user.username}</p>
              )}
              <p className="text-sm text-stone-500 font-sans mb-1">{user.email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border bg-amber-900/10 text-amber-900 border-amber-800/30 font-medium font-sans mb-6">
                Peran: {user.role}
              </span>

              <p className="text-sm text-stone-600 font-sans mb-6">
                Anda sudah masuk. Lanjutkan menjelajahi jejak sejarah dan budaya Lampung.
              </p>

              <div className="space-y-3">
                <Link
                  to="/"
                  className="block w-full px-4 py-2.5 bg-amber-900 hover:bg-amber-950 text-amber-50 rounded-lg text-sm font-medium font-sans transition text-center"
                >
                  Ke Beranda
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="block w-full px-4 py-2.5 bg-stone-900 hover:bg-black text-stone-100 rounded-lg text-sm font-medium font-sans transition text-center"
                  >
                    Dashboard Kurator (Admin)
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg text-sm font-medium font-sans transition"
                >
                  Keluar dari Sesi
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="bg-[#F9F6F0] min-h-screen flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-3">
              <span className="font-serif text-3xl font-bold text-amber-900 tracking-tight">
                JEJAK
              </span>
            </Link>
            <h1 className="font-serif text-2xl font-bold text-stone-900 mb-2">
              {mode === 'login' ? 'Masuk ke Museum Digital' : 'Daftar Akun Baru'}
            </h1>
            <p className="text-sm text-stone-500 font-sans leading-relaxed max-w-sm mx-auto">
              {mode === 'login'
                ? 'Gunakan username atau email dan kata sandi Anda untuk mengakses museum.'
                : 'Buat akun untuk berkontribusi cerita sejarah dan menyimpan koleksi favorit.'}
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-xl p-6 sm:p-8">
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-lg bg-stone-100 p-1 mb-6 border border-stone-200">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                  mode === 'login'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Masuk (Login)
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                  mode === 'register'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Daftar Akun
              </button>
            </div>

            {/* Quick Credentials Helper */}
            {mode === 'login' && (
              <div className="mb-6 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
                <span className="font-bold block mb-1.5 flex items-center gap-1.5">
                  <span>💡</span> Kredensial Demo Cepat (Klik untuk isi):
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('admin', 'admin123')}
                    className="px-2.5 py-1 rounded bg-amber-900 text-amber-50 font-mono text-[11px] hover:bg-amber-950 transition"
                  >
                    🛡️ Admin: admin / admin123
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('warga', 'user123')}
                    className="px-2.5 py-1 rounded bg-stone-200 text-stone-800 font-mono text-[11px] hover:bg-stone-300 transition"
                  >
                    👤 Warga: warga / user123
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div
                    key="register-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Contoh: Raden Danu"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                        required={mode === 'register'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Contoh: radendanu"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                        required={mode === 'register'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="nama@email.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                        required={mode === 'register'}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {mode === 'login' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Username atau Email
                  </label>
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="admin atau nama@email.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Kata Sandi (Password)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 4 karakter"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center py-2.5 bg-amber-900 hover:bg-amber-950 text-amber-50"
                isLoading={loading}
              >
                {mode === 'login' ? 'Masuk ke Museum' : 'Daftar Sekarang'}
              </Button>
            </form>

            {/* Google OAuth Section */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-stone-400 font-sans">
                  atau masuk dengan
                </span>
              </div>
            </div>

            <div className="mb-4">
              {GOOGLE_CLIENT_ID ? (
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      shape="rectangular"
                      theme="outline"
                      size="large"
                      text="signin_with"
                      width="320"
                      locale="id"
                    />
                  </div>
                </GoogleOAuthProvider>
              ) : (
                <div className="text-center p-3 rounded-lg bg-stone-50 border border-stone-200">
                  <p className="text-[11px] text-stone-500 font-sans">
                    Login Google OAuth (opsional/belum dipasang Client ID di .env)
                  </p>
                </div>
              )}
            </div>

            {/* Dev Login */}
            {IS_DEV && (
              <div className="pt-3 border-t border-stone-200">
                <p className="text-[11px] text-stone-400 font-sans text-center mb-2">
                  Akses Cepat Pengembang (Dev Mode):
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center text-xs"
                    onClick={() => handleDevLogin('USER')}
                    isLoading={devLoading === 'USER'}
                    disabled={devLoading !== null}
                  >
                    👤 User
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="justify-center text-xs"
                    onClick={() => handleDevLogin('ADMIN')}
                    isLoading={devLoading === 'ADMIN'}
                    disabled={devLoading !== null}
                  >
                    🛡️ Admin
                  </Button>
                </div>
              </div>
            )}
          </div>

          <p className="text-center mt-6 text-xs text-stone-500 font-sans">
            Kembali ke{' '}
            <Link to="/" className="text-amber-900 hover:text-amber-800 font-semibold underline underline-offset-2">
              Beranda Museum
            </Link>
          </p>
        </motion.div>
      </section>
    </PublicLayout>
  );
}
