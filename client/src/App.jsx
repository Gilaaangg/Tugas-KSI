import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-surface font-sans">
      {!isAdmin && <Navbar />}
      <main className={`flex-1 ${!isAdmin ? 'pt-[72px]' : ''}`}>
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-on-surface-variant font-serif text-sm">Memuat museum digital...</p>
              </div>
            </div>
          }
        >
          <AppRoutes />
        </Suspense>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}
