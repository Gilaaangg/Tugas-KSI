import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFavorites, removeFavorite } from '../../api/favorites.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function Favorites() {
  const { addToast } = useToast();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    setLoading(true);
    getFavorites()
      .then((res) => setFavorites(res?.data || []))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  };

  const handleRemove = async (e, id) => {
    e.preventDefault();
    try {
      await removeFavorite(id);
      setFavorites((prev) => prev.filter((f) => f.contentId !== id && f.id !== id));
      addToast('Dihapus dari daftar simpanan', 'success');
    } catch {
      addToast('Gagal menghapus', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <section className="bg-gradient-to-b from-[#F7F2EB] to-[#FDFBF7] border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-amber-900 font-bold block mb-3">
              KOLEKSI PRIBADI
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-stone-900 font-bold tracking-tight mb-3">
              Tersimpan
            </h1>
            <p className="font-sans text-stone-600 text-sm md:text-base max-w-xl leading-relaxed">
              Arsip cerita sejarah, kebudayaan, dan artefak yang Anda simpan untuk dibaca kembali.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-200 overflow-hidden h-[360px]">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-5">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <EmptyState
              title="Koleksi Kosong"
              message="Anda belum menyimpan konten apapun. Jelajahi monograf museum kami dan simpan yang menarik bagi Anda."
              actionLabel="Mulai Menjelajah"
              onAction={() => window.location.assign('/jelajah')}
            />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {favorites.map((fav, idx) => {
              const content = fav.content || fav; // Handle both nested and flat responses
              return (
                <motion.div
                  key={content.id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={idx}
                >
                  <Link
                    to={`/konten/${content.slug || content.id}`}
                    className="group block h-full bg-white border border-stone-200/80 hover:border-amber-900/30 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col relative"
                  >
                    <button
                      onClick={(e) => handleRemove(e, content.id)}
                      className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 rounded-full shadow-sm backdrop-blur-sm transition-colors"
                      title="Hapus dari tersimpan"
                    >
                      ✕
                    </button>

                    <div className="h-48 w-full overflow-hidden relative bg-[#F7F2EB]">
                      {content.image || content.heroImage ? (
                        <img
                          src={content.image || content.heroImage}
                          alt={content.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <span className="text-4xl">🏛️</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200 font-sans text-[10px] uppercase font-bold tracking-wider">
                          {content.category?.name || content.category || 'Museum'}
                        </span>
                      </div>
                      
                      <h3 className="font-serif text-xl font-bold text-stone-900 mb-2 group-hover:text-amber-900 transition-colors line-clamp-2 leading-tight">
                        {content.title}
                      </h3>
                      
                      <div className="mt-auto pt-4 flex items-center gap-4 text-xs font-sans text-stone-500 border-t border-stone-100">
                        {content.period && (
                          <span className="truncate flex-1">📅 {content.period}</span>
                        )}
                        {content.location && (
                          <span className="truncate flex-1 text-right">📍 {content.location}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
