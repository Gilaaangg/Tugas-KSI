import { Link } from 'react-router-dom';

const CONTENT_LINKS = [
  { to: '/jelajah?type=sejarah',  label: 'Sejarah & Peristiwa' },
  { to: '/jelajah?type=budaya',   label: 'Warisan Budaya' },
  { to: '/jelajah?type=artefak',  label: 'Koleksi Artefak' },
  { to: '/jelajah?type=tokoh',    label: 'Tokoh Bersejarah' },
  { to: '/jelajah?type=tempat',   label: 'Situs & Cagar Budaya' },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A1A18] text-[#f4f0eb] border-t border-[#E3DDD3]/10">
      {/* Main footer */}
      <div className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '18px' }}>
                  museum
                </span>
              </div>
              <div>
                <span className="font-serif text-xl font-semibold text-[#f2be68] leading-none block">
                  JEJAK
                </span>
                <span className="text-[#817566]" style={{ fontSize: '0.575rem', letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase' }}>
                  Museum Digital Lampung
                </span>
              </div>
            </div>
            <p className="font-sans text-sm text-[#817566] leading-relaxed mb-6">
              Suaka digital warisan budaya dan sejarah Lampung. Temukan sejarahnya, jaga ceritanya untuk generasi mendatang.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9E7324] animate-pulse"></span>
              <span className="font-sans text-xs text-[#817566] uppercase tracking-widest">
                Koleksi Terbuka Warisan Ruwa Jurai
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-[#f2be68] mb-4">
              Navigasi
            </h3>
            <ul className="space-y-2">
              {[
                { to: '/',            label: 'Beranda' },
                { to: '/jelajah',     label: 'Jelajah' },
                { to: '/peta',        label: 'Peta Sejarah' },
                { to: '/garis-waktu', label: 'Garis Waktu' },
                { to: '/cari',        label: 'Pencarian' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}
                        className="font-sans text-sm text-[#817566] hover:text-[#f4f0eb] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Koleksi */}
          <div className="md:col-span-3">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-[#f2be68] mb-4">
              Koleksi
            </h3>
            <ul className="space-y-2">
              {CONTENT_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}
                        className="font-sans text-sm text-[#817566] hover:text-[#f4f0eb] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontribusi */}
          <div className="md:col-span-3">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-[#f2be68] mb-4">
              Kontribusi
            </h3>
            <p className="font-sans text-sm text-[#817566] leading-relaxed mb-4">
              Punya cerita atau dokumentasi tentang Lampung? Bagikan kepada kami.
            </p>
            <Link to="/bagikan-jejak"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded
                             border border-[#9E7324] text-[#f2be68] font-sans text-sm uppercase tracking-wider
                             hover:bg-[#9E7324] hover:text-white transition-all duration-300">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>upload_file</span>
              Bagikan Jejak
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2B211A] py-6">
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-[#5C5852]">
            © {new Date().getFullYear()} JEJAK Museum Digital Lampung. Proyek Lomba Desain Web.
          </p>
          <p className="font-sans text-xs text-[#5C5852]">
            Sang Bumi Ruwa Jurai — <span className="text-[#9E7324]">Sai Bumi Ruwa Jurai</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
