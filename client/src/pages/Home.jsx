import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { getContents } from '../api/contents.js';
import { getCategories } from '../api/categories.js';
import { Skeleton } from '../components/ui/Skeleton.jsx';

/* ─── Motion primitives ─── */
const useFade = () => {
  const reduced = useReducedMotion();
  return useMemo(() => ({
    hidden: { opacity: 0, y: reduced ? 0 : 28 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.15 : 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
    }),
  }), [reduced]);
};

const viewport = { once: true, amount: 0.15 };

/* ─── Content type config ─── */
const CONTENT_TYPES = [
  { key: 'sejarah', label: 'Sejarah', icon: '📜', description: 'Narasi masa lampau yang membentuk identitas Lampung' },
  { key: 'budaya',  label: 'Budaya',  icon: '🎭', description: 'Tradisi, ritual, dan warisan budaya yang hidup' },
  { key: 'artefak', label: 'Artefak', icon: '🏺', description: 'Benda-benda bersejarah yang menjadi saksi zaman' },
  { key: 'tokoh',   label: 'Tokoh',   icon: '👤', description: 'Figur-figur yang mewarnai sejarah Lampung' },
  { key: 'tempat',  label: 'Tempat',  icon: '🗺️', description: 'Lokasi-lokasi bersejarah dan budaya' },
  { key: 'artikel', label: 'Artikel', icon: '📰', description: 'Kajian mendalam dan esai kuratorial museum' },
];

/* ─── Story Card ─── */
const StoryCard = ({ content, index, fadeVariants }) => (
  <motion.article
    custom={index}
    variants={fadeVariants}
    initial="hidden"
    whileInView="visible"
    viewport={viewport}
    className="card-museum group flex flex-col"
  >
    <Link to={`/konten/${content.slug || content.id}`} className="flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        {content.image ? (
          <img
            src={content.image}
            alt={content.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-krem-200 to-krem-300 flex items-center justify-center">
            <span className="text-4xl opacity-40">📜</span>
          </div>
        )}
        <div className="card-overlay" />
        <div className="absolute bottom-3 left-3 z-10">
          <span className="badge-gold">{content.type || content.category?.name || '—'}</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1 gap-2">
        <h3 className="font-serif font-bold text-headline-sm text-on-surface leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {content.title}
        </h3>
        {content.subtitle && (
          <p className="text-body-sm text-on-surface-variant line-clamp-2">{content.subtitle}</p>
        )}
        <div className="mt-auto pt-4 border-t border-outline-variant flex items-center gap-2 text-on-surface-variant">
          {content.period && (
            <span className="text-archival-stamp uppercase tracking-widest">{content.period}</span>
          )}
          {content.region && (
            <>
              <span className="text-outline">·</span>
              <span className="text-archival-stamp uppercase tracking-widest">{content.region}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  </motion.article>
);

/* ─── Skeleton cards for loading ─── */
const FeaturedSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="card-museum flex flex-col">
        <Skeleton className="aspect-[4/3] w-full rounded-none" />
        <div className="p-5 flex flex-col gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-24 mt-4" />
        </div>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Home() {
  const fadeVariants = useFade();
  const [featured, setFeatured] = useState([]);
  const [typeCounts, setTypeCounts] = useState({});
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingCounts, setLoadingCounts] = useState(true);

  /* Fetch featured content */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getContents({ limit: 6, sort: 'newest' });
        if (!cancelled) setFeatured(res?.data || []);
      } catch {
        /* silent – UI shows empty */
      } finally {
        if (!cancelled) setLoadingFeatured(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* Fetch type counts */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const counts = {};
        await Promise.all(
          CONTENT_TYPES.map(async (t) => {
            try {
              const res = await getContents({ type: t.key, limit: 1 });
              counts[t.key] = res?.meta?.total ?? 0;
            } catch {
              counts[t.key] = 0;
            }
          })
        );
        if (!cancelled) setTypeCounts(counts);
      } catch {
        /* silent */
      } finally {
        if (!cancelled) setLoadingCounts(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative bg-tinta-900 text-krem-50 overflow-hidden">
        {/* Subtle noise texture */}
        <div className="absolute inset-0 archival-overlay opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-tinta-900/40 via-tinta-900/80 to-tinta-900" />

        <div className="container-page relative z-10 py-24 md:py-36 lg:py-44 flex flex-col items-center text-center">
          <motion.span
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            custom={0}
            className="eyebrow text-emas-300 mb-6"
          >
            Museum Digital Lampung
          </motion.span>

          <motion.h1
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-serif font-bold text-display-md-mobile md:text-display-md lg:text-display-lg max-w-4xl text-balance"
          >
            JEJAK
          </motion.h1>

          <motion.p
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-6 text-body-lg md:text-headline-sm text-krem-300 max-w-2xl leading-relaxed text-balance"
          >
            Menelusuri, mendokumentasikan, dan merayakan warisan sejarah &amp; budaya Lampung
            melalui koleksi digital yang terkurasi.
          </motion.p>

          <motion.div
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/jelajah" className="btn-primary bg-emas-500 hover:bg-emas-600 text-on-primary shadow-xl">
              <span className="material-symbols-outlined text-[18px]">explore</span>
              Jelajahi Koleksi
            </Link>
            <Link to="/bagikan-jejak" className="btn-outline border-krem-300 text-krem-100 hover:bg-krem-100/10 hover:text-krem-50">
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              Bagikan Jejak
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-16 md:mt-24"
          >
            <div className="w-5 h-9 border-2 border-krem-300/40 rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-2 bg-emas-300 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="bg-surface py-20 md:py-28 border-b border-outline-variant">
        <div className="container-page max-w-3xl mx-auto text-center">
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            custom={0}
          >
            <span className="eyebrow mb-4 block">Tentang Jejak</span>
            <h2 className="font-serif text-headline-lg-mobile md:text-headline-lg text-on-surface mb-6 text-balance">
              Setiap tanah punya cerita. Setiap cerita berhak dikenang.
            </h2>
            <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-prose mx-auto">
              <strong>JEJAK</strong> adalah museum digital yang mengarsipkan kekayaan sejarah dan
              budaya Lampung — dari prasasti kuno hingga tradisi lisan, dari artefak bersejarah
              hingga tokoh-tokoh yang membentuk identitas kita. Sebuah ruang terbuka bagi siapa
              saja untuk menelusuri, berkontribusi, dan mewariskan jejak peradaban.
            </p>
          </motion.div>

          <motion.div
            variants={fadeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            custom={1}
            className="mt-10 flex justify-center gap-8 text-center"
          >
            {[
              { icon: 'verified', label: 'Terkurasi', desc: 'Konten diverifikasi tim ahli' },
              { icon: 'public', label: 'Terbuka', desc: 'Gratis untuk semua' },
              { icon: 'group', label: 'Kolaboratif', desc: 'Siapa saja bisa berkontribusi' },
            ].map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-2 max-w-[140px]">
                <span className="material-symbols-outlined text-primary text-3xl">{v.icon}</span>
                <span className="font-serif font-bold text-body-md text-on-surface">{v.label}</span>
                <span className="text-archival-stamp text-on-surface-variant">{v.desc}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── EXPLORE GATEWAY ── */}
      <section className="bg-surface-container-low py-20 md:py-28">
        <div className="container-page">
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            custom={0}
            className="section-header"
          >
            <div>
              <span className="eyebrow mb-2 block">Koleksi</span>
              <h2 className="font-serif text-headline-lg-mobile md:text-headline-lg text-on-surface">
                Jelajahi Berdasarkan Kategori
              </h2>
            </div>
            <Link to="/jelajah" className="btn-ghost text-primary hover:text-emas-600">
              Lihat Semua
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {CONTENT_TYPES.map((type, i) => (
              <motion.div
                key={type.key}
                custom={i}
                variants={fadeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                <Link
                  to={`/jelajah?type=${type.key}`}
                  className="group block p-6 bg-surface-container-lowest border border-outline-variant rounded-lg
                             hover:border-primary hover:shadow-lg transition-all duration-500 h-full"
                >
                  <div className="text-4xl mb-4">{type.icon}</div>
                  <h3 className="font-serif font-bold text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                    {type.label}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-1 line-clamp-2">{type.description}</p>
                  <div className="mt-4 pt-3 border-t border-outline-variant">
                    {loadingCounts ? (
                      <Skeleton className="h-3 w-12" />
                    ) : (
                      <span className="text-archival-stamp text-primary">
                        {typeCounts[type.key] ?? 0} KONTEN
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED STORIES ── */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container-page">
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            custom={0}
            className="section-header"
          >
            <div>
              <span className="eyebrow mb-2 block">Pilihan</span>
              <h2 className="font-serif text-headline-lg-mobile md:text-headline-lg text-on-surface">
                Jejak Terbaru
              </h2>
              <p className="text-body-md text-on-surface-variant mt-2 max-w-lg">
                Cerita-cerita terkini yang telah dikurasi dan diverifikasi.
              </p>
            </div>
            <Link to="/jelajah" className="btn-outline">
              Jelajahi Semua
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </motion.div>

          {loadingFeatured ? (
            <FeaturedSkeleton />
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((content, i) => (
                <StoryCard key={content.id} content={content} index={i} fadeVariants={fadeVariants} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={fadeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="py-16 text-center"
            >
              <p className="text-on-surface-variant text-body-lg">
                Belum ada konten terpublikasi. Jadilah yang pertama berkontribusi!
              </p>
              <Link to="/bagikan-jejak" className="btn-primary mt-6 inline-flex">
                Bagikan Jejak Pertama
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── MAP & TIMELINE CTA ── */}
      <section className="bg-tinta-800 text-krem-100 py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 archival-overlay opacity-20" />
        <div className="container-page relative z-10">
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            custom={0}
            className="text-center mb-14"
          >
            <span className="eyebrow text-emas-300 mb-2 block">Eksplorasi Interaktif</span>
            <h2 className="font-serif text-headline-lg-mobile md:text-headline-lg text-krem-100">
              Telusuri Lampung Lewat Peta &amp; Garis Waktu
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              custom={1}
              variants={fadeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <Link
                to="/peta"
                className="group block p-8 rounded-lg bg-tinta-700/50 border border-krem-300/10 hover:border-emas-400/40
                           hover:bg-tinta-700/70 transition-all duration-500 text-center"
              >
                <span className="material-symbols-outlined text-5xl text-emas-300 mb-4 block group-hover:scale-110 transition-transform">
                  map
                </span>
                <h3 className="font-serif font-bold text-headline-sm text-krem-100 mb-2">
                  Peta Interaktif
                </h3>
                <p className="text-body-sm text-krem-300 leading-relaxed">
                  Jelajahi situs-situs bersejarah di Lampung melalui peta interaktif berbasis lokasi.
                </p>
                <span className="inline-flex items-center gap-1 text-emas-300 text-label-md mt-4 group-hover:gap-2 transition-all">
                  Buka Peta <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>
            </motion.div>

            <motion.div
              custom={2}
              variants={fadeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <Link
                to="/garis-waktu"
                className="group block p-8 rounded-lg bg-tinta-700/50 border border-krem-300/10 hover:border-emas-400/40
                           hover:bg-tinta-700/70 transition-all duration-500 text-center"
              >
                <span className="material-symbols-outlined text-5xl text-emas-300 mb-4 block group-hover:scale-110 transition-transform">
                  timeline
                </span>
                <h3 className="font-serif font-bold text-headline-sm text-krem-100 mb-2">
                  Garis Waktu
                </h3>
                <p className="text-body-sm text-krem-300 leading-relaxed">
                  Susuri kronologi peristiwa-peristiwa penting yang membentuk Lampung.
                </p>
                <span className="inline-flex items-center gap-1 text-emas-300 text-label-md mt-4 group-hover:gap-2 transition-all">
                  Lihat Garis Waktu <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CONTRIBUTION CTA ── */}
      <section className="bg-surface py-20 md:py-28 border-t border-outline-variant">
        <div className="container-page max-w-3xl mx-auto text-center">
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            custom={0}
          >
            <span className="eyebrow mb-4 block">Berkontribusi</span>
            <h2 className="font-serif text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4 text-balance">
              Punya Cerita tentang Lampung?
            </h2>
            <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto mb-8 leading-relaxed">
              JEJAK adalah proyek kolaboratif. Bagikan pengetahuan, kisah, atau dokumentasi Anda
              tentang sejarah dan budaya Lampung. Setiap kontribusi akan dikurasi oleh tim kami.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/bagikan-jejak" className="btn-primary">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Mulai Berkontribusi
              </Link>
              <Link to="/jelajah" className="btn-ghost">
                Jelajahi Dulu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
