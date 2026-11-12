import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { getMapSites } from '../api/map.js';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import PublicLayout from '../components/layout/PublicLayout.jsx';

import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TYPE_CONFIG = {
  sejarah: { color: '#78350f', label: 'Sejarah', emoji: '📜' },
  budaya:  { color: '#065f46', label: 'Budaya', emoji: '🎭' },
  artefak: { color: '#92400e', label: 'Artefak', emoji: '🏺' },
  tokoh:   { color: '#581c87', label: 'Tokoh', emoji: '👤' },
  tempat:  { color: '#075985', label: 'Tempat', emoji: '🏛️' },
};

function createColoredIcon(color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="#fff" opacity="0.9"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -40],
    className: '',
  });
}

function parseCoordinates(coordStr) {
  if (!coordStr) return null;
  const parts = coordStr.split(',').map((s) => parseFloat(s.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts;
  }
  return null;
}

const LAMPUNG_CENTER = [-5.4, 105.3];
const LAMPUNG_ZOOM = 8;

const CONTENT_TYPES = [
  { value: '', label: 'Semua' },
  { value: 'sejarah', label: 'Sejarah' },
  { value: 'budaya', label: 'Budaya' },
  { value: 'artefak', label: 'Artefak' },
  { value: 'tokoh', label: 'Tokoh' },
  { value: 'tempat', label: 'Tempat' },
];

export default function MapPage() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState('');

  useEffect(() => {
    async function fetchSites() {
      try {
        setLoading(true);
        setError(null);
        const res = await getMapSites();
        setSites(res?.data || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat data peta');
      } finally {
        setLoading(false);
      }
    }
    fetchSites();
  }, []);

  const markers = useMemo(() => {
    return sites
      .map((site) => {
        const coords = parseCoordinates(site.coordinates);
        if (!coords) return null;
        return { ...site, parsedCoords: coords };
      })
      .filter(Boolean)
      .filter((site) => !activeType || site.type === activeType);
  }, [sites, activeType]);

  const activeCount = markers.length;

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
                Peta Interaktif
              </p>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                Jejak di Peta Lampung
              </h1>
              <p className="text-amber-100/70 max-w-2xl text-base md:text-lg font-sans leading-relaxed">
                Jelajahi jejak sejarah, budaya, artefak, tokoh, dan tempat bersejarah yang tersebar di Bumi Ruwa Jurai.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-stone-200/60 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          >
            <span className="text-xs font-sans font-medium text-stone-500 uppercase tracking-wider shrink-0">
              Filter:
            </span>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.map((t) => {
                const isActive = activeType === t.value;
                const typeConf = TYPE_CONFIG[t.value];
                return (
                  <button
                    key={t.value}
                    onClick={() => setActiveType(t.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-200 border ${
                      isActive
                        ? 'bg-amber-900 text-amber-50 border-amber-900 shadow-sm'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-amber-800/40 hover:text-amber-900'
                    }`}
                  >
                    {typeConf?.emoji && <span className="mr-1">{typeConf.emoji}</span>}
                    {t.label}
                  </button>
                );
              })}
            </div>
            <span className="ml-auto text-xs text-stone-500 font-sans">
              {activeCount} lokasi
            </span>
          </motion.div>
        </div>

        {/* Map Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {loading ? (
            <div className="rounded-xl overflow-hidden border border-stone-200">
              <Skeleton className="w-full h-[60vh] md:h-[70vh] rounded-none" />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-8 text-center">
              <p className="text-rose-800 font-sans text-sm mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Coba Lagi
              </Button>
            </div>
          ) : markers.length === 0 ? (
            <EmptyState
              title="Tidak Ada Lokasi"
              message={
                activeType
                  ? `Belum ada konten bertipe "${CONTENT_TYPES.find((t) => t.value === activeType)?.label}" dengan lokasi di peta.`
                  : 'Belum ada konten dengan data lokasi di peta.'
              }
              actionLabel={activeType ? 'Tampilkan Semua' : undefined}
              onAction={activeType ? () => setActiveType('') : undefined}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-xl overflow-hidden border border-stone-200 shadow-lg"
            >
              <MapContainer
                center={LAMPUNG_CENTER}
                zoom={LAMPUNG_ZOOM}
                scrollWheelZoom={true}
                className="w-full h-[60vh] md:h-[70vh]"
                style={{ background: '#e8e4dc' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((site) => {
                  const typeConf = TYPE_CONFIG[site.type] || { color: '#44403c', label: site.type, emoji: '📍' };
                  const icon = createColoredIcon(typeConf.color);
                  return (
                    <Marker key={site.id} position={site.parsedCoords} icon={icon}>
                      <Popup maxWidth={320} minWidth={240} className="museum-popup">
                        <div className="font-sans">
                          {site.image && (
                            <div className="w-full h-32 -mt-1 -mx-0 mb-3 rounded overflow-hidden">
                              <img
                                src={site.image}
                                alt={site.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={site.type}>
                              {typeConf.emoji} {typeConf.label}
                            </Badge>
                            {site.period && (
                              <span className="text-[10px] text-stone-500 font-sans">
                                {site.period}
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif font-bold text-sm text-stone-900 mb-1 leading-snug">
                            {site.title}
                          </h3>
                          {site.location && (
                            <p className="text-[11px] text-stone-500 mb-2 flex items-center gap-1">
                              <span>📍</span> {site.location}
                            </p>
                          )}
                          {site.description && (
                            <p className="text-xs text-stone-600 leading-relaxed mb-3 line-clamp-3">
                              {site.description}
                            </p>
                          )}
                          <Link
                            to={`/konten/${site.slug}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-900 hover:bg-amber-950 text-amber-50 rounded-lg text-xs font-medium transition-colors"
                          >
                            Lihat Jejak →
                          </Link>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </motion.div>
          )}
        </div>

        {/* Legend */}
        {!loading && !error && markers.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
            <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-stone-500">
              <span className="font-medium text-stone-700">Legenda:</span>
              {Object.entries(TYPE_CONFIG).map(([key, conf]) => (
                <span key={key} className="inline-flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: conf.color }}
                  />
                  {conf.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
