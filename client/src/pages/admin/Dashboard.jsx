import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/layout/PublicLayout.jsx';

const QUEUE_ITEMS = [
  {
    id: 'ARC-2024-089',
    title: 'Dokumentasi Jalur Gerilya Radin Inten II di Kaki G. Rajabasa & Peninggalan Keris Pusaka',
    author: 'Hasan Basri',
    authorCity: 'Kalianda, Lampung Selatan',
    category: 'Sejarah / Artefak',
    time: '2 hari lalu',
    urgencyScore: 92,
    status: 'MENUNGGU',
    statusBadge: 'Menunggu Verifikasi',
    statusBg: 'bg-[#FFDBCF] text-[#762F15]',
    content: 'Jalur persembunyian gerilya Radin Inten II di perbukitan Gunung Rajabasa meliputi lima gua alami dan bekas benteng tanah liat. Di lokasi ditemukan pecahan keramik Dinasti Qing dan sebuah keris lekuk sembilan berhulu gading gajah yang kini dirawat oleh keturunan juru kunci makam.',
    period: '1851 — 1856 M',
    region: 'Lampung Selatan',
    interviewee: 'Mbah Raden Usman (87 Tahun, Sesepuh Desa Cempaka)',
    sourceDoc: 'Buku Silsilah Marga Dantaran & Catatan Kolonial Verkerk Pistorius 1871',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbrS1mcxiAfaZ8d47tJpSEaTZvhK-AYYGhGfgC47UppVWffqAkIRs5_L4aUI4zKmRWV-rknpj5IuNFANCQqNx1FYX0YCCn0FyRI86Z2QuO6AFPBZ3a5l9kSN2RkjighqrRv_Sah7yBRTMcA4mi6NHn6cRg6Mt3q8_lNnm7NI3EpeBqZ3AoT40sAR3df6l6X_3RNGhJjjNKsC1TG0yn7fYzN1uTw4lSROuvKuWkzAsBlRfAkk_mQtAS7g',
    coordinates: '05° 41\' 10" S, 105° 37\' 50" E'
  },
  {
    id: 'ARC-2024-090',
    title: 'Manuskrip Kulit Kayu Naskah Surat Tanjau (Aksara Had Lampung Abad XVIII)',
    author: 'Drs. M. Ansori',
    authorCity: 'Menggala, Tulang Bawang',
    category: 'Manuskrip Kuno',
    time: '4 hari lalu',
    urgencyScore: 74,
    status: 'EKSAMINASI',
    statusBadge: 'Uji Filologi',
    statusBg: 'bg-[#FFDEAD] text-[#604100]',
    content: 'Manuskrip berbahan kulit pohon terap (Artocarpus elasticus) bertuliskan aksara Had Lampung kuno dengan tinta getah jering. Memuat aturan denda adat perniagaan perahu di sepanjang muara Way Tulang Bawang.',
    period: 'Abad ke-18 Masehi',
    region: 'Tulang Bawang',
    interviewee: 'Keluarga Ahli Waris Pasirah Ansori',
    sourceDoc: 'Penyimpanan Lemari Pusaka Rumah Panggung Menggala',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmiKg7ytqESZHUYxZ54zJg4So1GF14z5u8jfMD4ksst_9VQPBbb8LbLHsjHq04hCS5tUROO7DL6gFKRkh5dsctzhpgXK-4bDmjQYAaebQaumv46Pfz6GmKIn6IecLF8sfTJspkQSUVOYtXiQVNP51MKx4j0CR29zSqZ2sd3NiCXcOSw5XRN8t1yQETvSzhgxjOnBx3fUwL4O94EXFsP4Y3DEG-McMSDH8K7L8gQ0dv9NaRtVmeur92Zg',
    coordinates: '04° 27\' 20" S, 105° 14\' 30" E'
  },
  {
    id: 'ARC-2024-091',
    title: 'Kain Tapis Jung Sarat Benang Emas Murni Motif Pohon Hayat Pesisir Saibatin',
    author: 'Hj. Maryamah',
    authorCity: 'Krui, Pesisir Barat',
    category: 'Wastra & Kriya',
    time: '1 minggu lalu',
    urgencyScore: 68,
    status: 'REVISI',
    statusBadge: 'Butuh Bukti Tambahan',
    statusBg: 'bg-[#E6E2DD] text-[#4F4538]',
    content: 'Tapis berumur lebih dari 120 tahun yang ditenun dengan kapas pintal tangan dan sulaman benang emas pipih (cengkok). Dikenakan khusus pada upacara Nayuh Khadin di Pesisir Barat.',
    period: 'ca. 1900-an',
    region: 'Pesisir Barat',
    interviewee: 'Hj. Maryamah (Pengrajin Generasi ke-3)',
    sourceDoc: 'Warisan Turun Temurun Lamban Gedung Saibatin Marga Krui',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAov8ZCYu2PYSyDDt9bLYL7uRbYinBe347qKrPtmMHjfiXIjxS74ToeGanQxu_tXkHZVAeRaBB1zPyDkgGpUAGNJqvqPgnDMtqDBZwozwhR4YZEhBS1JojCwsdt_YQ9FoZydtWyGK6dJ6vq5RPLP6hlm6A-Be6rqbrxmyigklPeKiJWjuxaQQZUxscUuF-AhYVU7RksCmcxQ6sQcP2TrGNijSVFucfMuMcXbLsTV7XT6PTeLYgzLUfz6Q',
    coordinates: '05° 11\' 30" S, 103° 56\' 15" E'
  }
];

export default function AdminDashboard() {
  const [items, setItems] = useState(QUEUE_ITEMS);
  const [selectedId, setSelectedId] = useState('ARC-2024-089');
  const [filterTab, setFilterTab] = useState('SEMUA');
  const [adminNote, setAdminNote] = useState('');
  const [actionNotice, setActionNotice] = useState(null);

  const selectedItem = items.find((i) => i.id === selectedId) || items[0];

  const handleApprove = () => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedId
          ? { ...i, status: 'DISETUJUI', statusBadge: 'Telah Disetujui', statusBg: 'bg-[#E7F3ED] text-[#1D6F42]' }
          : i
      )
    );
    setActionNotice('Pengajuan berhasil Disetujui & otomatis diterbitkan ke Koleksi Publik!');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleRevision = () => {
    if (!adminNote) {
      alert('Mohon masukkan catatan revisi untuk kontributor terlebih dahulu.');
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedId
          ? { ...i, status: 'REVISI', statusBadge: 'Perlu Revisi', statusBg: 'bg-[#FFF2F0] text-[#BA1A1A]' }
          : i
      )
    );
    setActionNotice('Permintaan revisi dan catatan kurator telah dikirimkan ke kontributor.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleReject = () => {
    if (!adminNote) {
      alert('Mohon masukkan alasan penolakan berkas.');
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedId
          ? { ...i, status: 'DITOLAK', statusBadge: 'Ditolak', statusBg: 'bg-[#F5E8E8] text-[#7D2222]' }
          : i
      )
    );
    setActionNotice('Pengajuan telah ditolak.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const filteredItems = items.filter((i) => {
    if (filterTab === 'SEMUA') return true;
    if (filterTab === 'MENUNGGU') return i.status === 'MENUNGGU';
    if (filterTab === 'EKSAMINASI') return i.status === 'EKSAMINASI';
    if (filterTab === 'DISETUJUI') return i.status === 'DISETUJUI';
    return true;
  });

  return (
    <PublicLayout>
      <div className="w-full bg-[#FDFBF7] text-on-surface min-h-screen">
        {/* Header */}
        <section className="bg-[#FAF6F0] border-b border-[#E6E0D4] py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-sans text-[11px] uppercase tracking-widest text-primary font-bold">
                  KONSOL KURASI &amp; VERIFIKASI ARSIP
                </span>
                <span className="px-2 py-0.5 rounded bg-primary text-white text-[10px] font-bold">
                  AKSES KURATOR RESMI
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A18] font-bold">
                Meja Kurator JEJAK Lampung
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#4F4538] mt-2 max-w-2xl leading-relaxed">
                Tinjau, uji filologi, dan verifikasi sumbangan sejarah lisan maupun pusaka keluarga warga Lampung sebelum diterbitkan secara resmi.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/jelajah"
                className="px-4 py-2 bg-white border border-outline-variant hover:border-primary text-primary font-sans text-xs uppercase tracking-wider font-semibold rounded flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>Lihat Galeri Publik</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Statistical Summary Bar */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E0D8CC] p-4 rounded shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#817566] uppercase font-bold mb-1">
                <span>Menunggu Verifikasi</span>
                <span className="material-symbols-outlined text-[#762F15] text-[18px]">pending_actions</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-[#1A1A18]">14</span>
                <span className="text-xs text-[#817566]">berkas baru</span>
              </div>
              <p className="text-[11px] text-primary font-medium mt-1">Urgensi Tinggi (Prioritas 1)</p>
            </div>

            <div className="bg-white border border-[#E0D8CC] p-4 rounded shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#817566] uppercase font-bold mb-1">
                <span>Eksaminasi Filologi</span>
                <span className="material-symbols-outlined text-[#7B5500] text-[18px]">biotech</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-[#1A1A18]">6</span>
                <span className="text-xs text-[#817566]">manuskrip</span>
              </div>
              <p className="text-[11px] text-[#7B5500] font-medium mt-1">Proses Uji Laboratorium</p>
            </div>

            <div className="bg-white border border-[#E0D8CC] p-4 rounded shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#817566] uppercase font-bold mb-1">
                <span>Arsip Disetujui</span>
                <span className="material-symbols-outlined text-[#1D6F42] text-[18px]">verified</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-[#1A1A18]">128</span>
                <span className="text-xs text-[#817566]">monograf</span>
              </div>
              <p className="text-[11px] text-[#1D6F42] font-medium mt-1">Telah Tayang di Publik</p>
            </div>

            <div className="bg-white border border-[#E0D8CC] p-4 rounded shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#817566] uppercase font-bold mb-1">
                <span>Koreksi Data</span>
                <span className="material-symbols-outlined text-[#BA1A1A] text-[18px]">edit_note</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-[#1A1A18]">9</span>
                <span className="text-xs text-[#817566]">revisi</span>
              </div>
              <p className="text-[11px] text-[#BA1A1A] font-medium mt-1">Perlu Tambahan Sumber</p>
            </div>
          </div>
        </section>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-4">
            <div className="p-4 bg-[#E7F3ED] border border-[#1D6F42] text-[#1D6F42] rounded flex items-center gap-3 font-sans text-xs font-semibold shadow-sm animate-fade-in">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>{actionNotice}</span>
            </div>
          </div>
        )}

        {/* Split-Pane Review Workspace */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Queue List & Search (4 Cols) */}
            <aside className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white border border-[#E0D8CC] rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif font-bold text-base text-[#1A1A18]">
                    Daftar Pengajuan
                  </span>
                  <span className="font-sans text-[11px] px-2 py-0.5 rounded bg-[#FAF2E6] text-primary font-bold">
                    {items.length} Berkas
                  </span>
                </div>

                {/* Queue Filter Tabs */}
                <div className="flex gap-1 overflow-x-auto pb-2 mb-3">
                  {[
                    { id: 'SEMUA', label: 'Semua' },
                    { id: 'MENUNGGU', label: 'Menunggu' },
                    { id: 'EKSAMINASI', label: 'Eksaminasi' },
                    { id: 'DISETUJUI', label: 'Disetujui' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setFilterTab(t.id)}
                      className={`px-2.5 py-1 rounded text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap ${
                        filterTab === t.id
                          ? 'bg-primary text-white'
                          : 'bg-[#FAF6F0] text-[#4F4538] hover:bg-[#F1EDE8]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* List Cards */}
                <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                  {filteredItems.map((item) => {
                    const isSelected = item.id === selectedId;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`p-4 rounded border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FAF2E6] border-primary shadow-sm ring-1 ring-primary'
                            : 'bg-white border-[#E0D8CC] hover:border-primary'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase ${item.statusBg}`}>
                            {item.statusBadge}
                          </span>
                          <span className="text-[10px] text-[#817566]">{item.time}</span>
                        </div>

                        <h4 className="font-serif text-sm font-bold text-[#1A1A18] line-clamp-2 leading-snug mb-1.5">
                          {item.title}
                        </h4>

                        <div className="flex items-center gap-1.5 text-[#817566] text-xs mb-2">
                          <span className="material-symbols-outlined text-[14px] text-primary">person</span>
                          <span className="truncate">{item.author} • {item.authorCity}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30 text-[11px]">
                          <span className="text-[#817566]">{item.category}</span>
                          <span className="font-sans font-bold text-primary flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[13px]">bolt</span>
                            {item.urgencyScore}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* RIGHT COLUMN: Examination Desk & Decision Workspace (8 Cols) */}
            <main className="lg:col-span-8 bg-white border border-[#E0D8CC] rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Archival Docket Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/50">
                <div>
                  <span className="font-mono text-xs text-primary font-bold bg-[#FAF2E6] border border-[#EDDCBF] px-2 py-0.5 rounded uppercase">
                    BERKAS: {selectedItem.id}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#1A1A18] mt-2 leading-snug">
                    {selectedItem.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-primary hover:bg-primary-container text-white font-sans text-xs uppercase tracking-wider font-bold rounded flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Setujui &amp; Publikasi</span>
                  </button>

                  <button
                    onClick={handleRevision}
                    className="px-3.5 py-2 bg-white border border-outline-variant hover:border-[#BA1A1A] text-[#BA1A1A] font-sans text-xs uppercase tracking-wider font-semibold rounded flex items-center gap-1 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit_note</span>
                    <span>Minta Revisi</span>
                  </button>

                  <button
                    onClick={handleReject}
                    className="p-2 border border-outline-variant hover:bg-[#F5E8E8] text-[#7D2222] rounded transition-all"
                    title="Tolak Pengajuan"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>

              {/* Submitter & Metadata Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#FAF6F0] p-4 rounded border border-[#E8DFC8] text-xs">
                <div>
                  <span className="font-sans text-[10px] text-[#817566] uppercase font-bold block mb-0.5">
                    Pengusul &amp; Asal
                  </span>
                  <span className="font-bold text-[#1A1A18] block">{selectedItem.author}</span>
                  <span className="text-[#817566]">{selectedItem.authorCity}</span>
                </div>
                <div>
                  <span className="font-sans text-[10px] text-[#817566] uppercase font-bold block mb-0.5">
                    Konteks Temporal
                  </span>
                  <span className="font-bold text-[#1A1A18] block">{selectedItem.period}</span>
                  <span className="text-[#817566]">{selectedItem.region}</span>
                </div>
                <div>
                  <span className="font-sans text-[10px] text-[#817566] uppercase font-bold block mb-0.5">
                    Koordinat Geospasial
                  </span>
                  <span className="font-mono text-primary font-bold block">{selectedItem.coordinates}</span>
                  <span className="text-[#817566]">Terhubung ke Peta</span>
                </div>
              </div>

              {/* Main Content & Transkrip */}
              <div className="space-y-3">
                <span className="font-sans text-xs uppercase tracking-widest text-primary font-bold block">
                  TRANSKRIP NARASI HISTORIS
                </span>
                <div className="p-4 bg-[#FDFBF7] border border-outline-variant/60 rounded text-sm text-[#1A1A18] leading-relaxed font-sans">
                  {selectedItem.content}
                </div>
              </div>

              {/* Provenance & Oral History Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-outline-variant/60 rounded space-y-1">
                  <span className="font-sans text-[10px] text-primary uppercase font-bold block">
                    Narasumber Tradisi Lisan
                  </span>
                  <p className="font-sans text-xs font-semibold text-[#1A1A18]">
                    {selectedItem.interviewee}
                  </p>
                </div>
                <div className="p-4 bg-white border border-outline-variant/60 rounded space-y-1">
                  <span className="font-sans text-[10px] text-primary uppercase font-bold block">
                    Rujukan Fisik / Dokumen
                  </span>
                  <p className="font-sans text-xs font-semibold text-[#1A1A18]">
                    {selectedItem.sourceDoc}
                  </p>
                </div>
              </div>

              {/* Visual Attachment Examination */}
              <div className="space-y-3">
                <span className="font-sans text-xs uppercase tracking-widest text-primary font-bold block">
                  DOKUMENTASI VISUAL LAMPIRAN
                </span>
                <div className="relative h-64 w-full rounded overflow-hidden border border-outline-variant/60 bg-[#F1EDE8]">
                  <img
                    src={selectedItem.img}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-sans text-primary font-bold shadow-sm">
                    Lampiran Resolusi Tinggi (12 MP Alih Media)
                  </div>
                </div>
              </div>

              {/* Curator Feedback Note Input */}
              <div className="space-y-2 pt-2">
                <label className="block font-sans text-xs uppercase tracking-wider text-[#1A1A18] font-bold">
                  Catatan Kuratorial / Alasan Revisi (Akan Dilihat oleh Kontributor)
                </label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Tuliskan catatan verifikasi, rekomendasi tambahan sumber, atau konfirmasi kelayakan monograf..."
                  className="w-full bg-[#FAF6F0] p-3 rounded border border-outline-variant/60 font-sans text-xs text-[#1A1A18] focus:outline-none focus:border-primary shadow-inner"
                />
              </div>
            </main>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
