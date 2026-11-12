import { useState } from 'react';
import { Link } from 'react-router-dom';

const MAP_BG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_5-2BQoXwqpRyF3SZ5qa0TRYtSbUgtZeVDSfdu-HQKv0WD-mHBfOpDn44S3ZMTVEalNV-STsAqg841k0oystFUb2RHxbftt023nYM6sfQ4g1-Q5sVlENb_9oTDs_gsk7YgO7IIXORkJwGWyXpKmZ9jSJZ0VN0k9uOCW-tWRXrB2d5VBNSzsFspPlgBa1w92L55uLFASFnuM5lvHPURkeWFoeLF2iFzs_OLvZY1nX40FWzGD7pRCjJuQ';

const ERAS = [
  { year: 1400, title: 'Era Sriwijaya & Skala Brak Kuno (1400 M)', desc: 'Munculnya prasasti bertuliskan Jawa Kuno & pembentukan federasi awal di kaki Gunung Pesagi.' },
  { year: 1550, title: 'Masa Keemasan Niaga Lada (1550 M)', desc: 'Hubungan diplomasi kesultanan Banten dan jalur perdagangan rempah di Selat Sunda.' },
  { year: 1700, title: 'Era Persekutuan Marga Pepadun (1700 M)', desc: 'Konsolidasi adat Abung Siwo Mego dan pembakuan upacara Begawi Cakak Pepadun.' },
  { year: 1856, title: 'Perjuangan Radin Inten II (1856 M)', desc: 'Perlawanan sengit benteng Rajabasa melawan ekspedisi militer kolonial Belanda.' },
  { year: 1950, title: 'Fajar Kemerdekaan & Ruwa Jurai (1950 M)', desc: 'Penyatuan administratif Karesidenan Lampung menuju provinsi berdaulat Republik Indonesia.' },
];

const REGIONS = [
  { name: 'Pesisir Barat',        sub: 'Pusat Adat Saibatin & Jalur Bahari Krui', info: '189 Arsip • Tradisi Repong Damar' },
  { name: 'Lampung Selatan',      sub: 'Peninggalan Radin Inten & Gerbang Krakatau', info: '240 Arsip • Cagar Cikoneng' },
  { name: 'Way Kanan & Tulang Bawang', sub: 'Kedatuan Kuno Tulang Bawang & Marga Pepadun', info: '165 Arsip • Sungai Tulang Bawang' },
];

const ADAT_REGIONS = [
  { name: 'Paksi Pak Sekala Brak', loc: 'Gunung Pesagi, Lampung Barat' },
  { name: 'Marga Abung Siwo Mego', loc: 'Kotabumi, Lampung Utara' },
  { name: 'Marga Buay Lima',       loc: 'Way Kanan & Sekampung' },
];

export default function MapTimelineTeaser() {
  const [activeEra, setActiveEra] = useState(ERAS[0]);
  const [sliderVal, setSliderVal] = useState(1400);

  const handleSlider = (e) => {
    const val = parseInt(e.target.value, 10);
    setSliderVal(val);
    const closest = ERAS.reduce((prev, curr) =>
      Math.abs(curr.year - val) < Math.abs(prev.year - val) ? curr : prev
    );
    setActiveEra(closest);
  };

  return (
    <section className="w-full bg-[#FBF8F4] py-28 relative border-t border-[#E3DDD3]">
      <div className="container-page">
        <div className="max-w-3xl mb-14">
          <span className="font-sans text-[#9E7324] uppercase tracking-widest block mb-2 font-bold"
                style={{ fontSize: '0.625rem', letterSpacing: '0.2em' }}>
            Kartografi & Garis Waktu
          </span>
          <h2 className="font-serif text-[#1A1A18] mb-4"
              style={{ fontSize: '2.5rem', lineHeight: '3rem' }}>
            Peta Sejarah & Ruang Waktu
          </h2>
          <p className="font-sans text-[#5C5852]"
             style={{ fontSize: '1rem', lineHeight: '1.625rem' }}>
            Pilih kurun waktu atau klik simpul wilayah untuk mengungkap arsip tersembunyi yang membentuk bentang budaya Sang Bumi Ruwa Jurai.
          </p>
        </div>

        {/* Map + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Map */}
          <div className="lg:col-span-8 rounded-lg overflow-hidden bg-white border border-[#E3DDD3]
                          relative min-h-[460px] flex flex-col justify-between shadow-md">
            <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-80"
                 style={{ backgroundImage: `url('${MAP_BG}')`, filter: 'saturate(1) brightness(0.95)' }}
                 aria-hidden="true" />
            <div className="absolute inset-0 bg-[#FBF8F4]/30 backdrop-blur-[1px]" aria-hidden="true" />
            {/* Top controls */}
            <div className="relative z-10 p-6 flex justify-between items-start">
              <div className="bg-white/95 border border-[#E3DDD3] shadow-sm px-3 py-1.5 rounded flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9E7324] animate-ping" />
                <span className="font-sans uppercase text-[#1A1A18] tracking-wider font-semibold"
                      style={{ fontSize: '0.625rem', letterSpacing: '0.2em' }}>
                  Lapisan Spasial Aktif: Rute Adat & Kedatuan
                </span>
              </div>
            </div>
            {/* Map pins */}
            <div className="relative z-10 p-6 flex flex-wrap gap-3">
              {REGIONS.map(({ name, sub, info }) => (
                <div key={name}
                     className="bg-white/95 backdrop-blur-md border border-[#E3DDD3] p-3 rounded-lg
                                shadow-md max-w-xs transition-all hover:scale-105 cursor-pointer">
                  <div className="flex items-center gap-2 text-[#9E7324] mb-1 font-bold">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span className="font-sans uppercase font-semibold"
                          style={{ fontSize: '0.6875rem', letterSpacing: '0.16em' }}>
                      {name}
                    </span>
                  </div>
                  <p className="font-sans text-[#1A1A18] font-medium leading-snug"
                     style={{ fontSize: '0.875rem' }}>{sub}</p>
                  <span className="font-sans text-[#5C5852]"
                        style={{ fontSize: '0.625rem', letterSpacing: '0.2em', fontWeight: 700 }}>
                    {info}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="bg-white border border-[#E3DDD3] p-6 rounded-lg shadow-sm flex-1">
              <h3 className="font-serif text-[#1A1A18] mb-2 font-bold"
                  style={{ fontSize: '1.375rem', lineHeight: '1.875rem' }}>
                Wilayah Adat & Persebaran
              </h3>
              <p className="font-sans text-sm text-[#5C5852] mb-6">
                Masyarakat Lampung terbagi dalam dua jurai adat besar yang saling melengkapi: Saibatin yang berpangkal pada aristokrasi pesisir dan Pepadun yang mengedepankan musyawarah demokratis di pedalaman.
              </p>
              <div className="space-y-3">
                {ADAT_REGIONS.map(({ name, loc }) => (
                  <div key={name}
                       className="p-3 rounded bg-[#F5EFE8] border border-[#E3DDD3]
                                  flex items-center justify-between cursor-pointer
                                  hover:bg-[#EDE5DA] transition-colors">
                    <div>
                      <p className="font-sans text-[#1A1A18] font-bold"
                         style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        {name}
                      </p>
                      <p className="font-sans text-[#5C5852]"
                         style={{ fontSize: '0.625rem', letterSpacing: '0.2em', fontWeight: 700 }}>
                        {loc}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#9E7324] text-base">chevron_right</span>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/peta"
                  className="p-4 rounded-lg bg-white border border-[#9E7324] text-[#9E7324]
                             hover:bg-[#9E7324] hover:text-white flex items-center justify-between group
                             shadow-sm transition-all font-sans uppercase tracking-wider font-semibold"
                  style={{ fontSize: '0.75rem', letterSpacing: '0.12em' }}>
              <span>Buka Peta Interaktif Lengkap</span>
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">map</span>
            </Link>
          </div>
        </div>

        {/* Timeline slider */}
        <div className="bg-white border border-[#E3DDD3] p-8 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="font-sans text-[#9E7324] uppercase tracking-widest block mb-1 font-bold"
                    style={{ fontSize: '0.625rem', letterSpacing: '0.2em' }}>
                Navigasi Kronologis
              </span>
              <h3 className="font-serif text-[#1A1A18]"
                  style={{ fontSize: '1.375rem', lineHeight: '1.875rem' }}>
                Garis Waktu Peradaban:{' '}
                <span className="text-[#9E7324] font-normal italic">{activeEra.title}</span>
              </h3>
            </div>
            <span className="font-sans text-[#5C5852] uppercase tracking-wider bg-[#F5EFE8]
                             border border-[#E3DDD3] px-3 py-1.5 rounded whitespace-nowrap"
                  style={{ fontSize: '0.625rem', letterSpacing: '0.2em', fontWeight: 700 }}>
              Rentang Arsip Terdata: 1400 M – 1950 M
            </span>
          </div>
          {/* Slider */}
          <div className="relative w-full py-4">
            <input
              type="range" min={1400} max={1950} step={50} value={sliderVal}
              onChange={handleSlider}
              aria-label="Pilih garis waktu sejarah"
              className="w-full h-2 bg-[#EDE5DA] rounded-lg appearance-none cursor-pointer accent-[#9E7324] focus:outline-none"
            />
            <div className="flex justify-between items-center mt-3 font-sans uppercase tracking-wider font-semibold"
                 style={{ fontSize: '0.625rem', letterSpacing: '0.2em', color: '#5C5852' }}>
              {ERAS.map((era) => (
                <button
                  key={era.year}
                  onClick={() => { setSliderVal(era.year); setActiveEra(era); }}
                  className={`hover:text-[#9E7324] transition-colors ${activeEra.year === era.year ? 'text-[#9E7324] font-bold' : ''}`}
                >
                  {era.year} M
                </button>
              ))}
            </div>
          </div>
          {/* Description box */}
          <div className="mt-4 p-4 rounded bg-[#F5EFE8] border border-[#E3DDD3] text-[#5C5852]
                          font-sans text-sm flex items-start gap-3">
            <span className="material-symbols-outlined text-[#9E7324] text-xl mt-0.5 flex-shrink-0">info</span>
            <div>
              <span className="text-[#1A1A18] font-bold block mb-0.5">{activeEra.title}</span>
              <p>{activeEra.desc}</p>
            </div>
          </div>
          <div className="mt-6 text-right">
            <Link to="/garis-waktu"
                  className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-[#9E7324]
                             uppercase tracking-wider hover:underline">
              Buka Garis Waktu Lengkap
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
