import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { getContents } from '../api/contents.js';
import { getCategories } from '../api/categories.js';
import { Pagination } from '../components/ui/Pagination.jsx';
import { StoryCardSkeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';

/* ─── Story Card Component ─── */
const StoryCard = ({ content, index }) => {
  const reduced = useReducedMotion();
  
  return (
    <motion.article
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="card-museum group flex flex-col h-full"
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
          <div className="absolute bottom-3 left-3 z-10 flex gap-2">
            <span className="badge-gold">{content.type || content.category?.name || '—'}</span>
            {content.isVerified && (
              <span className="badge-verified bg-white text-primary border-transparent px-2 py-0.5 shadow-sm text-xs rounded">
                <span className="material-symbols-outlined text-[14px]">verified</span>
              </span>
            )}
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
};

/* ═══════════════════════════════════════════════════════════
   EXPLORE PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States
  const [contents, setContents] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters from URL or defaults
  const typeFilter = searchParams.get('type') || '';
  const categoryFilter = searchParams.get('category') || '';
  const sortFilter = searchParams.get('sort') || 'newest';
  const pageFilter = parseInt(searchParams.get('page') || '1', 10);

  /* Helper to update URL params */
  const updateFilter = useCallback((key, value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      // Reset page to 1 when changing filters, except when changing page itself
      if (key !== 'page') {
        newParams.set('page', '1');
      }
      return newParams;
    });
  }, [setSearchParams]);

  /* Fetch Categories once */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getCategories();
        if (!cancelled) setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* Fetch Contents on filter change */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page: pageFilter,
          limit: 12,
          sort: sortFilter,
        };
        
        if (typeFilter) params.type = typeFilter;
        if (categoryFilter) params.category = categoryFilter;

        const res = await getContents(params);
        
        if (!cancelled) {
          setContents(res.data || []);
          setMeta(res.meta || { total: 0, page: 1, limit: 12, totalPages: 1 });
        }
      } catch (err) {
        if (!cancelled) {
          setError('Gagal memuat koleksi. Silakan coba lagi.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [typeFilter, categoryFilter, sortFilter, pageFilter]);

  return (
    <div className="min-h-screen bg-surface">
      {/* ── HEADER ── */}
      <header className="bg-surface-container-low border-b border-outline-variant py-12 md:py-16">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="font-serif text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
              Jelajahi Koleksi
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              Telusuri ribuan jejak sejarah, budaya, dan kearifan lokal Lampung 
              yang telah dikurasi oleh komunitas dan ahli.
            </p>
          </motion.div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="container-page py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ── SIDEBAR FILTERS ── */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-5 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-sans font-bold text-label-lg text-on-surface uppercase tracking-wider">
                  Filter
                </h2>
                {(typeFilter || categoryFilter || sortFilter !== 'newest') && (
                  <button 
                    onClick={() => setSearchParams(new URLSearchParams())}
                    className="text-primary hover:text-emas-600 text-label-sm uppercase tracking-wider underline-offset-4 hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <label className="form-label">Jenis Konten</label>
                <div className="flex flex-col gap-2 mt-3">
                  {[
                    { val: '', label: 'Semua Jenis' },
                    { val: 'sejarah', label: 'Sejarah' },
                    { val: 'budaya', label: 'Budaya' },
                    { val: 'artefak', label: 'Artefak' },
                    { val: 'tokoh', label: 'Tokoh' },
                    { val: 'tempat', label: 'Tempat' },
                    { val: 'artikel', label: 'Artikel & Riset' },
                  ].map((t) => (
                    <label key={t.val} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="type"
                        value={t.val}
                        checked={typeFilter === t.val}
                        onChange={(e) => updateFilter('type', e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary border-outline-variant"
                      />
                      <span className={`text-body-sm transition-colors ${typeFilter === t.val ? 'text-on-surface font-medium' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                        {t.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="mb-6">
                  <label className="form-label" htmlFor="category">Kategori</label>
                  <select
                    id="category"
                    value={categoryFilter}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="form-select mt-1"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sort Filter */}
              <div>
                <label className="form-label" htmlFor="sort">Urutkan</label>
                <select
                  id="sort"
                  value={sortFilter}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="form-select mt-1"
                >
                  <option value="newest">Terbaru Ditambahkan</option>
                  <option value="oldest">Paling Lama</option>
                  <option value="popular">Paling Populer</option>
                </select>
              </div>
            </div>
          </aside>

          {/* ── GRID & RESULTS ── */}
          <div className="flex-1">
            {/* Meta bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant">
              <span className="text-body-sm text-on-surface-variant">
                {loading ? 'Memuat...' : (
                  <>Menampilkan <strong className="text-on-surface">{meta.total}</strong> koleksi</>
                )}
              </span>
            </div>

            {/* Error State */}
            {error ? (
              <div className="bg-error-container text-on-error-container p-6 rounded-lg border border-error/20 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-4xl mb-2">error</span>
                <p className="font-medium mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary py-2 px-4 text-sm">
                  Coba Lagi
                </button>
              </div>
            ) : loading ? (
              /* Loading State */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <StoryCardSkeleton key={i} />
                ))}
              </div>
            ) : contents.length === 0 ? (
              /* Empty State */
              <EmptyState 
                title="Tidak Ada Koleksi" 
                message="Kami tidak menemukan konten yang sesuai dengan filter Anda. Coba ubah filter atau kata kunci."
                actionLabel="Reset Filter"
                onAction={() => setSearchParams(new URLSearchParams())}
              />
            ) : (
              /* Success State */
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {contents.map((content, index) => (
                    <StoryCard key={content.id} content={content} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {meta.totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={meta.page}
                      totalPages={meta.totalPages}
                      onPageChange={(page) => updateFilter('page', page.toString())}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
