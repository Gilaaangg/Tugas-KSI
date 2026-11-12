import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMyContributions } from '../../api/contributions.js';
import { Badge } from '../../components/ui/Badge.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function MyContributions() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getMyContributions()
      .then((res) => setContributions(res?.data || []))
      .catch(() => setContributions([]))
      .finally(() => setLoading(false));
  }, []);

  const getStatusLabel = (status) => {
    const map = {
      DRAFT: 'Draf',
      SUBMITTED: 'Terkirim',
      UNDER_REVIEW: 'Sedang Ditinjau',
      REVISION: 'Butuh Revisi',
      APPROVED: 'Disetujui',
      REJECTED: 'Ditolak',
    };
    return map[status] || status;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <section className="bg-gradient-to-b from-[#F7F2EB] to-[#FDFBF7] border-b border-stone-200/60">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12 md:py-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-amber-900 font-bold block mb-3">
              ARSIP PRIBADI
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-stone-900 font-bold tracking-tight mb-2">
              Kontribusi Saya
            </h1>
            <p className="font-sans text-stone-600 text-sm md:text-base max-w-xl leading-relaxed">
              Pantau status peninjauan dan kelola draf kisah sejarah atau warisan budaya yang Anda bagikan.
            </p>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <Link
              to="/bagikan-jejak"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-amber-50 rounded-lg text-sm font-medium transition shadow-sm"
            >
              <span className="text-lg leading-none">+</span>
              Tulis Cerita Baru
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-stone-200/80 rounded-xl p-5">
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-5" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        ) : contributions.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <EmptyState
              title="Belum Ada Kontribusi"
              message="Anda belum membagikan cerita atau draf. Mulai lestarikan warisan dengan membagikan kisah lokal."
              actionLabel="Mulai Menulis"
              onAction={() => window.location.assign('/tambah-cerita')}
            />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contributions.map((item, idx) => (
              <motion.div
                key={item.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={idx}
              >
                <Link
                  to={`/kontribusi/${item.id}`}
                  className="block h-full bg-white border border-stone-200/80 hover:border-amber-900/40 rounded-xl p-6 transition-all hover:shadow-md group flex flex-col"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <Badge variant={item.status}>{getStatusLabel(item.status)}</Badge>
                    <span className="text-stone-400 text-xs font-sans whitespace-nowrap">
                      {new Date(item.updatedAt || item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-2 group-hover:text-amber-900 transition-colors line-clamp-2">
                    {item.title || 'Draf Tanpa Judul'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-auto pt-4 text-xs font-sans text-stone-600">
                    {item.category && (
                      <span className="flex items-center gap-1.5">
                        <span className="opacity-60">🏷️</span> {item.category}
                      </span>
                    )}
                    {item.region && (
                      <span className="flex items-center gap-1.5">
                        <span className="opacity-60">📍</span> {item.region}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
