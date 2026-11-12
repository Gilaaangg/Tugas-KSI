import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { createContribution } from '../../api/contributions.js';
import { getCategories } from '../../api/categories.js';
import { uploadFile } from '../../api/uploads.js';
import { Button } from '../../components/ui/Button.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';

const REGIONS = [
  'Bandar Lampung', 'Lampung Selatan', 'Lampung Tengah', 'Lampung Utara',
  'Lampung Barat', 'Lampung Timur', 'Tanggamus', 'Tulang Bawang',
  'Pesawaran', 'Pringsewu', 'Mesuji', 'Way Kanan', 'Tulang Bawang Barat',
  'Pesisir Barat', 'Metro',
];

const INITIAL_FORM = {
  title: '',
  category: '',
  region: '',
  period: '',
  location: '',
  content: '',
  interviewee: '',
  sourceRef: '',
  attachment: '',
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
};

export default function ShareStory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    getCategories()
      .then((res) => setCategories(res?.data || []))
      .catch(() => addToast('Gagal memuat kategori', 'error'))
      .finally(() => setLoadingCats(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      addToast('Ukuran file maksimal 10MB', 'error');
      return;
    }

    try {
      setUploadProgress('uploading');
      setFileName(file.name);
      const res = await uploadFile(file);
      setForm((prev) => ({ ...prev, attachment: res?.data?.url || '' }));
      setUploadProgress('done');
      addToast('File berhasil diunggah', 'success');
    } catch {
      setUploadProgress(null);
      setFileName('');
      addToast('Gagal mengunggah file', 'error');
    }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Judul wajib diisi';
    if (form.title.trim().length > 0 && form.title.trim().length < 5) e.title = 'Judul minimal 5 karakter';
    if (!form.category) e.category = 'Pilih kategori';
    if (!form.region) e.region = 'Pilih wilayah';
    if (!form.content.trim()) e.content = 'Narasi wajib diisi';
    if (form.content.trim().length > 0 && form.content.trim().length < 50)
      e.content = 'Narasi minimal 50 karakter';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (status) => {
    if (status === 'SUBMITTED' && !validate()) {
      addToast('Mohon lengkapi data yang diperlukan', 'warning');
      return;
    }
    try {
      setSubmitting(true);
      await createContribution({ ...form, status });
      addToast(
        status === 'DRAFT'
          ? 'Draf berhasil disimpan'
          : 'Kontribusi berhasil dikirim untuk tinjauan kurasi',
        'success'
      );
      navigate('/kontribusi-saya');
    } catch (err) {
      addToast(err?.response?.data?.message || 'Gagal menyimpan kontribusi', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#F7F2EB] to-[#FDFBF7] border-b border-stone-200/60">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 md:py-16">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-amber-900 font-bold block mb-3">
              PARTISIPASI MASYARAKAT • KONTRIBUSI CERITA
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-stone-900 font-bold tracking-tight mb-3">
              Bagikan Cerita Anda
            </h1>
            <p className="font-sans text-stone-600 text-sm md:text-base leading-relaxed max-w-2xl">
              Bantu lestarikan warisan budaya Lampung dengan berbagi kisah, catatan sejarah, atau
              dokumentasi lokal yang Anda miliki. Setiap kontribusi akan melalui proses kurasi
              oleh tim museum digital JEJAK.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <motion.div
          initial="hidden"
          animate="visible"
          className="bg-white border border-stone-200/80 rounded-xl shadow-sm overflow-hidden"
        >
          {/* Form body */}
          <div className="p-6 md:p-10 space-y-8">
            {/* Title */}
            <motion.div variants={fadeUp} custom={1}>
              <label className="form-label block font-sans text-xs uppercase tracking-wider text-stone-600 font-semibold mb-2">
                Judul Cerita <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Contoh: Tradisi Sekura di Lampung Barat"
                className={`form-input w-full px-4 py-3 rounded-lg border font-sans text-sm text-stone-900 bg-[#FDFBF7] placeholder:text-stone-400 focus:ring-2 focus:ring-amber-800/30 focus:border-amber-900 transition ${
                  errors.title ? 'border-rose-400' : 'border-stone-300'
                }`}
              />
              {errors.title && (
                <p className="text-rose-600 text-xs mt-1 font-sans">{errors.title}</p>
              )}
            </motion.div>

            {/* Category + Region row */}
            <motion.div variants={fadeUp} custom={2} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label block font-sans text-xs uppercase tracking-wider text-stone-600 font-semibold mb-2">
                  Kategori <span className="text-rose-600">*</span>
                </label>
                {loadingCats ? (
                  <Skeleton className="h-11 w-full rounded-lg" />
                ) : (
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={`form-input w-full px-4 py-3 rounded-lg border font-sans text-sm text-stone-900 bg-[#FDFBF7] focus:ring-2 focus:ring-amber-800/30 focus:border-amber-900 transition ${
                      errors.category ? 'border-rose-400' : 'border-stone-300'
                    }`}
                  >
                    <option value="">Pilih kategori...</option>
                    {categories.map((c) => (
                      <option key={c.id || c.slug || c.name} value={c.slug || c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.category && (
                  <p className="text-rose-600 text-xs mt-1 font-sans">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="form-label block font-sans text-xs uppercase tracking-wider text-stone-600 font-semibold mb-2">
                  Wilayah <span className="text-rose-600">*</span>
                </label>
                <select
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  className={`form-input w-full px-4 py-3 rounded-lg border font-sans text-sm text-stone-900 bg-[#FDFBF7] focus:ring-2 focus:ring-amber-800/30 focus:border-amber-900 transition ${
                    errors.region ? 'border-rose-400' : 'border-stone-300'
                  }`}
                >
                  <option value="">Pilih wilayah...</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-rose-600 text-xs mt-1 font-sans">{errors.region}</p>
                )}
              </div>
            </motion.div>

            {/* Period + Location row */}
            <motion.div variants={fadeUp} custom={3} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label block font-sans text-xs uppercase tracking-wider text-stone-600 font-semibold mb-2">
                  Periode / Era
                </label>
                <input
                  type="text"
                  name="period"
                  value={form.period}
                  onChange={handleChange}
                  placeholder="Contoh: Abad ke-19, 1942-1945"
                  className="form-input w-full px-4 py-3 rounded-lg border border-stone-300 font-sans text-sm text-stone-900 bg-[#FDFBF7] placeholder:text-stone-400 focus:ring-2 focus:ring-amber-800/30 focus:border-amber-900 transition"
                />
              </div>
              <div>
                <label className="form-label block font-sans text-xs uppercase tracking-wider text-stone-600 font-semibold mb-2">
                  Lokasi Spesifik
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Contoh: Desa Way Urang, Kalianda"
                  className="form-input w-full px-4 py-3 rounded-lg border border-stone-300 font-sans text-sm text-stone-900 bg-[#FDFBF7] placeholder:text-stone-400 focus:ring-2 focus:ring-amber-800/30 focus:border-amber-900 transition"
                />
              </div>
            </motion.div>

            {/* Content textarea */}
            <motion.div variants={fadeUp} custom={4}>
              <label className="form-label block font-sans text-xs uppercase tracking-wider text-stone-600 font-semibold mb-2">
                Narasi / Isi Cerita <span className="text-rose-600">*</span>
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={10}
                placeholder="Tuliskan kisah, catatan sejarah, atau deskripsi budaya yang ingin Anda kontribusikan. Semakin lengkap dan rinci, semakin baik untuk proses kurasi..."
                className={`form-textarea w-full px-4 py-3 rounded-lg border font-sans text-sm text-stone-900 bg-[#FDFBF7] placeholder:text-stone-400 focus:ring-2 focus:ring-amber-800/30 focus:border-amber-900 transition leading-relaxed resize-y ${
                  errors.content ? 'border-rose-400' : 'border-stone-300'
                }`}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.content ? (
                  <p className="text-rose-600 text-xs font-sans">{errors.content}</p>
                ) : (
                  <span />
                )}
                <span className="text-stone-400 text-xs font-sans">
                  {form.content.length} karakter
                </span>
              </div>
            </motion.div>

            {/* Interviewee + Source reference */}
            <motion.div variants={fadeUp} custom={5} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label block font-sans text-xs uppercase tracking-wider text-stone-600 font-semibold mb-2">
                  Narasumber / Pewaris Cerita
                </label>
                <input
                  type="text"
                  name="interviewee"
                  value={form.interviewee}
                  onChange={handleChange}
                  placeholder="Nama narasumber, jika ada"
                  className="form-input w-full px-4 py-3 rounded-lg border border-stone-300 font-sans text-sm text-stone-900 bg-[#FDFBF7] placeholder:text-stone-400 focus:ring-2 focus:ring-amber-800/30 focus:border-amber-900 transition"
                />
              </div>
              <div>
                <label className="form-label block font-sans text-xs uppercase tracking-wider text-stone-600 font-semibold mb-2">
                  Sumber Referensi
                </label>
                <input
                  type="text"
                  name="sourceRef"
                  value={form.sourceRef}
                  onChange={handleChange}
                  placeholder="Buku, arsip, dokumen pendukung"
                  className="form-input w-full px-4 py-3 rounded-lg border border-stone-300 font-sans text-sm text-stone-900 bg-[#FDFBF7] placeholder:text-stone-400 focus:ring-2 focus:ring-amber-800/30 focus:border-amber-900 transition"
                />
              </div>
            </motion.div>

            {/* File upload */}
            <motion.div variants={fadeUp} custom={6}>
              <label className="form-label block font-sans text-xs uppercase tracking-wider text-stone-600 font-semibold mb-2">
                Lampiran (Foto / Dokumen)
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-amber-900/50 rounded-lg p-8 text-center cursor-pointer transition bg-[#FDFBF7] group"
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {uploadProgress === 'uploading' ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="animate-spin h-8 w-8 text-amber-900" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span className="text-stone-600 text-sm font-sans">Mengunggah {fileName}...</span>
                  </div>
                ) : uploadProgress === 'done' ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-emerald-700 text-2xl">✓</span>
                    <span className="text-stone-700 text-sm font-sans font-medium">{fileName}</span>
                    <span className="text-stone-400 text-xs">Klik untuk mengganti file</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-stone-400 text-3xl group-hover:text-amber-900 transition">📎</span>
                    <span className="text-stone-600 text-sm font-sans">
                      Klik atau seret file ke sini
                    </span>
                    <span className="text-stone-400 text-xs font-sans">
                      JPG, PNG, PDF, DOC — Maks 10MB
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Actions footer */}
          <motion.div
            variants={fadeUp}
            custom={7}
            className="px-6 md:px-10 py-5 bg-stone-50/80 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p className="text-stone-500 text-xs font-sans leading-relaxed">
              Kontribusi yang dikirim akan ditinjau oleh tim kurasi sebelum dipublikasikan.
              Simpan sebagai draf untuk melanjutkan nanti.
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                onClick={() => handleSubmit('DRAFT')}
                isLoading={submitting}
                disabled={submitting}
              >
                Simpan Draf
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSubmit('SUBMITTED')}
                isLoading={submitting}
                disabled={submitting}
              >
                Kirim untuk Kurasi
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
