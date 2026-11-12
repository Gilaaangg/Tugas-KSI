import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getContributionDetail, updateContribution } from '../../api/contributions.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';

export default function ContributionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadDetail();
  }, [id]);

  const loadDetail = () => {
    setLoading(true);
    getContributionDetail(id)
      .then((res) => {
        setData(res?.data);
        setEditForm(res?.data);
      })
      .catch(() => {
        addToast('Gagal memuat detail kontribusi', 'error');
        navigate('/kontribusi-saya');
      })
      .finally(() => setLoading(false));
  };

  const getStatusLabel = (status) => {
    const map = {
      DRAFT: 'Draf',
      SUBMITTED: 'Terkirim / Menunggu Tinjauan',
      UNDER_REVIEW: 'Sedang Ditinjau Kurator',
      REVISION: 'Butuh Revisi',
      APPROVED: 'Disetujui & Dipublikasikan',
      REJECTED: 'Ditolak',
    };
    return map[status] || status;
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleResubmit = async () => {
    if (!editForm.title?.trim() || !editForm.content?.trim()) {
      addToast('Judul dan isi cerita tidak boleh kosong', 'warning');
      return;
    }
    try {
      setSubmitting(true);
      await updateContribution(id, { ...editForm, status: 'SUBMITTED' });
      addToast('Revisi berhasil dikirim ulang', 'success');
      setIsEditing(false);
      loadDetail();
    } catch (err) {
      addToast('Gagal mengirim ulang revisi', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-16 px-6 lg:px-8 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-12 w-3/4 mb-8" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  const canEdit = data.status === 'DRAFT' || data.status === 'REVISION';

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <section className="bg-gradient-to-b from-[#F7F2EB] to-[#FDFBF7] border-b border-stone-200/60 pb-8 pt-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Link
            to="/kontribusi-saya"
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-amber-900 font-sans text-xs uppercase tracking-wider font-semibold mb-6 transition"
          >
            ← Kembali ke Daftar
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant={data.status}>{getStatusLabel(data.status)}</Badge>
            <span className="font-mono text-stone-400 text-xs uppercase tracking-wider">
              ID: {data.id?.split('-')[0]}
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-stone-900 font-bold tracking-tight mb-4 leading-tight">
            {data.title || 'Draf Tanpa Judul'}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-sans text-stone-600">
            <span className="flex items-center gap-1.5">
              <strong className="text-stone-800">Kategori:</strong> {data.category || '-'}
            </span>
            <span className="flex items-center gap-1.5">
              <strong className="text-stone-800">Wilayah:</strong> {data.region || '-'}
            </span>
            <span className="flex items-center gap-1.5">
              <strong className="text-stone-800">Terakhir Diperbarui:</strong>{' '}
              {new Date(data.updatedAt).toLocaleDateString('id-ID')}
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-10">
        {/* Alerts for Revision / Rejection / Approval */}
        {data.status === 'REVISION' && data.adminNotes && (
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-5 mb-8 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-amber-800 text-xl mt-0.5">⚠️</span>
              <div>
                <h4 className="font-sans text-sm font-bold text-amber-900 mb-1 uppercase tracking-wider">
                  Catatan Revisi dari Kurator
                </h4>
                <p className="font-sans text-amber-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {data.adminNotes}
                </p>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-3 px-4 py-2 bg-amber-900 text-amber-50 rounded text-xs font-semibold hover:bg-amber-950 transition"
                  >
                    Perbaiki dan Kirim Ulang
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {data.status === 'REJECTED' && data.rejectionReason && (
          <div className="bg-rose-50 border border-rose-200/60 rounded-xl p-5 mb-8 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-rose-800 text-xl mt-0.5">❌</span>
              <div>
                <h4 className="font-sans text-sm font-bold text-rose-900 mb-1 uppercase tracking-wider">
                  Alasan Penolakan
                </h4>
                <p className="font-sans text-rose-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {data.rejectionReason}
                </p>
              </div>
            </div>
          </div>
        )}

        {data.status === 'APPROVED' && data.publishedContentId && (
          <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-5 mb-8 shadow-sm flex items-center justify-between gap-4">
            <div>
              <h4 className="font-sans text-sm font-bold text-emerald-900 mb-1">
                Selamat! Cerita Anda telah dipublikasikan
              </h4>
              <p className="font-sans text-emerald-800 text-sm">
                Cerita ini kini menjadi bagian dari koleksi publik JEJAK.
              </p>
            </div>
            <Link
              to={`/konten/${data.publishedContent?.slug || data.publishedContentId}`}
              className="px-4 py-2 bg-emerald-800 text-emerald-50 rounded text-xs font-semibold hover:bg-emerald-900 transition shrink-0 whitespace-nowrap"
            >
              Lihat Publikasi →
            </Link>
          </div>
        )}

        {/* Content Body */}
        <div className="bg-white border border-stone-200/80 rounded-xl shadow-sm p-6 md:p-10">
          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-2 block">Judul</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title || ''}
                  onChange={handleEditChange}
                  className="form-input w-full p-3 rounded-lg border border-stone-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-2 block">Periode</label>
                  <input
                    type="text"
                    name="period"
                    value={editForm.period || ''}
                    onChange={handleEditChange}
                    className="form-input w-full p-3 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-2 block">Lokasi</label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location || ''}
                    onChange={handleEditChange}
                    className="form-input w-full p-3 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-2 block">Isi Cerita</label>
                <textarea
                  name="content"
                  value={editForm.content || ''}
                  onChange={handleEditChange}
                  rows={12}
                  className="form-textarea w-full p-4 rounded-lg border border-stone-300 text-sm leading-relaxed"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Batal</Button>
                <Button variant="primary" onClick={handleResubmit} isLoading={submitting}>Simpan & Kirim</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {(data.period || data.location) && (
                <div className="flex flex-wrap gap-x-8 gap-y-4 pb-6 border-b border-stone-100">
                  {data.period && (
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block mb-1">Periode Waktu</span>
                      <span className="font-sans text-stone-800 font-medium">{data.period}</span>
                    </div>
                  )}
                  {data.location && (
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block mb-1">Titik Lokasi</span>
                      <span className="font-sans text-stone-800 font-medium">{data.location}</span>
                    </div>
                  )}
                </div>
              )}

              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block mb-3">Narasi Selengkapnya</span>
                <div className="font-serif text-stone-800 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                  {data.content || <span className="italic text-stone-400">Belum ada isi cerita.</span>}
                </div>
              </div>

              <div className="bg-[#F7F2EB] rounded-lg p-5 border border-stone-200/60 mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Narasumber</span>
                  <span className="font-sans text-sm text-stone-800">{data.interviewee || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Referensi / Literatur</span>
                  <span className="font-sans text-sm text-stone-800">{data.sourceRef || '-'}</span>
                </div>
                {data.attachment && (
                  <div className="sm:col-span-2 pt-4 border-t border-stone-200/50">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block mb-2">Lampiran Dokumen</span>
                    <a href={data.attachment} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-amber-800 hover:underline font-medium">
                      📎 Buka Berkas Lampiran
                    </a>
                  </div>
                )}
              </div>
              
              {canEdit && !isEditing && data.status !== 'REVISION' && (
                <div className="pt-6 flex justify-end">
                  <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Draf</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
