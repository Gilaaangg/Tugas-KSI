import { Link } from 'react-router-dom';

const FEATURED_BG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAK6bGX7AD7-tAjhcDnVMiCjtTuyVkygwOllsf0iXkEijPG0BcOOF8GLkNOUZrBjrMSJaVgZPwGjKA9zyHQMcZpeq1f11kiiui3sq7nPy_c1f2f-ydcz2YdibsluZSgc8Qg1l8mj8dpvB9_leboY3SNxK0pYEsfyvdHK9j7rPAiQq8UsrSMaRSKRAsnZt_oXVDcFFe15Y2l6JBhu0AYLPTNIKXu4PnRR9nDJkyp9TjWh0BaO6HIT5ALQA';

export default function FeaturedSpotlight() {
  return (
    <section className="w-full bg-[#EDE5DA]/60 py-28 relative overflow-hidden border-t border-[#E3DDD3]">
      <div className="container-page">
        {/* Label */}
        <div className="flex items-center gap-3 mb-10">
          <span className="px-3 py-1 rounded bg-[#9E7324] text-white font-sans uppercase tracking-widest font-semibold shadow-sm"
                style={{ fontSize: '0.625rem', letterSpacing: '0.2em' }}>
            Cerita Pilihan Kurator
          </span>
          <span className="text-[#5C5852] font-sans uppercase tracking-wider"
                style={{ fontSize: '0.625rem', letterSpacing: '0.2em', fontWeight: 700 }}>
            Edisi Triwulan I • Registrasi Arsip: LPG-ARC-094
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual column */}
          <div className="lg:col-span-7 relative">
            <div className="relative h-[480px] rounded-lg overflow-hidden shadow-lg border border-[#E3DDD3] bg-white">
              <div className="absolute inset-0 bg-cover bg-center"
                   style={{ backgroundImage: `url('${FEATURED_BG}')` }}
                   aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                   aria-hidden="true" />
              {/* Metadata badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded
                              bg-white/95 backdrop-blur-md border border-[#E3DDD3]
                              flex flex-wrap items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#9E7324]">pin_drop</span>
                  <div>
                    <p className="font-serif text-sm text-[#1A1A18] font-bold">Pugung Raharjo, Sekampung Udik</p>
                    <p className="font-sans text-[#5C5852]"
                       style={{ fontSize: '0.625rem', letterSpacing: '0.2em', fontWeight: 700 }}>
                      5°18′24.0″S 105°34′12.0″E • Lampung Timur
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[#5C5852] font-sans"
                     style={{ fontSize: '0.6875rem', letterSpacing: '0.16em', fontWeight: 600 }}>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#9E7324]">schedule</span>
                    8 Menit Baca
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#9E7324]">history</span>
                    Abad XII M
                  </span>
                </div>
              </div>
            </div>
            {/* Verification float */}
            <div className="hidden sm:flex absolute -bottom-6 -right-6 bg-white border border-[#E3DDD3]
                            p-4 rounded shadow-xl items-center gap-3 max-w-xs">
              <span className="material-symbols-outlined text-[#9E7324] text-3xl">verified</span>
              <p className="font-sans text-sm text-[#5C5852]">
                Teras punden berundak memadukan tradisi Megalitikum, Klasik Hindu-Buddha, hingga pengaruh Islam awal.
              </p>
            </div>
          </div>

          {/* Narrative column */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <span className="font-sans text-[#9E7324] uppercase font-semibold tracking-widest"
                  style={{ fontSize: '0.875rem', letterSpacing: '0.08em' }}>
              Arkeologi • Tiga Zaman
            </span>
            <h3 className="font-serif text-[#1A1A18] leading-tight"
                style={{ fontSize: '2.5rem', lineHeight: '3rem' }}>
              Menelusuri Jejak Megalitikum Pugung Raharjo: Menembus Tiga Zaman Peradaban Lampung
            </h3>
            <p className="font-sans text-[#5C5852] leading-relaxed"
               style={{ fontSize: '1rem', lineHeight: '1.625rem' }}>
              Ditemukan secara tidak sengaja oleh para transmigran pada tahun 1957 di tengah rimba Sekampung Udik, situs seluas 30 hektar ini menyimpan anomali arkeologis yang menggetarkan. Pugung Raharjo bukan sekadar makam batu; ia adalah laboratorium sinkretisme spiritual tempat altar Megalith, prasasti batu bertarikh, patung Bodhisattva, dan batu nisan Islam kuno hidup berdampingan dalam satu bentang tanah.
            </p>
            {/* Pull quote */}
            <div className="p-4 rounded bg-white border-l-4 border-[#9E7324] border-y border-r border-[#E3DDD3]
                            text-[#5C5852] font-sans text-sm space-y-1 shadow-sm">
              <p className="italic text-[#1A1A18] font-medium">
                "Sebuah kontinuitas permukiman suci yang tak terputus selama lebih dari tujuh ratus tahun di belahan timur Sumatera."
              </p>
              <p className="font-sans text-[#8C6418] uppercase tracking-wider font-semibold"
                 style={{ fontSize: '0.625rem', letterSpacing: '0.2em' }}>
                — Catatan Kurator Arkeologi JEJAK
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/jelajah?type=tempat"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded
                           bg-[#9E7324] text-white font-sans uppercase tracking-wider
                           hover:bg-[#8C6418] shadow-md transition-colors font-semibold"
                style={{ fontSize: '0.875rem', letterSpacing: '0.08em' }}
              >
                <span>Baca Catatan Kuratorial Lengkap</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>menu_book</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
