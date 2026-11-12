import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getTimelineEvents } from '../api/timeline.js';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import PublicLayout from '../components/layout/PublicLayout.jsx';

const CATEGORY_STYLES = {
  sejarah: { bg: 'bg-amber-900', ring: 'ring-amber-400/30', label: 'Sejarah' },
  budaya:  { bg: 'bg-emerald-800', ring: 'ring-emerald-400/30', label: 'Budaya' },
  artefak: { bg: 'bg-amber-700', ring: 'ring-amber-300/30', label: 'Artefak' },
  tokoh:   { bg: 'bg-purple-800', ring: 'ring-purple-400/30', label: 'Tokoh' },
  tempat:  { bg: 'bg-sky-800', ring: 'ring-sky-400/30', label: 'Tempat' },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

function TimelineCard({ event, index, onOpenDetail }) {
  const isLeft = index % 2 === 0;
  const catStyle = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.sejarah;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeUp}
      className={`relative flex items-start gap-4 md:gap-8 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      } flex-row`}
    >
      {/* Timeline node */}
      <div className="hidden md:flex flex-col items-center absolute left-1/2 -translate-x-1/2 top-0 z-10">
        <div className={`w-5 h-5 rounded-full ${catStyle.bg} ring-4 ${catStyle.ring} shadow-lg`} />
        <div className="w-0.5 h-full bg-stone-300/60 absolute top-5" />
      </div>

      {/* Mobile node */}
      <div className="flex md:hidden flex-col items-center shrink-0 mt-1">
        <div className={`w-4 h-4 rounded-full ${catStyle.bg} ring-4 ${catStyle.ring} shadow`} />
        <div className="w-0.5 flex-1 bg-stone-300/60 mt-1" />
      </div>

      {/* Card */}
      <div
        className={`flex-1 md:w-[calc(50%-2.5rem)] ${
          isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
        }`}
      >
        <div
          onClick={() => onOpenDetail(event)}
          className="cursor-pointer group bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/80 shadow-sm hover:shadow-lg hover:border-amber-800/20 transition-all duration-300 overflow-hidden"
        >
          {event.image && (
            <div className="w-full h-40 md:h-48 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          )}
          <div className="p-5">
            {/* Year & Epoch */}
            <div className={`flex items-center gap-2 mb-2 flex-wrap ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
              <span className="font-serif text-2xl font-bold text-amber-900">
                {event.year}
              </span>
              {event.epoch && (
                <span className="text-xs text-stone-500 font-sans bg-stone-100 px-2 py-0.5 rounded-full">
                  {event.epoch}
                </span>
              )}
            </div>

            {/* Category badge */}
            <div className={`mb-2 ${isLeft ? 'md:flex md:justify-end' : ''}`}>
              <Badge variant={event.category}>
                {catStyle.label}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2 leading-snug group-hover:text-amber-900 transition-colors">
              {event.title}
            </h3>

            {/* Subtitle */}
            {event.subtitle && (
              <p className="text-sm text-stone-600 font-sans italic mb-2">
                {event.subtitle}
              </p>
            )}

            {/* Location */}
            {event.location && (
              <p className={`text-xs text-stone-500 font-sans flex items-center gap-1 mb-2 ${isLeft ? 'md:justify-end' : ''}`}>
                <span>📍</span> {event.location}
              </p>
            )}

            {/* Summary */}
            {event.summary && (
              <p className="text-sm text-stone-600 font-sans leading-relaxed line-clamp-3">
                {event.summary}
              </p>
            )}

            {/* Key Figure */}
            {event.keyFigure && (
              <p className={`mt-3 text-xs text-amber-900/80 font-sans flex items-center gap-1.5 ${isLeft ? 'md:justify-end' : ''}`}>
                <span>👤</span>
                <span className="font-medium">{event.keyFigure}</span>
              </p>
            )}

            {/* CTA hint */}
            <p className={`mt-3 text-xs text-amber-800 font-sans font-medium opacity-0 group-hover:opacity-100 transition-opacity ${isLeft ? 'md:text-right' : ''}`}>
              Klik untuk detail →
            </p>
          </div>
        </div>
      </div>

      {/* Spacer for the other side on desktop */}
      <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
    </motion.div>
  );
}

function TimelineDetailModal({ event, isOpen, onClose }) {
  if (!event) return null;
  const catStyle = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.sejarah;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event.title} maxWidth="max-w-3xl">
      <div className="space-y-5">
        {event.image && (
          <div className="w-full h-48 md:h-64 rounded-lg overflow-hidden">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-serif text-3xl font-bold text-amber-900">{event.year}</span>
          {event.epoch && (
            <span className="text-sm text-stone-500 font-sans bg-stone-100 px-3 py-1 rounded-full">
              {event.epoch}
            </span>
          )}
          <Badge variant={event.category}>{catStyle.label}</Badge>
        </div>

        {event.subtitle && (
          <p className="text-base text-stone-600 font-sans italic">{event.subtitle}</p>
        )}

        {event.location && (
          <p className="text-sm text-stone-500 font-sans flex items-center gap-1.5">
            <span>📍</span> {event.location}
          </p>
        )}

        {event.keyFigure && (
          <p className="text-sm text-amber-900/80 font-sans flex items-center gap-1.5">
            <span>👤</span> Tokoh Kunci: <span className="font-semibold">{event.keyFigure}</span>
          </p>
        )}

        {event.summary && (
          <div>
            <h4 className="font-serif font-bold text-sm text-stone-800 mb-1.5">Ringkasan</h4>
            <p className="text-sm text-stone-700 font-sans leading-relaxed">{event.summary}</p>
          </div>
        )}

        {event.details && (
          <div>
            <h4 className="font-serif font-bold text-sm text-stone-800 mb-1.5">Detail</h4>
            <p className="text-sm text-stone-700 font-sans leading-relaxed whitespace-pre-line">
              {event.details}
            </p>
          </div>
        )}

        {event.content && (
          <div className="prose prose-stone prose-sm max-w-none font-sans border-t border-stone-200 pt-4">
            <div dangerouslySetInnerHTML={{ __html: event.content }} />
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="shrink-0">
            <Skeleton className="w-4 h-4 rounded-full" />
          </div>
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TimelinePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        setLoading(true);
        setError(null);
        const res = await getTimelineEvents();
        const items = res?.data || [];
        // Sort by year ascending
        items.sort((a, b) => (a.year || 0) - (b.year || 0));
        setEvents(items);
      } catch (err) {
        setError(err.message || 'Gagal memuat garis waktu');
      } finally {
        setLoading(false);
      }
    }
    fetchTimeline();
  }, []);

  const handleOpenDetail = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  return (
    <PublicLayout>
      <section className="bg-[#F9F6F0] min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-b from-stone-900 to-stone-800 text-amber-50 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="eyebrow text-amber-400 mb-3 tracking-widest text-xs uppercase font-sans font-semibold">
                Garis Waktu
              </p>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                Perjalanan Waktu Lampung
              </h1>
              <p className="text-amber-100/70 max-w-2xl text-base md:text-lg font-sans leading-relaxed">
                Telusuri peristiwa penting yang membentuk sejarah dan budaya Lampung dari masa ke masa.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Stats Bar */}
        {!loading && !error && events.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-stone-200/60 p-4 flex items-center gap-6 text-sm font-sans"
            >
              <span className="text-stone-600">
                <strong className="text-amber-900">{events.length}</strong> peristiwa
              </span>
              {events.length > 0 && (
                <>
                  <span className="hidden sm:inline text-stone-400">|</span>
                  <span className="hidden sm:inline text-stone-600">
                    {events[0]?.year} — {events[events.length - 1]?.year}
                  </span>
                </>
              )}
            </motion.div>
          </div>
        )}

        {/* Timeline Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          {loading ? (
            <TimelineSkeleton />
          ) : error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-8 text-center">
              <p className="text-rose-800 font-sans text-sm mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Coba Lagi
              </Button>
            </div>
          ) : events.length === 0 ? (
            <EmptyState
              title="Belum Ada Peristiwa"
              message="Garis waktu belum memiliki peristiwa. Silakan kembali nanti."
            />
          ) : (
            <div className="relative">
              {/* Vertical line (desktop) */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-800/30 via-stone-300/60 to-stone-200/30 -translate-x-px" />

              <div className="space-y-8 md:space-y-12">
                {events.map((event, i) => (
                  <TimelineCard
                    key={event.id}
                    event={event}
                    index={i}
                    onOpenDetail={handleOpenDetail}
                  />
                ))}
              </div>

              {/* End marker */}
              <div className="hidden md:flex justify-center mt-8">
                <div className="w-3 h-3 rounded-full bg-stone-400 ring-4 ring-stone-200" />
              </div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <TimelineDetailModal
          event={selectedEvent}
          isOpen={Boolean(selectedEvent)}
          onClose={handleCloseDetail}
        />
      </section>
    </PublicLayout>
  );
}
