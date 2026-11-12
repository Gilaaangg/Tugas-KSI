export default function ManifestoSection() {
  return (
    <section className="w-full bg-[#FBF8F4] py-28 relative border-t border-[#E3DDD3]">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left column */}
          <div className="lg:col-span-5 relative">
            <span className="font-sans text-[#9E7324] uppercase tracking-widest mb-4 block font-bold"
                  style={{ fontSize: '0.625rem', letterSpacing: '0.2em' }}>
              Manifesto • Bab I
            </span>
            <h2 className="font-serif text-[#1A1A18] leading-tight tracking-tight mb-8"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: '1.15' }}>
              Setiap tempat memiliki cerita.<br />
              <span className="text-[#5C5852] font-light italic">Setiap benda meninggalkan jejak.</span><br />
              Dan setiap generasi memiliki sesuatu untuk diwariskan.
            </h2>
            <div className="w-16 h-0.5 bg-[#9E7324] mb-8" />
            {/* Aksara box */}
            <div className="p-6 rounded bg-[#F5EFE8] border border-[#E3DDD3] shadow-sm">
              <span className="font-sans text-[#9E7324] uppercase tracking-widest block mb-2 font-bold"
                    style={{ fontSize: '0.625rem', letterSpacing: '0.2em' }}>
                Aksara Ka-Ga-Nga (Had Lampung)
              </span>
              <p className="font-serif text-[#8C6418] leading-none tracking-widest font-normal opacity-90 select-none"
                 style={{ fontSize: '2rem' }}>
                შრბუ ლღს ეყ
              </p>
              <p className="font-sans text-sm text-[#5C5852] mt-3 italic">
                "Piawang mawat mak bangik, mawat di dudi mak benor." — Kearifan adat dalam meniti peradaban luhur.
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 pt-4">
            <div className="space-y-6 text-[#5C5852] leading-relaxed"
                 style={{ fontSize: '1.125rem', lineHeight: '1.875rem' }}>
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-[#9E7324]
                            first-letter:float-left first-letter:mr-3 first-letter:leading-none">
                JEJAK hadir bukan sekadar katalog digital pasif, melainkan ikhtiar pemuliaan memori kolektif Sang Bumi Ruwa Jurai. Dari lereng sakral Gunung Pesagi sebagai titik mula trah Skala Brak, hingga riuh bandar lada Teluk Semaka yang melintasi rute rempah dunia, jejak peradaban Lampung terpahat dalam ragam wujud.
              </p>
              <p>
                Kami mendokumentasikan tenunan Tapis benang emas yang mencerminkan kosmologi leluhur, naskah kuno beraksara Had Lampung pada bilah bambu dan kulit kayu dalung, hingga dialog adat dua pilar agung: Saibatin dan Pepadun. Suara masa lalu dirawat dalam presisi digital resolusi tinggi, membuka pintu tafsir baru bagi peneliti, budayawan, dan generasi mendatang.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              {[
                {
                  icon: 'local_florist',
                  title: 'Rute Lada Hitam',
                  desc: 'Pusat pertukaran komoditas maritim Samudera Hindia sejak abad ke-15.',
                },
                {
                  icon: 'temple_buddhist',
                  title: 'Skala Brak',
                  desc: 'Leluhur kerajaan purba di lereng Gunung Pesagi penegak adat jurai.',
                },
                {
                  icon: 'auto_stories',
                  title: 'Sastra Lisan',
                  desc: 'Pelestarian tradisi Hahiwang, Pisaan, dan naskah kuno piil pesenggiri.',
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="p-5 rounded bg-white border border-[#E3DDD3] shadow-sm">
                  <span className="material-symbols-outlined text-[#9E7324] text-2xl mb-2 block">{icon}</span>
                  <h3 className="font-serif text-[#1A1A18] text-base mb-1"
                      style={{ fontSize: '1.375rem', lineHeight: '1.875rem', fontWeight: 600 }}>
                    {title}
                  </h3>
                  <p className="font-sans text-sm text-[#5C5852]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
