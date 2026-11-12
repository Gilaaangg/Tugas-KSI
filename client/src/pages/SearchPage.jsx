import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { searchContents } from '../api/search.js';
import { Badge } from '../components/ui/Badge.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import PublicLayout from '../components/layout/PublicLayout.jsx';

const TYPE_TABS = [
  { value: '', label: 'Semua', icon: '🔍' },
  { value: 'sejarah', label: 'Sejarah', icon: '📜' },
  { value: 'budaya', label: 'Budaya', icon: '🎭' },
  { value: 'artefak', label: 'Artefak', icon: '🏺' },
  { value: 'tokoh', label: 'Tokoh', icon: '👤' },
  { value: 'tempat', label: 'Tempat', icon: '🏛️' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

function ResultCard({ item, index }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <Link
        to={`/konten/${item.slug || item.id}`}
        className="group flex gap-4 bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/80 shadow-sm hover:shadow-lg hover:border-amber-800/20 transition-all duration-300 overflow-hidden p-4"
      >
        {/* Thumbnail */}
        {item.image ? (
          <div className="w-20 h-20 md:w-28 md:h-24 rounded-lg overflow-hidden shrink-0 bg-stone-100">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-20 h-20 md:w-28 md:h-24 rounded-lg bg-stone-100 shrink-0 flex items-center justify-center text-stone-400 text-2xl font-serif">
            📜
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge variant={item.type}>{item.type}</Badge>
            {item.period && (
              <span className="text-[11px] text-stone-500 font-sans">{item.period}</span>
            )}
          </div>
          <h3 className="font-serif font-bold text-base text-stone-900 truncate group-hover:text-amber-900 transition-colors">
            {item.title}
          </h3>
          {item.location && (
            <p className="text-xs text-stone-500 font-sans mt-0.5 flex items-center gap-1">
              <span>📍</span> {item.location}
            </p>
          )}
          {item.description && (
            <p className="text-xs text-stone-600 font-sans mt-1.5 leading-relaxed line-clamp-2 hidden sm:block">
              {item.description}
            </p>
          )}
        </div>

        {/* Arrow */}
        <div className="hidden sm:flex items-center shrink-0 text-stone-400 group-hover:text-amber-800 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-white/60 rounded-xl border border-stone-200/60">
          <Skeleton className="w-20 h-20 md:w-28 md:h-24 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-full hidden sm:block" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeType, setActiveType] = useState(searchParams.get('type') || '');
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const doSearch = useCallback(async (q, type) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      setTotal(0);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      const res = await searchContents(q.trim(), type || null);
      setResults(res?.data || []);
      setTotal(res?.total || res?.data?.length || 0);
    } catch (err) {
      setError(err.message || 'Pencarian gagal');
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync URL params and trigger search
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    const urlType = searchParams.get('type') || '';
    if (urlQ !== query) setQuery(urlQ);
    if (urlType !== activeType) setActiveType(urlType);
    if (urlQ) {
      doSearch(urlQ, urlType);
    }
    // Only run on URL changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Debounced input handler
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const newParams = {};
      if (value.trim()) newParams.q = value.trim();
      if (activeType) newParams.type = activeType;
      setSearchParams(newParams, { replace: true });
    }, 300);
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    const newParams = {};
    if (query.trim()) newParams.q = query.trim();
    if (type) newParams.type = type;
    setSearchParams(newParams, { replace: true });
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setTotal(0);
    setHasSearched(false);
    setActiveType('');
    setSearchParams({}, { replace: true });
    inputRef.current?.focus();
  };

  // Focus on mount
  useEffect(() => {
    if (!searchParams.get('q')) {
      inputRef.current?.focus();
    }
  }, []);

  return (
    <PublicLayout>
      <section className="bg-[#F9F6F0] min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-b from-stone-900 to-stone-800 text-amber-50 py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="eyebrow text-amber-400 mb-3 tracking-widest text-xs uppercase font-sans font-semibold">
                Pencarian
              </p>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Cari Jejak
              </h1>

              {/* Search Input */}
              <div className="relative max-w-2xl">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Ketik kata kunci... (misal: Radin Intan, Tapis, Krakatau)"
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/10 border border-amber-100/20 text-amber-50 placeholder-amber-200/40 text-base font-sans focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent backdrop-blur transition"
                />
                {query && (
                  <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-4 flex items-center text-amber-200/60 hover:text-amber-100 transition"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Type Filter Tabs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-stone-200/60 p-3 flex items-center gap-2 overflow-x-auto scrollbar-hide"
          >
            {TYPE_TABS.map((tab) => {
              const isActive = activeType === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => handleTypeChange(tab.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-sans font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-900 text-amber-50 shadow-sm'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          {/* Results count */}
          {hasSearched && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <p className="text-sm font-sans text-stone-600">
                {total > 0 ? (
                  <>
                    Ditemukan <strong className="text-amber-900">{total}</strong> hasil untuk{' '}
                    <em className="text-stone-800">"{query}"</em>
                    {activeType && (
                      <> dalam kategori <Badge variant={activeType}>{activeType}</Badge></>
                    )}
                  </>
                ) : (
                  <>
                    Tidak ada hasil untuk <em className="text-stone-800">"{query}"</em>
                  </>
                )}
              </p>
            </motion.div>
          )}

          {/* Loading */}
          {loading && <SearchSkeleton />}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-8 text-center">
              <p className="text-rose-800 font-sans text-sm">{error}</p>
            </div>
          )}

          {/* Results list */}
          {!loading && !error && results.length > 0 && (
            <div className="space-y-4">
              {results.map((item, i) => (
                <ResultCard key={item.id || i} item={item} index={i} />
              ))}
            </div>
          )}

          {/* Empty state: searched but no results */}
          {!loading && !error && hasSearched && results.length === 0 && (
            <EmptyState
              title="Jejak Tidak Ditemukan"
              message={`Tidak ada hasil yang cocok dengan pencarian "${query}". Coba gunakan kata kunci yang berbeda atau ubah filter kategori.`}
              actionLabel="Hapus Pencarian"
              onAction={handleClear}
            />
          )}

          {/* Initial state: no search yet */}
          {!hasSearched && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-900/10 flex items-center justify-center text-4xl mb-5">
                🔍
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
                Mulai Pencarian
              </h3>
              <p className="text-sm text-stone-500 font-sans max-w-sm mx-auto leading-relaxed">
                Ketik minimal 2 karakter untuk mencari jejak sejarah, budaya, artefak, tokoh, dan tempat bersejarah Lampung.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['Radin Intan', 'Tapis', 'Krakatau', 'Siger', 'Way Kambas'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      setSearchParams({ q: term }, { replace: true });
                    }}
                    className="px-3 py-1.5 rounded-full border border-amber-800/20 text-xs font-sans text-amber-900 hover:bg-amber-900 hover:text-amber-50 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
