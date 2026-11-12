import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getAdminStats, 
  getAdminQueue, 
  getAdminUsers, 
  reviewContribution, 
  updateUserRole,
  getAdminContents,
  createAdminContent,
  updateAdminContent,
  deleteAdminContent,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  getAdminTimelines,
  createAdminTimeline,
  updateAdminTimeline,
  deleteAdminTimeline
} from '../../api/admin.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';

export default function AdminDashboard() {
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL: /admin/kurasi -> 'kurasi', /admin/konten -> 'konten', etc.
  const pathParts = location.pathname.split('/').filter(Boolean);
  const subRoute = pathParts[1] || 'overview';
  const activeTab = ['overview', 'kurasi', 'konten', 'kategori', 'timeline', 'users'].includes(subRoute)
    ? subRoute
    : 'overview';

  const switchTab = (tabId) => {
    if (tabId === 'overview') {
      navigate('/admin');
    } else {
      navigate(`/admin/${tabId}`);
    }
  };

  // 1. Stats State
  const [stats, setStats] = useState(null);

  // 2. Queue State
  const [queue, setQueue] = useState([]);
  const [queueMeta, setQueueMeta] = useState({});
  const [queuePage, setQueuePage] = useState(1);
  const [queueStatus, setQueueStatus] = useState('SUBMITTED');
  const [loadingQueue, setLoadingQueue] = useState(false);

  // Review Modal State
  const [selectedQueueItem, setSelectedQueueItem] = useState(null);
  const [reviewForm, setReviewForm] = useState({ status: '', adminNotes: '', rejectionReason: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // 3. Contents Management State
  const [contents, setContents] = useState([]);
  const [contentMeta, setContentMeta] = useState({ totalPages: 1, total: 0 });
  const [contentPage, setContentPage] = useState(1);
  const [contentTypeFilter, setContentTypeFilter] = useState('');
  const [contentStatusFilter, setContentStatusFilter] = useState('');
  const [contentSearch, setContentSearch] = useState('');
  const [loadingContents, setLoadingContents] = useState(false);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [savingContent, setSavingContent] = useState(false);

  const initialContentForm = {
    title: '',
    subtitle: '',
    type: 'sejarah',
    categoryId: '',
    period: '',
    region: 'Bandar Lampung',
    location: '',
    image: '',
    description: '',
    content: '',
    references: '',
    status: 'PUBLISHED',
  };
  const [contentForm, setContentForm] = useState(initialContentForm);

  // 4. Categories State
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  // 5. Timeline Events State
  const [timelines, setTimelines] = useState([]);
  const [loadingTimelines, setLoadingTimelines] = useState(false);
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState(null);
  const [timelineForm, setTimelineForm] = useState({
    year: '',
    epoch: '',
    title: '',
    subtitle: '',
    location: '',
    category: '',
    summary: '',
    details: '',
    keyFigure: '',
    image: '',
    order: 0,
  });

  // 6. Users State
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Initial stats load
  useEffect(() => {
    loadStats();
    loadCategories();
  }, []);

  // Trigger loads based on active tab
  useEffect(() => {
    if (activeTab === 'kurasi') loadQueue();
    if (activeTab === 'konten') loadContents();
    if (activeTab === 'kategori') loadCategories();
    if (activeTab === 'timeline') loadTimelines();
    if (activeTab === 'users') loadUsers();
  }, [activeTab, queuePage, queueStatus, contentPage, contentTypeFilter, contentStatusFilter]);

  // Loaders
  const loadStats = () => {
    getAdminStats()
      .then((res) => setStats(res?.data))
      .catch(() => addToast('Gagal memuat statistik kuratorial', 'error'));
  };

  const loadQueue = () => {
    setLoadingQueue(true);
    getAdminQueue({ page: queuePage, limit: 10, status: queueStatus })
      .then((res) => {
        setQueue(res?.data || []);
        setQueueMeta(res?.meta || { totalPages: 1 });
      })
      .catch(() => setQueue([]))
      .finally(() => setLoadingQueue(false));
  };

  const loadContents = () => {
    setLoadingContents(true);
    getAdminContents({
      page: contentPage,
      limit: 10,
      type: contentTypeFilter || undefined,
      status: contentStatusFilter || undefined,
      search: contentSearch || undefined,
    })
      .then((res) => {
        setContents(res?.data || []);
        setContentMeta(res?.meta || { totalPages: 1, total: 0 });
      })
      .catch(() => setContents([]))
      .finally(() => setLoadingContents(false));
  };

  const loadCategories = () => {
    setLoadingCategories(true);
    getAdminCategories()
      .then((res) => setCategories(res?.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));
  };

  const loadTimelines = () => {
    setLoadingTimelines(true);
    getAdminTimelines()
      .then((res) => setTimelines(res?.data || []))
      .catch(() => setTimelines([]))
      .finally(() => setLoadingTimelines(false));
  };

  const loadUsers = () => {
    setLoadingUsers(true);
    getAdminUsers()
      .then((res) => setUsers(res?.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoadingUsers(false));
  };

  // Queue Review Handlers
  const openReviewModal = (item) => {
    setSelectedQueueItem(item);
    setReviewForm({
      status: item.status,
      adminNotes: item.adminNotes || '',
      rejectionReason: item.rejectionReason || '',
    });
  };

  const submitReview = async () => {
    if (reviewForm.status === 'REVISION' && !reviewForm.adminNotes.trim()) {
      addToast('Catatan revisi wajib diisi agar kontributor tahu perbaikan yang dibutuhkan', 'warning');
      return;
    }
    if (reviewForm.status === 'REJECTED' && !reviewForm.rejectionReason.trim()) {
      addToast('Alasan penolakan wajib diisi', 'warning');
      return;
    }

    try {
      setSubmittingReview(true);
      await reviewContribution(selectedQueueItem.id, reviewForm);
      addToast('Keputusan kuratorial berhasil disimpan', 'success');
      setSelectedQueueItem(null);
      loadQueue();
      loadStats();
    } catch (err) {
      addToast('Gagal memproses kurasi kontribusi', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Content CRUD Handlers
  const openCreateContentModal = () => {
    setEditingContent(null);
    setContentForm({
      ...initialContentForm,
      categoryId: categories[0]?.id || '',
    });
    setContentModalOpen(true);
  };

  const openEditContentModal = (item) => {
    setEditingContent(item);
    let refsStr = '';
    if (item.references) {
      if (typeof item.references === 'string') {
        refsStr = item.references;
      } else {
        refsStr = JSON.stringify(item.references, null, 2);
      }
    }
    setContentForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      type: item.type || 'sejarah',
      categoryId: item.categoryId || (categories[0]?.id || ''),
      period: item.period || '',
      region: item.region || 'Bandar Lampung',
      location: item.location || '',
      image: item.image || '',
      description: item.description || '',
      content: item.content || '',
      references: refsStr,
      status: item.status || 'PUBLISHED',
    });
    setContentModalOpen(true);
  };

  const handleSaveContent = async (e) => {
    e.preventDefault();
    if (!contentForm.title.trim() || !contentForm.content.trim()) {
      addToast('Judul dan isi konten monograf wajib diisi', 'warning');
      return;
    }

    try {
      setSavingContent(true);
      const payload = {
        title: contentForm.title.trim(),
        subtitle: contentForm.subtitle.trim() || null,
        type: contentForm.type,
        categoryId: contentForm.categoryId || null,
        period: contentForm.period.trim() || null,
        region: contentForm.region.trim() || null,
        location: contentForm.location.trim() || null,
        image: contentForm.image.trim() || null,
        description: contentForm.description.trim() || contentForm.content.slice(0, 200),
        content: contentForm.content.trim(),
        references: contentForm.references.trim() || null,
        status: contentForm.status,
      };

      if (editingContent) {
        await updateAdminContent(editingContent.id, payload);
        addToast('Konten museum berhasil diperbarui', 'success');
      } else {
        await createAdminContent(payload);
        addToast('Konten monograf baru berhasil ditambahkan', 'success');
      }
      setContentModalOpen(false);
      loadContents();
      loadStats();
    } catch (err) {
      addToast(err.message || 'Gagal menyimpan konten', 'error');
    } finally {
      setSavingContent(false);
    }
  };

  const handleDeleteContent = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus konten "${title}"?`)) return;
    try {
      await deleteAdminContent(id);
      addToast('Konten berhasil dihapus', 'info');
      loadContents();
      loadStats();
    } catch (err) {
      addToast('Gagal menghapus konten', 'error');
    }
  };

  // Category CRUD Handlers
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      addToast('Nama kategori wajib diisi', 'warning');
      return;
    }
    try {
      if (editingCategory) {
        await updateAdminCategory(editingCategory.id, categoryForm);
        addToast('Kategori berhasil diperbarui', 'success');
      } else {
        await createAdminCategory(categoryForm);
        addToast('Kategori baru berhasil ditambahkan', 'success');
      }
      setCategoryModalOpen(false);
      loadCategories();
    } catch (err) {
      addToast(err.message || 'Gagal menyimpan kategori', 'error');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Hapus kategori "${name}"? Konten di dalamnya mungkin terpengaruh.`)) return;
    try {
      await deleteAdminCategory(id);
      addToast('Kategori berhasil dihapus', 'info');
      loadCategories();
    } catch (err) {
      addToast(err.message || 'Gagal menghapus kategori', 'error');
    }
  };

  // Timeline CRUD Handlers
  const handleSaveTimeline = async (e) => {
    e.preventDefault();
    if (!timelineForm.year.trim() || !timelineForm.title.trim() || !timelineForm.summary.trim()) {
      addToast('Tahun, judul, dan ringkasan wajib diisi', 'warning');
      return;
    }
    try {
      if (editingTimeline) {
        await updateAdminTimeline(editingTimeline.id, timelineForm);
        addToast('Peristiwa garis waktu diperbarui', 'success');
      } else {
        await createAdminTimeline(timelineForm);
        addToast('Peristiwa baru ditambahkan ke garis waktu', 'success');
      }
      setTimelineModalOpen(false);
      loadTimelines();
    } catch (err) {
      addToast(err.message || 'Gagal menyimpan peristiwa', 'error');
    }
  };

  const handleDeleteTimeline = async (id, title) => {
    if (!window.confirm(`Hapus peristiwa "${title}" dari garis waktu?`)) return;
    try {
      await deleteAdminTimeline(id);
      addToast('Peristiwa berhasil dihapus', 'info');
      loadTimelines();
    } catch (err) {
      addToast('Gagal menghapus peristiwa', 'error');
    }
  };

  // Role Change
  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      addToast('Peran pengguna diperbarui', 'success');
      loadUsers();
    } catch {
      addToast('Gagal memperbarui peran pengguna', 'error');
    }
  };

  const navTabs = [
    { id: 'overview', label: '📊 Tinjauan Utama' },
    { id: 'kurasi', label: `📥 Antrean Kurasi ${stats?.pendingReview ? `(${stats.pendingReview})` : ''}` },
    { id: 'konten', label: '📖 Kelola Konten & Artikel' },
    { id: 'kategori', label: '🏷️ Kelola Kategori' },
    { id: 'timeline', label: '⏳ Garis Waktu' },
    { id: 'users', label: '👥 Manajemen Pengguna' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Admin Header */}
      <section className="bg-[#1A1A18] text-[#FDFBF7] pt-10 pb-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#F2BE68] font-bold block mb-1">
                PANEL KURATORIAL & ADMINISTRASI JEJAK
              </span>
              <h1 className="font-serif text-3xl font-bold tracking-tight">
                Dashboard Museum Digital
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="px-3 py-1.5 rounded-lg border border-stone-700 text-xs font-sans text-stone-300 hover:text-white hover:border-stone-500 transition"
              >
                ← Kembali ke Museum
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-white/10">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`px-4 py-2.5 whitespace-nowrap text-xs md:text-sm font-sans font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#F2BE68] text-[#F2BE68] font-bold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <h2 className="font-serif text-2xl text-stone-900 font-bold mb-4">Statistik Kuratorial</h2>
              
              {!stats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm text-center">
                    <span className="text-3xl font-serif font-bold text-stone-900 block mb-1">{stats.totalContents || 0}</span>
                    <span className="text-xs font-sans uppercase tracking-wider text-stone-500 font-bold">Total Monograf</span>
                  </div>
                  <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm text-center">
                    <span className="text-3xl font-serif font-bold text-amber-900 block mb-1">{stats.pendingReview || 0}</span>
                    <span className="text-xs font-sans uppercase tracking-wider text-amber-700 font-bold">Menunggu Kurasi</span>
                  </div>
                  <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm text-center">
                    <span className="text-3xl font-serif font-bold text-emerald-700 block mb-1">{stats.approvedCount || 0}</span>
                    <span className="text-xs font-sans uppercase tracking-wider text-stone-500 font-bold">Kontribusi Diterima</span>
                  </div>
                  <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm text-center">
                    <span className="text-3xl font-serif font-bold text-stone-900 block mb-1">{stats.totalUsers || 0}</span>
                    <span className="text-xs font-sans uppercase tracking-wider text-stone-500 font-bold">Pengguna Terdaftar</span>
                  </div>
                </div>
              )}

              {/* Sebaran Kategori / Jenis */}
              <div className="pt-6 border-t border-stone-200">
                <h3 className="font-serif text-xl text-stone-900 font-bold mb-4">Sebaran Koleksi Berdasarkan Jenis</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { key: 'Sejarah', icon: '📜' },
                    { key: 'Budaya', icon: '🎭' },
                    { key: 'Artefak', icon: '🏺' },
                    { key: 'Tokoh', icon: '👤' },
                    { key: 'Tempat', icon: '🗺️' },
                    { key: 'Artikel', icon: '📰' },
                  ].map((cat) => (
                    <div key={cat.key} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center text-center">
                      <span className="text-2xl mb-1">{cat.icon}</span>
                      <span className="font-sans text-xs font-semibold text-stone-600 uppercase">{cat.key}</span>
                      <span className="font-serif text-2xl font-bold text-amber-900 mt-1">
                        {stats ? stats[`total${cat.key}`] || 0 : '-'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-6 border-t border-stone-200">
                <h3 className="font-serif text-xl text-stone-900 font-bold mb-4">Aksi Cepat Kurator</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => switchTab('kurasi')}
                    className="p-5 rounded-xl border border-stone-200 bg-white hover:border-amber-900/40 text-left transition shadow-sm group"
                  >
                    <span className="text-2xl block mb-2">📥</span>
                    <h4 className="font-serif font-bold text-stone-900 group-hover:text-amber-900">Periksa Antrean Kontribusi</h4>
                    <p className="text-xs text-stone-500 mt-1">Tinjau, setujui, atau minta revisi cerita dari warga masyarakat Lampung.</p>
                  </button>
                  <button
                    onClick={() => switchTab('konten')}
                    className="p-5 rounded-xl border border-stone-200 bg-white hover:border-amber-900/40 text-left transition shadow-sm group"
                  >
                    <span className="text-2xl block mb-2">✍️</span>
                    <h4 className="font-serif font-bold text-stone-900 group-hover:text-amber-900">Tulis Monograf / Artikel Baru</h4>
                    <p className="text-xs text-stone-500 mt-1">Publikasikan penelitian sejarah, artefak, tokoh, atau esai budaya ke publik.</p>
                  </button>
                  <button
                    onClick={() => switchTab('timeline')}
                    className="p-5 rounded-xl border border-stone-200 bg-white hover:border-amber-900/40 text-left transition shadow-sm group"
                  >
                    <span className="text-2xl block mb-2">⏳</span>
                    <h4 className="font-serif font-bold text-stone-900 group-hover:text-amber-900">Kelola Garis Waktu Lampung</h4>
                    <p className="text-xs text-stone-500 mt-1">Perbarui kronologi peristiwa dan babak peradaban penting.</p>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: ANTREAN KURASI (QUEUE) */}
          {activeTab === 'kurasi' && (
            <motion.div
              key="kurasi"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-serif text-2xl text-stone-900 font-bold">Antrean Verifikasi Kontribusi</h2>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    Kurasi setiap naskah dan lampiran yang diajukan pengunjung sebelum dipublikasikan ke katalog resmi.
                  </p>
                </div>
                <select
                  value={queueStatus}
                  onChange={(e) => { setQueueStatus(e.target.value); setQueuePage(1); }}
                  className="p-2.5 text-xs font-semibold border border-stone-300 rounded-lg bg-white shadow-sm"
                >
                  <option value="">Semua Status</option>
                  <option value="SUBMITTED">Menunggu Kurasi (Terkirim)</option>
                  <option value="UNDER_REVIEW">Sedang Ditinjau</option>
                  <option value="REVISION">Butuh Revisi</option>
                  <option value="APPROVED">Disetujui (Terbit)</option>
                  <option value="REJECTED">Ditolak</option>
                </select>
              </div>

              {loadingQueue ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
                </div>
              ) : queue.length === 0 ? (
                <EmptyState title="Antrean Kosong" message="Tidak ada kontribusi warga dengan status ini saat ini." />
              ) : (
                <div className="space-y-4">
                  {queue.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-amber-900/40 transition-colors shadow-sm"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant={item.status}>{item.status}</Badge>
                          <span className="text-xs font-mono text-stone-400">ID: {item.id.split('-')[0]}</span>
                          <span className="text-xs font-sans text-stone-500">• Oleh: {item.user?.name || 'Anonim'}</span>
                          {item.urgencyScore && (
                            <span className="text-[10px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                              Prioritas: {item.urgencyScore}
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight mb-1">{item.title}</h3>
                        <p className="font-sans text-xs text-stone-500 line-clamp-1">
                          Kategori: {item.category} | Wilayah: {item.region} | Periode: {item.period || '-'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => openReviewModal(item)}>
                        Tinjau &amp; Kurasi
                      </Button>
                    </div>
                  ))}

                  <Pagination
                    currentPage={queuePage}
                    totalPages={queueMeta.totalPages || 1}
                    onPageChange={setQueuePage}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: KELOLA KONTEN & ARTIKEL (CRUD FR-24) */}
          {activeTab === 'konten' && (
            <motion.div
              key="konten"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-serif text-2xl text-stone-900 font-bold">Kelola Monograf &amp; Artikel Museum</h2>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    Buat, ubah, dan kelola seluruh konten sejarah, budaya, artefak, tokoh, tempat bersejarah, dan artikel editorial.
                  </p>
                </div>
                <Button variant="primary" onClick={openCreateContentModal} className="bg-amber-900 text-amber-50">
                  + Tambah Konten Baru
                </Button>
              </div>

              {/* Filters & Search */}
              <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm mb-6 flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Cari judul konten..."
                  value={contentSearch}
                  onChange={(e) => setContentSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { setContentPage(1); loadContents(); } }}
                  className="px-3 py-2 text-xs border border-stone-300 rounded-lg flex-1 min-w-[180px]"
                />
                <select
                  value={contentTypeFilter}
                  onChange={(e) => { setContentTypeFilter(e.target.value); setContentPage(1); }}
                  className="px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option value="">Semua Jenis (Sejarah, Artikel, Artefak...)</option>
                  <option value="sejarah">Sejarah</option>
                  <option value="budaya">Budaya</option>
                  <option value="artefak">Artefak</option>
                  <option value="tokoh">Tokoh</option>
                  <option value="tempat">Tempat Bersejarah</option>
                  <option value="artikel">Artikel &amp; Riset</option>
                </select>
                <select
                  value={contentStatusFilter}
                  onChange={(e) => { setContentStatusFilter(e.target.value); setContentPage(1); }}
                  className="px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option value="">Semua Status</option>
                  <option value="PUBLISHED">Terbit (PUBLISHED)</option>
                  <option value="DRAFT">Draf (DRAFT)</option>
                </select>
                <Button variant="outline" size="sm" onClick={() => { setContentPage(1); loadContents(); }}>
                  Cari
                </Button>
              </div>

              {/* Contents Table */}
              {loadingContents ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
                </div>
              ) : contents.length === 0 ? (
                <EmptyState title="Tidak Ada Konten" message="Tidak ditemukan monograf yang sesuai kriteria pencarian." />
              ) : (
                <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-stone-50 text-stone-600 uppercase font-bold border-b border-stone-200">
                        <tr>
                          <th className="px-5 py-3">Monograf</th>
                          <th className="px-4 py-3">Jenis</th>
                          <th className="px-4 py-3">Wilayah &amp; Periode</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {contents.map((item) => (
                          <tr key={item.id} className="hover:bg-stone-50/50">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                {item.image ? (
                                  <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg border border-stone-200 flex-shrink-0" />
                                ) : (
                                  <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">📜</div>
                                )}
                                <div>
                                  <div className="font-serif font-bold text-stone-900 text-sm">{item.title}</div>
                                  <div className="text-stone-400 text-[11px] truncate max-w-sm">{item.subtitle || item.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100/60 text-amber-900 border border-amber-200/60">
                                {item.type}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-stone-600">
                              <div>{item.region || '-'}</div>
                              <div className="text-[11px] text-stone-400">{item.period || '-'}</div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-2">
                              <Link
                                to={`/konten/${item.slug || item.id}`}
                                target="_blank"
                                className="px-2.5 py-1 text-xs text-amber-900 hover:underline"
                              >
                                Lihat
                              </Link>
                              <Button variant="outline" size="sm" onClick={() => openEditContentModal(item)}>
                                Edit
                              </Button>
                              <button
                                onClick={() => handleDeleteContent(item.id, item.title)}
                                className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-800 font-semibold"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 border-t border-stone-200">
                    <Pagination
                      currentPage={contentPage}
                      totalPages={contentMeta.totalPages || 1}
                      onPageChange={setContentPage}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: KELOLA KATEGORI */}
          {activeTab === 'kategori' && (
            <motion.div
              key="kategori"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-serif text-2xl text-stone-900 font-bold">Kelola Kategori Museum</h2>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    Klasifikasi taksonomi untuk mengelompokkan koleksi sejarah dan budaya.
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', description: '' }); setCategoryModalOpen(true); }}
                  className="bg-amber-900 text-amber-50"
                >
                  + Tambah Kategori
                </Button>
              </div>

              {loadingCategories ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((c) => (
                    <div key={c.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-serif font-bold text-base text-stone-900">{c.name}</h4>
                        <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded block my-1 w-max">
                          slug: {c.slug}
                        </span>
                        <p className="text-xs text-stone-500 leading-relaxed">{c.description || 'Tidak ada deskripsi.'}</p>
                        <span className="text-[11px] text-stone-400 mt-2 block">
                          Terkait dengan {c._count?.contents || 0} monograf
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setEditingCategory(c); setCategoryForm({ name: c.name, description: c.description || '' }); setCategoryModalOpen(true); }}
                        >
                          Edit
                        </Button>
                        <button
                          onClick={() => handleDeleteCategory(c.id, c.name)}
                          className="text-xs text-rose-600 hover:text-rose-800 p-1"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 5: KELOLA GARIS WAKTU */}
          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-serif text-2xl text-stone-900 font-bold">Kelola Garis Waktu Lampung</h2>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    Kronologi peristiwa penting dan babak peradaban bersejarah Lampung.
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => {
                    setEditingTimeline(null);
                    setTimelineForm({
                      year: '',
                      epoch: '',
                      title: '',
                      subtitle: '',
                      location: '',
                      category: 'Peradaban',
                      summary: '',
                      details: '',
                      keyFigure: '',
                      image: '',
                      order: timelines.length + 1,
                    });
                    setTimelineModalOpen(true);
                  }}
                  className="bg-amber-900 text-amber-50"
                >
                  + Tambah Peristiwa
                </Button>
              </div>

              {loadingTimelines ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {timelines.map((ev) => (
                    <div key={ev.id} className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="px-3 py-2 bg-amber-900 text-amber-50 rounded-lg text-center font-mono font-bold text-xs min-w-[75px]">
                          {ev.year}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                              {ev.epoch}
                            </span>
                            <span className="text-xs text-stone-400">Urutan: #{ev.order}</span>
                          </div>
                          <h4 className="font-serif font-bold text-base text-stone-900 mt-1">{ev.title}</h4>
                          <p className="text-xs text-stone-500 line-clamp-1">{ev.summary}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingTimeline(ev);
                            setTimelineForm({
                              year: ev.year || '',
                              epoch: ev.epoch || '',
                              title: ev.title || '',
                              subtitle: ev.subtitle || '',
                              location: ev.location || '',
                              category: ev.category || '',
                              summary: ev.summary || '',
                              details: ev.details || '',
                              keyFigure: ev.keyFigure || '',
                              image: ev.image || '',
                              order: ev.order || 0,
                            });
                            setTimelineModalOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <button
                          onClick={() => handleDeleteTimeline(ev.id, ev.title)}
                          className="text-xs text-rose-600 hover:text-rose-800 p-1"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 6: MANAJEMEN PENGGUNA */}
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-6">
                <h2 className="font-serif text-2xl text-stone-900 font-bold">Manajemen Pengguna Museum</h2>
                <p className="text-xs text-stone-500 font-sans mt-0.5">
                  Atur hak akses anggota antara pengunjung biasa (USER) dan dewan kurator (ADMIN).
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-stone-50 text-stone-600 uppercase font-bold border-b border-stone-200">
                      <tr>
                        <th className="px-6 py-4">Nama &amp; Akun</th>
                        <th className="px-6 py-4">Peran Saat Ini</th>
                        <th className="px-6 py-4">Aktivitas</th>
                        <th className="px-6 py-4">Ubah Hak Akses</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {loadingUsers ? (
                        <tr><td colSpan="4" className="p-6 text-center text-stone-500">Memuat data pengguna...</td></tr>
                      ) : users.length === 0 ? (
                        <tr><td colSpan="4" className="p-6 text-center text-stone-500">Belum ada pengguna terdaftar.</td></tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className="hover:bg-stone-50/50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {u.picture ? (
                                  <img src={u.picture} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-amber-900 text-amber-50 flex items-center justify-center font-bold">
                                    {(u.name || u.email || 'U')[0].toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <div className="font-semibold text-stone-900 text-sm">{u.name}</div>
                                  <div className="text-stone-500 text-xs">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                u.role === 'ADMIN' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-100 text-stone-700'
                              }`}>
                                {u.role === 'ADMIN' ? '🛡️ ADMIN (Kurator)' : '👤 USER'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-stone-500 text-xs">
                              {u._count?.contributions || 0} Kontribusi • {u._count?.contents || 0} Monograf
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                className="text-xs p-1.5 border border-stone-300 rounded-lg bg-white"
                              >
                                <option value="USER">User (Biasa)</option>
                                <option value="ADMIN">Admin (Kurator)</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Review Modal (Queue) */}
      {selectedQueueItem && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedQueueItem(null)}
          title="Kurasi Kontribusi Cerita Warga"
          maxWidth="max-w-4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#F7F2EB] p-5 rounded-lg border border-stone-200 h-full max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="mb-4 pb-4 border-b border-stone-200/50">
                <Badge variant={selectedQueueItem.status} className="mb-2">{selectedQueueItem.status}</Badge>
                <h3 className="font-serif text-xl font-bold text-stone-900">{selectedQueueItem.title}</h3>
                <p className="font-sans text-xs text-stone-600 mt-2">
                  Kategori: {selectedQueueItem.category} | Wilayah: {selectedQueueItem.region} <br/>
                  Diajukan oleh: {selectedQueueItem.user?.name || 'Anonim'}
                </p>
              </div>
              <div className="font-serif text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
                {selectedQueueItem.content}
              </div>
              <div className="mt-6 pt-4 border-t border-stone-200/50 space-y-2 text-xs font-sans text-stone-600">
                {selectedQueueItem.period && <p><strong>Periode:</strong> {selectedQueueItem.period}</p>}
                {selectedQueueItem.location && <p><strong>Lokasi:</strong> {selectedQueueItem.location}</p>}
                {selectedQueueItem.sourceRef && <p><strong>Referensi:</strong> {selectedQueueItem.sourceRef}</p>}
                {selectedQueueItem.interviewee && <p><strong>Narasumber:</strong> {selectedQueueItem.interviewee}</p>}
                {selectedQueueItem.attachment && (
                  <p><a href={selectedQueueItem.attachment} target="_blank" rel="noreferrer" className="text-amber-800 font-semibold underline">Buka Lampiran</a></p>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className="font-sans text-xs font-bold text-stone-900 uppercase tracking-wider mb-4">
                Keputusan Kuratorial
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Pilih Status Baru</label>
                  <select
                    value={reviewForm.status}
                    onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans bg-white"
                  >
                    <option value="UNDER_REVIEW">Sedang Ditinjau</option>
                    <option value="REVISION">Butuh Revisi (Kembalikan ke User)</option>
                    <option value="APPROVED">Setujui &amp; Publikasikan ke Katalog Resmi</option>
                    <option value="REJECTED">Tolak Permanen</option>
                  </select>
                </div>

                {reviewForm.status === 'REVISION' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Catatan Perbaikan untuk Kontributor <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={reviewForm.adminNotes}
                      onChange={(e) => setReviewForm({ ...reviewForm, adminNotes: e.target.value })}
                      placeholder="Jelaskan apa yang perlu diperbaiki (contoh: lengkapi tahun kejadian, perbaiki sumber referensi...)"
                      className="w-full p-3 rounded-lg border border-stone-300 text-xs font-sans"
                    />
                  </div>
                )}

                {reviewForm.status === 'REJECTED' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Alasan Penolakan <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={reviewForm.rejectionReason}
                      onChange={(e) => setReviewForm({ ...reviewForm, rejectionReason: e.target.value })}
                      placeholder="Alasan ditolak (contoh: konten duplikat, tidak relevan dengan Lampung...)"
                      className="w-full p-3 rounded-lg border border-stone-300 text-xs font-sans"
                    />
                  </div>
                )}

                {reviewForm.status === 'APPROVED' && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-lg text-xs text-emerald-800 leading-relaxed">
                    ✅ Saat disetujui, kontribusi ini otomatis dipublikasikan ke katalog monograf publik museum dan berstatus <strong>PUBLISHED</strong> dengan lencana verifikasi.
                  </div>
                )}
              </div>

              <div className="mt-auto pt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setSelectedQueueItem(null)}>Batal</Button>
                <Button variant="primary" onClick={submitReview} isLoading={submittingReview}>
                  Simpan Keputusan
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Content Form Modal (Create / Edit Monograf & Artikel) */}
      {contentModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setContentModalOpen(false)}
          title={editingContent ? 'Edit Monograf / Artikel' : 'Tambah Monograf / Artikel Baru'}
          maxWidth="max-w-4xl"
        >
          <form onSubmit={handleSaveContent} className="space-y-4 max-h-[75vh] overflow-y-auto px-1 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Judul Monograf *</label>
                <input
                  type="text"
                  required
                  value={contentForm.title}
                  onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                  placeholder="Contoh: Prasasti Palas Pasemah..."
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Jenis Konten *</label>
                <select
                  value={contentForm.type}
                  onChange={(e) => setContentForm({ ...contentForm, type: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans bg-white"
                >
                  <option value="sejarah">Sejarah</option>
                  <option value="budaya">Budaya</option>
                  <option value="artefak">Artefak</option>
                  <option value="tokoh">Tokoh</option>
                  <option value="tempat">Tempat Bersejarah</option>
                  <option value="artikel">Artikel &amp; Riset</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Kategori</label>
                <select
                  value={contentForm.categoryId}
                  onChange={(e) => setContentForm({ ...contentForm, categoryId: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans bg-white"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Wilayah (Kabupaten/Kota)</label>
                <input
                  type="text"
                  value={contentForm.region}
                  onChange={(e) => setContentForm({ ...contentForm, region: e.target.value })}
                  placeholder="Contoh: Lampung Selatan"
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Periode / Era</label>
                <input
                  type="text"
                  value={contentForm.period}
                  onChange={(e) => setContentForm({ ...contentForm, period: e.target.value })}
                  placeholder="Contoh: Abad ke-7 M"
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Lokasi Spesifik</label>
                <input
                  type="text"
                  value={contentForm.location}
                  onChange={(e) => setContentForm({ ...contentForm, location: e.target.value })}
                  placeholder="Contoh: Desa Palas Pasemah, Sekampung Udik"
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">URL Foto Utama</label>
                <input
                  type="url"
                  value={contentForm.image}
                  onChange={(e) => setContentForm({ ...contentForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Ringkasan Singkat (Subtitle / Deskripsi)</label>
              <textarea
                rows={2}
                value={contentForm.description}
                onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                placeholder="Ringkasan 1-2 kalimat untuk kartu kuratorial..."
                className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Isi Lengkap Naskah / Monograf *</label>
              <textarea
                rows={8}
                required
                value={contentForm.content}
                onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
                placeholder="Tuliskan isi sejarah, artikel, atau monograf secara mendalam..."
                className="w-full p-3 rounded-lg border border-stone-300 text-xs font-sans leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Sumber &amp; Referensi Dokumen</label>
                <textarea
                  rows={3}
                  value={contentForm.references}
                  onChange={(e) => setContentForm({ ...contentForm, references: e.target.value })}
                  placeholder='Buku Sejarah Lampung (2020) atau JSON: [{"title": "Arsip...", "year": 2018}]'
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Status Publikasi</label>
                <select
                  value={contentForm.status}
                  onChange={(e) => setContentForm({ ...contentForm, status: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans bg-white"
                >
                  <option value="PUBLISHED">PUBLISHED (Tampil di Publik)</option>
                  <option value="DRAFT">DRAFT (Disimpan Internal)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setContentModalOpen(false)}>Batal</Button>
              <Button type="submit" variant="primary" isLoading={savingContent}>
                {editingContent ? 'Simpan Perubahan' : 'Terbitkan Monograf'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Category Modal */}
      {categoryModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setCategoryModalOpen(false)}
          title={editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nama Kategori *</label>
              <input
                type="text"
                required
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="Contoh: Tradisi & Kultural"
                className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Deskripsi Singkat</label>
              <textarea
                rows={3}
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Penjelasan cakupan kategori..."
                className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
              />
            </div>
            <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setCategoryModalOpen(false)}>Batal</Button>
              <Button type="submit" variant="primary">Simpan Kategori</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Timeline Modal */}
      {timelineModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setTimelineModalOpen(false)}
          title={editingTimeline ? 'Edit Peristiwa Garis Waktu' : 'Tambah Peristiwa Garis Waktu'}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveTimeline} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tahun / Penanggalan *</label>
                <input
                  type="text"
                  required
                  value={timelineForm.year}
                  onChange={(e) => setTimelineForm({ ...timelineForm, year: e.target.value })}
                  placeholder="Contoh: 1856 M atau 2500 SM"
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Babak / Era (Epoch) *</label>
                <input
                  type="text"
                  required
                  value={timelineForm.epoch}
                  onChange={(e) => setTimelineForm({ ...timelineForm, epoch: e.target.value })}
                  placeholder="Contoh: Perang Rajabasa"
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Judul Peristiwa *</label>
              <input
                type="text"
                required
                value={timelineForm.title}
                onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                placeholder="Contoh: Perlawanan Radin Inten II..."
                className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Lokasi</label>
                <input
                  type="text"
                  value={timelineForm.location}
                  onChange={(e) => setTimelineForm({ ...timelineForm, location: e.target.value })}
                  placeholder="Gunung Rajabasa"
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tokoh Kunci</label>
                <input
                  type="text"
                  value={timelineForm.keyFigure}
                  onChange={(e) => setTimelineForm({ ...timelineForm, keyFigure: e.target.value })}
                  placeholder="Radin Inten II"
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Ringkasan Peristiwa *</label>
              <textarea
                rows={3}
                required
                value={timelineForm.summary}
                onChange={(e) => setTimelineForm({ ...timelineForm, summary: e.target.value })}
                placeholder="Rangkuman singkat peristiwa sejarah ini..."
                className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">URL Gambar Ilustrasi</label>
                <input
                  type="url"
                  value={timelineForm.image}
                  onChange={(e) => setTimelineForm({ ...timelineForm, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nomor Urut</label>
                <input
                  type="number"
                  value={timelineForm.order}
                  onChange={(e) => setTimelineForm({ ...timelineForm, order: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-sans"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setTimelineModalOpen(false)}>Batal</Button>
              <Button type="submit" variant="primary">Simpan Peristiwa</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
