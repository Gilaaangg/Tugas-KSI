# PRD JEJAK

**Museum Digital Interaktif untuk Eksplorasi Sejarah dan Warisan Budaya Lampung**
*Temukan sejarahnya. Jaga ceritanya.*

| | |
|---|---|
| Versi | 1.0 |
| Tanggal | 1 Oktober 2026 |
| Penyusun | Gilang |
| Tujuan proyek | Lomba desain web |

---

## 1. Ringkasan

JEJAK adalah platform web untuk mengenalkan dan mendokumentasikan sejarah serta warisan budaya Lampung. Situs ini dirancang sebagai pengalaman menjelajah ala museum digital, bukan sekadar katalog atau sistem CRUD. Pengunjung bisa menelusuri sejarah berdasarkan wilayah, periode, tokoh, artefak, budaya, peristiwa, dan tempat bersejarah. Warga yang punya cerita lokal dapat mengajukannya lewat fitur **Bagikan Jejak**, dan setiap kontribusi harus diverifikasi Admin sebelum tampil di publik.

## 2. Latar Belakang dan Masalah

Informasi sejarah dan budaya Lampung tersebar dan belum disajikan dengan cara yang menarik, modern, dan mudah diakses. Akibatnya generasi muda kurang tertarik, dan banyak cerita lokal tidak terdokumentasi.

**Solusi:** satu tempat terpusat yang menyajikan konten sejarah secara visual dan interaktif, dengan mekanisme kontribusi warga yang tetap terjaga kualitas dan kebenarannya.

## 3. Tujuan dan Indikator Keberhasilan

| Tujuan | Indikator |
|---|---|
| Pengalaman visual yang kuat dan berbeda dari situs pemerintahan | Homepage terasa imersif, konsisten di desktop dan mobile |
| Konten mudah ditemukan | Pengunjung mencapai halaman detail dalam maksimal 3 klik dari Home |
| Kontribusi warga terkelola | Setiap pengajuan punya status jelas dan bisa dilacak user |
| Kepercayaan terhadap konten | Semua konten menampilkan sumber dan lencana verifikasi Admin |
| Siap dinilai juri | Seluruh fitur inti berjalan tanpa error pada demo |

## 4. Pengguna dan Role

Hanya ada dua role.

| Pengguna | Akses |
|---|---|
| **Pengunjung** (tanpa login) | Membaca dan menjelajah semua konten publik, peta, timeline, dan pencarian |
| **USER** (login Google) | Semua akses pengunjung, ditambah mengajukan kontribusi, melihat status dan riwayat, menyimpan favorit |
| **ADMIN** | Mengelola seluruh konten, memverifikasi kontribusi, mengelola user, melihat statistik |

Aturan: USER tidak dapat mempublikasikan konten langsung dan tidak dapat mengakses fungsi Admin.

## 5. Ruang Lingkup

**Termasuk (MVP):**
- Konten publik: Sejarah, Budaya, Artefak, Tokoh, Tempat Bersejarah, Artikel
- Explore dan Search
- Peta Sejarah Lampung
- Timeline Lampung
- Login Google OAuth
- Bagikan Jejak dan alur verifikasi
- Kontribusi Saya
- Admin Dashboard
- Favorit (prioritas terakhir)

**Tidak termasuk:** komentar, rating, notifikasi email, multi-bahasa, role tambahan, pembayaran, aplikasi mobile native.

## 6. Kebutuhan Fungsional

### 6.1 Akses Publik
- **FR-01** Seluruh halaman konten dapat diakses tanpa login.
- **FR-02** Hanya konten berstatus PUBLISHED yang tampil di publik.
- **FR-03** Halaman daftar mendukung filter (jenis, kategori, periode, kabupaten/kota) dan pagination.

### 6.2 Konten
- **FR-04** Setiap konten memiliki: judul, deskripsi, isi, kategori, periode/tahun, lokasi, kabupaten/kota, gambar, sumber/referensi, tanggal publikasi, status.
- **FR-05** Halaman detail menampilkan daftar sumber/referensi jika tersedia.
- **FR-06** Halaman detail menampilkan lencana "Telah diverifikasi Admin" pada konten yang berasal dari kontribusi yang disetujui, dan konten yang dibuat langsung oleh Admin.
- **FR-07** Pencarian lintas jenis konten berdasarkan judul dan deskripsi.

### 6.3 Peta Sejarah
- **FR-08** Menampilkan semua konten yang punya koordinat sebagai marker.
- **FR-09** Klik marker membuka popup berisi gambar kecil, judul, jenis, ringkasan, dan tautan ke halaman detail.
- **FR-10** Filter marker berdasarkan jenis konten.

### 6.4 Timeline
- **FR-11** Menampilkan peristiwa berurutan berdasarkan tahun/periode.
- **FR-12** Pengunjung dapat berpindah antar periode dan membuka detail setiap event.
- **FR-13** Event dapat ditautkan ke konten terkait.

### 6.5 Autentikasi
- **FR-14** Login hanya lewat Google OAuth.
- **FR-15** Akun baru otomatis berstatus USER.
- **FR-16** Admin ditentukan lewat daftar email di environment variable saat seed, dan dapat diubah Admin lain lewat dashboard.

### 6.6 Bagikan Jejak (Kontribusi)
- **FR-17** Form berisi: judul, kategori, lokasi, periode/tahun, isi cerita, sumber informasi, link sumber, buku/dokumen, narasumber, foto/dokumen pendukung.
- **FR-18** User dapat menyimpan sebagai DRAFT sebelum mengirim.
- **FR-19** Alur status: `DRAFT → SUBMITTED → UNDER REVIEW → APPROVED / REVISION / REJECTED`.
- **FR-20** Pada status REVISION, user melihat catatan Admin dan dapat memperbaiki lalu mengirim ulang.
- **FR-21** Pada status REJECTED, user melihat alasan penolakan.
- **FR-22** User hanya dapat melihat dan mengubah kontribusinya sendiri.
- **FR-23** Halaman Kontribusi Saya menampilkan riwayat dan status setiap pengajuan.

### 6.7 Admin Dashboard
- **FR-24** CRUD untuk sejarah, artikel, artefak, tokoh, budaya, tempat bersejarah, kategori, dan event timeline.
- **FR-25** Antrian verifikasi kontribusi dengan filter status.
- **FR-26** Aksi review: Approve, Request Revision (catatan wajib), Reject (alasan wajib).
- **FR-27** Saat Approve, kontribusi otomatis menjadi konten PUBLISHED yang tertaut ke kontribusi asal.
- **FR-28** Kelola user (lihat daftar, ubah role).
- **FR-29** Statistik: jumlah sejarah, artefak, tokoh, lokasi, user, kontribusi, dan kontribusi menunggu verifikasi.

## 7. Kebutuhan Non-Fungsional

| Aspek | Kebutuhan |
|---|---|
| **Keamanan** | Tidak ada secret di kode, semua lewat `.env`. Validasi input di semua endpoint (Zod). Middleware otorisasi untuk endpoint USER dan ADMIN. Cek kepemilikan pada kontribusi. Rate limit di login dan submit. Helmet dan CORS terbatas. |
| **Upload** | Hanya tipe gambar/PDF tertentu, ukuran dibatasi, nama file di-generate ulang. |
| **Performa** | Gambar dioptimalkan dan lazy-load, pagination di semua daftar, halaman utama terasa cepat. |
| **Responsif** | Desktop, tablet, dan mobile. |
| **Aksesibilitas dasar** | Kontras warna memadai, teks alternatif gambar, navigasi keyboard pada elemen utama. |
| **Maintainability** | Frontend dan backend terpisah, kode dibagi per modul/komponen, tidak ada satu file besar. |

## 8. Arah Desain

**Karakter:** modern, premium, editorial, kultural, imersif. Bukan situs pemerintahan dan bukan tampilan CRUD.

- **Tipografi:** judul serif yang kuat berpadu dengan sans-serif bersih untuk isi.
- **Warna:** dasar netral hangat (krem, cokelat tua, hitam hangat) dengan aksen dari nuansa budaya Lampung (misalnya emas dan merah tua dari kain tapis dan siger).
- **Layout:** whitespace lega, gambar besar, section bergaya storytelling saat scroll.
- **Animasi:** halus dan bermakna (fade, parallax ringan, transisi halaman), tidak berlebihan.
- **Hero Home:** judul **JEJAK**, tagline "Temukan sejarahnya. Jaga ceritanya.", CTA **Mulai Menjelajah** dan **Bagikan Jejakmu**.
- **Panel Admin:** tetap bersih dan rapi, tetapi fungsional.

## 9. Halaman

Home, Explore, Sejarah, Budaya, Artefak, Tokoh, Tempat Bersejarah, Peta Sejarah, Timeline, Detail Konten, Search, Login, Bagikan Jejak, Kontribusi Saya, Admin Dashboard (beserta sub-halaman kelola).

## 10. Teknologi

| Lapisan | Pilihan |
|---|---|
| Frontend | React + Vite + Tailwind CSS (Framer Motion untuk animasi, React Router) |
| Peta | Leaflet + OpenStreetMap |
| Backend | Node.js + Express.js |
| Database | PostgreSQL (atau MySQL) dengan Prisma |
| Auth | Google OAuth, sesi JWT di httpOnly cookie |
| Validasi | Zod |

## 11. Asumsi dan Keputusan

1. Satu tabel `contents` dengan kolom `type` melayani lima jenis konten agar sederhana.
2. Upload gambar disimpan lokal untuk pengembangan, dapat dipindah ke layanan cloud nanti.
3. Konten contoh (seed) dibuat untuk demo; konten asli ditambahkan bertahap.
4. Verifikasi bersifat manual oleh Admin, tanpa sistem skor otomatis.

## 12. Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| Konten sejarah asli dan foto terbatas | Siapkan seed contoh yang akurat, cantumkan sumber, tambahkan konten asli bertahap |
| Waktu lomba terbatas | Prioritaskan visual Home, Peta, Timeline, dan alur Bagikan Jejak; Favorit paling akhir |
| Hak cipta gambar | Gunakan foto sendiri, domain publik, atau berlisensi terbuka dan cantumkan kredit |
| Kontribusi tidak akurat | Wajib melalui verifikasi Admin dan tampilkan sumber di setiap konten |
| Konfigurasi Google OAuth | Siapkan Client ID lebih awal dan uji di localhost sebelum tahap frontend |

## 13. Kriteria Penerimaan

- Pengunjung tanpa login dapat membuka semua halaman publik, peta, timeline, dan pencarian.
- User yang login dapat mengirim kontribusi lengkap dengan lampiran, dan melihat statusnya berubah sesuai keputusan Admin.
- Pada REVISION, user dapat mengedit dan mengirim ulang.
- Kontribusi APPROVED muncul di publik dengan sumber dan lencana verifikasi.
- User biasa tidak dapat mengakses halaman atau endpoint Admin.
- Dashboard menampilkan statistik yang benar, termasuk jumlah kontribusi menunggu verifikasi.
- Tidak ada credential di repository.

## 14. Rencana Rilis

| Tahap | Isi |
|---|---|
| 0 | Setup proyek dan design tokens |
| 1 | Database, migrasi, seed |
| 2 | API publik |
| 3 | Auth Google |
| 4 | Frontend publik (Home, Explore, Detail) |
| 5 | Peta dan Timeline |
| 6 | Bagikan Jejak dan Kontribusi Saya |
| 7 | Admin Dashboard dan verifikasi |
| 8 | Polish, responsif, favorit, README |
