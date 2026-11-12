import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getContentBySlug } from '../api/contents.js';
import { checkFavorite, addFavorite, removeFavorite } from '../api/favorites.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';

/* ─── Loading Skeleton ─── */
const DetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-96 bg-surface-container w-full rounded-b-3xl" />
    <div className="container-page max-w-4xl -mt-20 relative z-10 px-4 md:px-0">
      <div className="bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-lg border border-outline-variant">
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        
        <div className="flex gap-4 border-b border-outline-variant pb-6 mb-8">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   CONTENT DETAIL PAGE
   ═══════════════════════════════════════════════════════════ */
export default function ContentDetail() {
  const { slugOrId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [content, setContent] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  /* Fetch Content */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        window.scrollTo(0, 0); // Scroll to top on new content
        
        const res = await getContentBySlug(slugOrId);
        if (!cancelled) {
          setContent(res.data);
          // Assuming the API returns related in res.data.related or similar
          // If not, it will just be undefined/empty
          setRelated(res.data.related || []);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.status === 404) {
            setError('Konten tidak ditemukan. Mungkin telah dihapus atau URL tidak valid.');
          } else {
            setError('Gagal memuat konten. Silakan coba lagi nanti.');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slugOrId]);

  /* Fetch Favorite Status */
  useEffect(() => {
    let cancelled = false;
    if (content?.id && isAuthenticated) {
      (async () => {
        try {
          const res = await checkFavorite(content.id);
          if (!cancelled) setIsFavorite(res.data?.isFavorite || false);
        } catch {
          // silent fallback
        }
      })();
    }
    return () => { cancelled = true; };
  }, [content?.id, isAuthenticated]);

  /* Handle Favorite Toggle */
  const handleFavorite = async () => {
    if (!isAuthenticated) {
      addToast('Silakan masuk (login) untuk menyimpan ke favorit', 'warning');
      navigate('/login');
      return;
    }
    
    if (!content?.id || favLoading) return;
    
    try {
      setFavLoading(true);
      if (isFavorite) {
        await removeFavorite(content.id);
        setIsFavorite(false);
        addToast('Dihapus dari favorit');
      } else {
        await addFavorite(content.id);
        setIsFavorite(true);
        addToast('Disimpan ke favorit', 'success');
      }
    } catch (err) {
      addToast('Gagal mengubah status favorit', 'error');
    } finally {
      setFavLoading(false);
    }
  };

  /* Render Error */
  if (error) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-error mb-4 block">
          search_off
        </span>
        <h2 className="font-serif text-headline-md text-on-surface mb-2">Oops!</h2>
        <p className="text-body-lg text-on-surface-variant max-w-md mb-8">{error}</p>
        <Link to="/jelajah" className="btn-primary">
          Kembali Jelajah
        </Link>
      </div>
    );
  }

  /* Render Loading */
  if (loading) {
    return <DetailSkeleton />;
  }

  if (!content) return null;

  return (
    <main className="min-h-screen bg-surface pb-24">
      {/* ── HERO IMAGE ── */}
      <div className="relative w-full h-[50vh] md:h-[65vh] bg-surface-container">
        {content.image ? (
          <img
            src={content.image}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-krem-200 to-krem-300 flex items-center justify-center">
            <span className="text-8xl opacity-30">📜</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
      </div>

      {/* ── ARTICLE CONTAINER ── */}
      <div className="container-page max-w-4xl -mt-32 relative z-10">
        <motion.article 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-surface-container-lowest p-6 md:p-12 lg:p-16 rounded-xl shadow-xl border border-outline-variant"
        >
          {/* Breadcrumb / Top Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Link to="/jelajah" className="text-primary hover:text-emas-600 transition-colors flex items-center gap-1 text-label-md uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Kembali
              </Link>
              <span className="text-outline-variant">|</span>
              <span className="badge-gold">
                {content.type || content.category?.name || 'Koleksi'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {(content.isVerified || content.verifiedBy) && (
                <span className="badge-verified bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <span className="material-symbols-outlined text-[16px] text-amber-700">verified</span>
                  {content.verifiedBy || 'Terverifikasi Admin'}
                </span>
              )}
            </div>
          </div>

          {/* Title & Subtitle */}
          <h1 className="font-serif font-bold text-headline-lg-mobile md:text-display-md text-on-surface mb-4 leading-tight text-balance">
            {content.title}
          </h1>
          {content.subtitle && (
            <p className="text-headline-sm text-on-surface-variant font-serif italic mb-8">
              {content.subtitle}
            </p>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-outline-variant mb-10 bg-surface-container-low/50 rounded-lg px-4 md:px-0 md:bg-transparent md:border-x-0 md:border-y md:rounded-none">
            {content.period && (
              <div className="flex flex-col gap-1">
                <span className="eyebrow">Periode/Era</span>
                <span className="font-serif text-body-lg text-on-surface font-medium">{content.period}</span>
              </div>
            )}
            {content.region && (
              <div className="flex flex-col gap-1">
                <span className="eyebrow">Wilayah/Lokasi</span>
                <span className="font-serif text-body-lg text-on-surface font-medium flex items-start gap-1">
                  <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">location_on</span>
                  {content.region}
                </span>
              </div>
            )}
            {content.author && (
              <div className="flex flex-col gap-1">
                <span className="eyebrow">Kurator / Penulis</span>
                <span className="font-serif text-body-lg text-on-surface font-medium">
                  {content.author.name}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-1 md:items-end justify-center">
              <button
                onClick={handleFavorite}
                disabled={favLoading}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                  isFavorite 
                    ? 'bg-primary text-on-primary border-primary hover:bg-primary-container' 
                    : 'bg-transparent text-primary border-primary hover:bg-primary/10'
                }`}
              >
                <span className={`material-symbols-outlined ${isFavorite ? 'fill-current' : ''}`}>
                  bookmark
                </span>
                <span className="font-sans text-label-md uppercase tracking-wider">
                  {isFavorite ? 'Tersimpan' : 'Simpan'}
                </span>
              </button>
            </div>
          </div>

          {/* Rich Content Body */}
          <div className="prose prose-lg prose-stone max-w-none font-sans text-on-surface leading-relaxed marker:text-primary">
            <div className="whitespace-pre-line text-stone-800 leading-relaxed text-base md:text-lg">
              {content.content || content.description || 'Tidak ada deskripsi tersedia.'}
            </div>
          </div>

          {/* Image Gallery if additional images exist */}
          {Array.isArray(content.images) && content.images.length > 1 && (
            <div className="mt-12 pt-8 border-t border-outline-variant">
              <h3 className="eyebrow mb-4">Galeri Dokumentasi</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.images.map((imgUrl, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-stone-200 aspect-[4/3] bg-stone-100">
                    <img src={imgUrl} alt={`${content.title} - ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References / Sources */}
          {(() => {
            let refList = [];
            if (Array.isArray(content.references)) {
              refList = content.references;
            } else if (typeof content.references === 'string' && content.references.trim()) {
              try {
                const parsed = JSON.parse(content.references);
                refList = Array.isArray(parsed) ? parsed : [parsed];
              } catch {
                refList = [content.references];
              }
            }

            if (!refList || refList.length === 0) return null;

            return (
              <div className="mt-16 pt-8 border-t border-outline-variant">
                <h3 className="eyebrow mb-4 flex items-center gap-2 text-stone-800 font-bold">
                  <span className="material-symbols-outlined text-[18px] text-amber-900">library_books</span>
                  Sumber &amp; Referensi Dokumen
                </h3>
                <ul className="space-y-3 pl-5 list-disc text-body-sm text-on-surface-variant font-sans">
                  {refList.map((ref, i) => (
                    <li key={i} className="pl-2">
                      {typeof ref === 'string' ? (
                        <span>{ref}</span>
                      ) : ref.url ? (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-900 font-semibold hover:underline hover:text-amber-950 transition-colors"
                        >
                          {ref.title || ref.url} {ref.author ? `— ${ref.author}` : ''} {ref.year ? `(${ref.year})` : ''}
                        </a>
                      ) : (
                        <span>
                          <strong className="text-stone-900">{ref.title || 'Sumber Arsip'}</strong>
                          {ref.author ? ` — ${ref.author}` : ''}
                          {ref.year ? ` (${ref.year})` : ''}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </motion.article>
      </div>

      {/* ── RELATED CONTENT ── */}
      {related.length > 0 && (
        <div className="container-page mt-24">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-outline-variant">
            <div>
              <span className="eyebrow mb-2 block">Jelajahi Lebih Lanjut</span>
              <h2 className="font-serif text-headline-md text-on-surface">Jejak Terkait</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item, i) => (
              <Link 
                key={item.id} 
                to={`/konten/${item.slug || item.id}`}
                className="group flex gap-4 p-4 rounded-lg hover:bg-surface-container transition-colors"
              >
                <div className="w-24 h-24 flex-shrink-0 rounded bg-surface-container-high overflow-hidden relative">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-2xl opacity-40">📜</span>
                  )}
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <span className="text-archival-stamp text-primary mb-1">{item.type || 'Koleksi'}</span>
                  <h4 className="font-serif font-bold text-body-lg text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  {item.period && (
                    <span className="text-label-sm text-on-surface-variant mt-2">{item.period}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
