import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    span: 'md:col-span-8',
    height: 'h-[420px]',
    bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbrS1mcxiAfaZ8d47tJpSEaTZvhK-AYYGhGfgC47UppVWffqAkIRs5_L4aUI4zKmRWV-rknpj5IuNFANCQqNx1FYX0YCCn0FyRI86Z2QuO6AFPBZ3a5l9kSN2RkjighqrRv_Sah7yBRTMcA4mi6NHn6cRg6Mt3q8_lNnm7NI3EpeBqZ3AoT40sAR3df6l6X_3RNGhJjjNKsC1TG0yn7fYzN1uTw4lSROuvKuWkzAsBlRfAkk_mQtAS7g',
    badge:  'Katalog 01 • Kronika',
    period: '1817 – 1945 M',
    type:   'sejarah',
    title:  'Sejarah & Peristiwa',
    desc:   'Merekam heroisme Perang Radin Inten II di Gunung Rajabasa, perpolitikan konfederasi Buay Lima, hingga simpul niaga rempah Selat Sunda.',
    cta:    'Buka Ruang Arsip',
  },
  {
    span: 'md:col-span-4',
    height: 'h-[420px]',
    bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkAPQ_sQf73RB5ilp9LOKasP_SfHWIO97TeVxqglLXeKWs3B2i9RfDz2ZOJ5IZT3GWBWvS27hvXkRtoHHqAqPjm-XG_FAnB6DVXzTL5Whu5SWUYp74BsHRUD3ixEKME3SVJnsFz9bladsgWCBQxlltsKU0Qm-BLPL2LvcFtCU4kq9_xKiHOfbUYOOrS-gaiTFjtHgtXJxpYzqFbRLeRdaLMhzf02JZvrbkB0EnUPEtalczzdN3u39sQQ',
    badge:  'Katalog 02 • Wastra & Ritus',
    type:   'budaya',
    title:  'Warisan Budaya & Tradisi',
    desc:   'Kemegahan Tapis Jung Sarat, upacara Begawi Cakak Pepadun, tari Melinting, serta tata krama adat Saibatin.',
    cta:    'Pelajari Tradisi',
  },
  {
    span: 'md:col-span-4',
    height: 'h-[360px]',
    bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCouTjpFcRqrliJt064EGeUSbLl7iTKK6jnH5JHcvmaED125relK5KncT4EjsD1PrMph2GzURmcmVwpxmROb-CHEtvzonMzLA5Qupa_r6M2ROjFw1kyrKy-x6lxk_PgcIaNWpxPaQdUBY6dOTluhumYUtr-pP-f4RrNeLOKwM-q6uyfRVlra987MuwoDf8zs_NMbiH7-CQI7KwFFTQdjKDGSOHFKI3_EWzdeythKAnxwYFQVoBcAj4Dlg',
    badge:  'Katalog 03 • Benda Cagar',
    type:   'artefak',
    title:  'Koleksi Artefak',
    desc:   'Bejana perunggu zaman prasejarah, senjata Badik Gecong, peninggalan keramik Dinasti Tang.',
    cta:    'Lihat 412 Artefak',
  },
  {
    span: 'md:col-span-4',
    height: 'h-[360px]',
    bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXX_TBR7mCn1X7zqIPRbi-ZzliPi1Te8d8uqcTot3C90EKG8JgKIwqYHlOkNCOsLXpNCuNByLQHB3Dvk70WKlovDBql2xbJ8cdE4HHiPc4tjW68zqWsdqLu0gpEOvSpY8GOEqcAIOstNUP5ZVH7s7mHxx42SHvOZfZc9P3myv2zxGcnkZU7fj_R-CFAsQsEj-yGL5R5hXmODwbmMieOJLPsHGwlkSWmvotX2AhNe4wMW8lpGs3rR5z6Q',
    badge:  'Katalog 04 • Biografi',
    type:   'tokoh',
    title:  'Tokoh Bersejarah',
    desc:   'Kisah juang Radin Inten I & II, para Pun Saibatin, Punyimbang Adat Pepadun, dan perintis literasi Lampung.',
    cta:    'Telusuri Biografi',
  },
  {
    span: 'md:col-span-4',
    height: 'h-[360px]',
    bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2arL5k-fryljajtUqJ1BeFNklN7cpxtUQWp8enaN1xLSfFWtn06qV3DgMk87pSisVMG8RPOyUUaH_PtYPkMq3IV_K1yOYoejrPZ0ico9aMzNNX6CbgGO7tAOf0vIs4nGpRya3jqDppXUTZM5VolAOPWNnmo4E2ppuG4gl3Cf1u9IGsUh9eAywNDSUedAtvFG_9laCRmPWiyOlWaUSUqxLhIS8J1TIO0kI3ph6U51ceCznpceNfhHa3g',
    badge:  'Katalog 05 • Lanskap Cagar',
    type:   'tempat',
    title:  'Situs & Cagar Budaya',
    desc:   'Taman Purbakala Pugung Raharjo, Benteng Cikoneng, Prasasti Palas Pasemah, dan Batu Berak.',
    cta:    'Eksplorasi Lokasi',
  },
];

export default function ExploreGatewaySection() {
  return (
    <section id="jelajah-kategori"
             className="w-full bg-[#F5EFE8] py-28 relative border-t border-[#E3DDD3]">
      <div className="container-page">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-sans text-[#9E7324] uppercase tracking-widest block mb-2 font-bold"
                  style={{ fontSize: '0.625rem', letterSpacing: '0.2em' }}>
              Etalase Tematik
            </span>
            <h2 className="font-serif text-[#1A1A18]"
                style={{ fontSize: '2.5rem', lineHeight: '3rem' }}>
              Jelajahi Koridor Budaya
            </h2>
          </div>
          <p className="font-sans text-[#5C5852] max-w-md"
             style={{ fontSize: '1rem', lineHeight: '1.625rem' }}>
            Pintu masuk multidimensional untuk mengarungi khazanah benda, kisah perjuangan, lanskap cagar, dan figur bersejarah.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {CATEGORIES.map(({ span, height, bg, badge, period, type, title, desc, cta }) => (
            <Link
              key={type}
              to={`/jelajah?type=${type}`}
              className={`${span} group relative overflow-hidden rounded-lg bg-white border border-[#E3DDD3]
                          ${height} flex flex-col justify-end p-6 md:p-8
                          transition-all duration-500 hover:-translate-y-1 hover:shadow-lg`}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${bg}')` }}
                aria-hidden="true"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent"
                   aria-hidden="true" />
              {/* Content */}
              <div className="relative z-10 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-sans text-white px-2 py-0.5 rounded bg-[#9E7324] shadow-sm uppercase"
                        style={{ fontSize: '0.625rem', letterSpacing: '0.2em', fontWeight: 700 }}>
                    {badge}
                  </span>
                  {period && (
                    <span className="font-sans text-white/80 uppercase"
                          style={{ fontSize: '0.625rem', letterSpacing: '0.2em', fontWeight: 700 }}>
                      {period}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-white mb-2 group-hover:text-[#f2be68] transition-colors"
                    style={{ fontSize: '1.875rem', lineHeight: '2.375rem', fontWeight: 500 }}>
                  {title}
                </h3>
                <p className="font-sans text-white/90 max-w-lg mb-4 line-clamp-2"
                   style={{ fontSize: '1rem', lineHeight: '1.625rem' }}>
                  {desc}
                </p>
                <div className="flex items-center gap-2 text-[#f2be68] font-sans uppercase tracking-wider font-semibold"
                     style={{ fontSize: '0.75rem', letterSpacing: '0.12em' }}>
                  <span>{cta}</span>
                  <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                    north_east
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
