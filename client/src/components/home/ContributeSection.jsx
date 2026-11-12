import { Link } from 'react-router-dom';

export default function ContributeSection() {
  return (
    <section id="kontribusi"
             className="w-full bg-[#F5EFE8] py-24 relative overflow-hidden border-t border-[#E3DDD3]">
      {/* Decorative blur */}
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#9E7324]/5 blur-3xl pointer-events-none"
           aria-hidden="true" />
      <div className="container-page relative z-10">
        <div className="p-10 lg:p-16 rounded-xl bg-white border border-[#E3DDD3] shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text */}
            <div className="lg:col-span-8 space-y-4">
              <span className="font-sans text-[#9E7324] uppercase tracking-widest block font-bold"
                    style={{ fontSize: '0.625rem', letterSpacing: '0.2em' }}>
                Gerakan Rawat Ingatan Publik
              </span>
              <h2 className="font-serif text-[#1A1A18] leading-tight"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1.2 }}>
                Punya cerita tentang Lampung yang layak dikenang?<br />
                <span className="text-[#9E7324] font-normal italic">Rawat ingatan kolektif bersama kami.</span>
              </h2>
              <p className="font-sans text-[#5C5852] max-w-2xl leading-relaxed"
                 style={{ fontSize: '1.125rem', lineHeight: '1.875rem' }}>
                Arsip keluarga, foto lawas desa, rekaman lisan tetua adat, atau foto kain warisan leluhur Anda adalah puzzle penting bagi historiografi Lampung. Tim kurator kami mendampingi proses digitalisasi dan atribusi cagar budaya Anda secara bermartabat.
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-2 font-sans text-sm text-[#1A1A18]">
                {[
                  { icon: 'verified_user',      label: 'Atribusi Hak Pemilik Penuh' },
                  { icon: 'workspace_premium',  label: 'Standar Preservasi Digital ISO' },
                  { icon: 'public',             label: 'Akses Pendidikan Terbuka' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#9E7324] text-sm">{icon}</span>
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* CTAs */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center items-start lg:items-end">
              <Link
                to="/bagikan-jejak"
                className="w-full sm:w-auto lg:w-full inline-flex items-center justify-center gap-3
                           px-8 py-4 rounded bg-[#9E7324] text-white font-sans uppercase tracking-wider
                           hover:bg-[#8C6418] transition-all shadow-md text-center font-semibold"
                style={{ fontSize: '0.875rem', letterSpacing: '0.08em' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>upload_file</span>
                <span>Kirim Arsip Sejarah</span>
              </Link>
              <Link
                to="/bagikan-jejak#panduan"
                className="w-full sm:w-auto lg:w-full inline-flex items-center justify-center gap-2
                           px-6 py-3.5 rounded bg-[#F5EFE8] hover:bg-[#EDE5DA] text-[#1A1A18]
                           border border-[#E3DDD3] font-sans uppercase tracking-wider transition-colors
                           text-center font-medium"
                style={{ fontSize: '0.75rem', letterSpacing: '0.12em' }}
              >
                <span>Panduan Penyerahan Naskah</span>
                <span className="material-symbols-outlined text-sm">help_outline</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
