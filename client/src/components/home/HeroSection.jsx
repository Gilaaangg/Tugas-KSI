import { Link } from 'react-router-dom';

const HERO_BG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzIiMIkibqEeeb3FgL0VPXC45CQUDK73nCRm20JQ3HFy7CsGPRiCHcuWlI8_2DawXhRKaFh7vkGwf2ow2RdXeWGEojlT3dUSWrGo9d1qjSWc5if-I-8bGRK9okCHWJwrj183CbBPy7Bat0lEY8wDaekWH1aDq33cYk-okX9Ngkif4ZLQxEdxbpG_gJPmR4KJEZ72xpaKiPVs1PjllzHqrwTNbJlSIr5PtK4GpM4zk_b1CXmtFU-ZT0_Q';

export default function HeroSection() {
  return (
    <section className="relative w-full -mt-20 overflow-hidden bg-[#F5EFE8]">
      {/* Background image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-25 scale-105"
        style={{ backgroundImage: `url('${HERO_BG}')` }}
        aria-hidden="true"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FBF8F4] via-[#FBF8F4]/80 to-[#F5EFE8]/40"
           aria-hidden="true" />

      <div className="relative container-page pt-40 pb-20 min-h-screen flex flex-col justify-between">
        {/* Top badge */}
        <div className="flex items-center gap-3 pt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded
                           bg-white/90 text-[#8C6418] border border-[#E3DDD3]
                           font-sans uppercase tracking-widest backdrop-blur-md shadow-sm"
                style={{ fontSize: '0.625rem', letterSpacing: '0.2em', fontWeight: 700 }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E7324] animate-pulse" />
            Koleksi Terbuka Warisan Ruwa Jurai
          </span>
          <span className="hidden sm:inline text-[#5C5852] uppercase tracking-widest"
                style={{ fontSize: '0.625rem', letterSpacing: '0.2em', fontWeight: 700 }}>
            Kode Aksesi ID-LPG-MUSEUM-2025
          </span>
        </div>

        {/* Hero content */}
        <div className="max-w-4xl my-auto py-12">
          <div className="overflow-hidden mb-6">
            <p className="font-sans text-[#9E7324] uppercase mb-3 flex items-center gap-2 font-semibold tracking-widest"
               style={{ fontSize: '0.875rem', letterSpacing: '0.08em' }}>
              <span className="material-symbols-outlined text-sm text-[#9E7324]">history_edu</span>
              Suaka Digital Kebudayaan Lampung
            </p>
            <h1 className="font-serif text-[#1A1A18] leading-none tracking-tight"
                style={{ fontSize: 'clamp(2.75rem, 7vw, 4.5rem)', lineHeight: 1.05 }}>
              Temukan sejarahnya.<br />
              <span className="italic font-normal text-[#9E7324]">Jaga ceritanya.</span>
            </h1>
          </div>

          <p className="font-sans text-[#5C5852] max-w-2xl leading-relaxed mb-10"
             style={{ fontSize: '1.125rem', lineHeight: '1.875rem' }}>
            Menelusuri cerita, budaya, dan warisan Lampung dalam satu ruang digital. Menghubungkan kedalaman filosofi masa lampau dengan kurasi presisi generasi masa kini.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/jelajah"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded
                         bg-[#9E7324] hover:bg-[#8C6418] text-white font-sans uppercase tracking-wider
                         shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
              style={{ fontSize: '0.875rem', letterSpacing: '0.08em' }}
            >
              <span>Mulai Menjelajah</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </Link>
            <Link
              to="/bagikan-jejak"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded
                         bg-white hover:bg-[#EDE5DA] text-[#1A1A18] border border-[#E3DDD3]
                         font-sans uppercase tracking-wider shadow-sm transition-all duration-300 font-semibold"
              style={{ fontSize: '0.875rem', letterSpacing: '0.08em' }}
            >
              <span className="material-symbols-outlined text-[#9E7324]" style={{ fontSize: '18px' }}>archive</span>
              <span>Bagikan Jejakmu</span>
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="pt-10">
          <div className="bg-white/95 border border-[#E3DDD3] shadow-sm p-5 rounded-lg
                          flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#9E7324]" />
              <span className="font-sans text-[#5C5852] uppercase tracking-widest"
                    style={{ fontSize: '0.625rem', letterSpacing: '0.2em', fontWeight: 700 }}>
                Registrasi Kuratorial
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-8 gap-y-2 text-center md:text-right">
              {[
                { value: '1.420+', label: 'Benda Budaya' },
                { value: '8',      label: 'Wilayah Adat' },
                { value: '4',      label: 'Abad Sejarah Tertulis' },
              ].map(({ value, label }, i, arr) => (
                <div key={label} className="flex items-center gap-2">
                  <div>
                    <span className="font-serif text-[#9E7324] font-semibold mr-1.5"
                          style={{ fontSize: '1.375rem', lineHeight: '1.875rem' }}>
                      {value}
                    </span>
                    <span className="font-sans text-sm text-[#5C5852]">{label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <span className="hidden sm:inline text-[#E3DDD3] ml-2">/</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
