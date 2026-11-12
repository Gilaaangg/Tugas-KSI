import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai seeding database JEJAK Lampung Digital Museum...');

  // 1. Clean existing records for clean seeding
  await prisma.favorite.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.contribution.deleteMany();
  await prisma.content.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const hashedAdminPassword = bcrypt.hashSync('admin123', 10);
  const hashedUserPassword = bcrypt.hashSync('user123', 10);

  // 2. Create Core Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@jejak.id',
      username: 'admin',
      password: hashedAdminPassword,
      name: 'Dewan Kurator JEJAK',
      role: 'ADMIN',
      picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: 'warga@lampung.id',
      username: 'warga',
      password: hashedUserPassword,
      name: 'Raden Danu',
      role: 'USER',
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
  });

  const contributor2 = await prisma.user.create({
    data: {
      email: 'sitimaimunah@email.com',
      username: 'sitimaimunah',
      password: hashedUserPassword,
      name: 'Siti Maimunah',
      role: 'USER',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    },
  });

  console.log('✅ Users seeded');

  // 3. Create Categories
  const catSejarah = await prisma.category.create({
    data: {
      name: 'Sejarah & Peristiwa',
      slug: 'sejarah-peristiwa',
      description: 'Rekaman sejarah perlawanan, kerajaan, dan garis waktu perkembangan daerah Lampung.',
    },
  });

  const catBudaya = await prisma.category.create({
    data: {
      name: 'Tradisi & Kultural',
      slug: 'tradisi-kultural',
      description: 'Adat istiadat, falsafah Piil Pesenggiri, seni tari, dan ritual tradisional Lampung.',
    },
  });

  const catArtefak = await prisma.category.create({
    data: {
      name: 'Artefak & Tekstil',
      slug: 'artefak-tekstil',
      description: 'Kain Tapis emas, prasasti batu kuno, mahkota Siger, dan pusaka warisan Lampung.',
    },
  });

  const catTempat = await prisma.category.create({
    data: {
      name: 'Cagar Budaya & Situs',
      slug: 'cagar-budaya-situs',
      description: 'Situs megalitikum, benteng bersejarah, dan tempat cagar budaya di tanah Lampung.',
    },
  });

  const catArtikel = await prisma.category.create({
    data: {
      name: 'Artikel & Riset',
      slug: 'artikel-riset',
      description: 'Tulisan editorial, esai kuratorial, dan riset mendalam mengenai warisan budaya Lampung.',
    },
  });

  console.log('✅ Categories seeded');

  // 4. Create Contents
  const contentsData = [
    {
      slug: 'kain-tapis-lampung-kilau-benang-emas',
      type: 'artefak',
      title: 'Kain Tapis Lampung: Kilau Benang Emas Simbol Keluhuran Budaya',
      subtitle: 'Warisan Tekstil Kuno Berhiaskan Benang Emas dan Motif Geometris Magis',
      period: 'Abad ke-15 - Sekarang',
      location: 'Pugung Raharjo, Lampung Timur',
      region: 'Lampung Timur',
      coordinates: '-5.3128, 105.5721',
      description: 'Kain Tapis adalah pakaian adat tradisional wanita Lampung yang ditenun dari benang katun dan dihiasi sulaman benang emas berhiaskan motif geometris, mitologi, serta alam.',
      content: `Kain Tapis bukan sekadar kain tenun biasa; ia adalah manifestasi tertinggi dari seni, identitas, dan derajat sosial masyarakat Lampung. Tradisi menenun Tapis telah diwariskan secara turun-temurun sejak era pra-Islam di mana motif-motif kuno merepresentasikan Falsafah Hidup *Piil Pesenggiri*.

### Ragam Motif dan Makna

Secara umum, kain Tapis dihiasi berbagai motif khas seperti:
- **Motif Pohon Hayat (Hayat Tree):** Melambangkan keselarasan antara manusia, alam semesta, dan Sang Pencipta.
- **Motif Kapal (Palepai):** Melambangkan perjalanan hidup dan transisi derajat sosial dalam adat Saibatin maupun Pepadun.
- **Motif Flora dan Fauna:** Naga, burung garuda, dan bunga melati yang disulam menggunakan benang emas murni.

Proses pembuatan satu helai kain Tapis secara tradisional memakan waktu hingga berbulan-bulan karena kerumitan teknik sulam emas (*sekapat* dan *pucuk rebung*).`,
      image: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Woman%27s_sarong_%28tapis%29_from_Sumatra%2C_Indonesia%2C_early_20th_century_II%2C_HAA.JPG',
      images: JSON.stringify([
        'https://upload.wikimedia.org/wikipedia/commons/7/7a/Woman%27s_sarong_%28tapis%29_from_Sumatra%2C_Indonesia%2C_early_20th_century_II%2C_HAA.JPG'
      ]),
      references: JSON.stringify([
        { title: 'Buku Kebudayaan Tekstil Nusantara', author: 'Dra. Endang Lestari', year: 2018 },
        { title: 'Arsip Museum Negeri Lampung Ruwa Jurai', author: 'Tim Kurator Museum Lampung', year: 2021 }
      ]),
      verifiedBy: 'Dewan Kebudayaan Lampung',
      status: 'PUBLISHED',
      categoryId: catArtefak.id,
      authorId: adminUser.id,
    },
    {
      slug: 'prasasti-palas-pasemah-jejak-sriwijaya',
      type: 'sejarah',
      title: 'Prasasti Palas Pasemah: Sumpah Penaklukan Kerajaan Sriwijaya di Lampung',
      subtitle: 'Prasasti Batu Bertuliskan Aksara Pallawa Abad ke-7 di Palas, Lampung Selatan',
      period: 'Abad ke-7 Masehi (ca. 683 M)',
      location: 'Desa Palas Pasemah, Lampung Selatan',
      region: 'Lampung Selatan',
      coordinates: '-5.6134, 105.7142',
      description: 'Prasasti Palas Pasemah merupakan peninggalan bersejarah dari era Kerajaan Sriwijaya yang berisi kurukan atau sumpah setia penaklukan wilayah selatan Sumatra.',
      content: `Ditemukan di tepi sungai Pisang, Desa Palas Pasemah, Lampung Selatan, batu prasasti ini berukuran panjang sekitar 1.5 meter. Inskripsi prasasti menggunakan bahasa Melayu Kuno dengan aksara Pallawa.

### Isi Prasasti
Isi prasasti memuat kutukan dan penegakan kekuasaan Kedatuan Sriwijaya di bawah kepemimpinan Dapunhta Hyang Sri Jayanasa. Prasasti ini membuktikan bahwa wilayah ujung selatan pulau Sumatra telah menjadi bagian strategis dari jalur perdagangan laut Kerajaan Sriwijaya sejak abad ke-7 masehi.`,
      image: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Prasasti_Kota_Kapur.jpg',
      references: JSON.stringify([
        { title: 'Epigrafi Sriwijaya di Lampung', author: 'Prof. Boechari', year: 1979 }
      ]),
      verifiedBy: 'Balai Pelestarian Kebudayaan Wilayah VII',
      status: 'PUBLISHED',
      categoryId: catSejarah.id,
      authorId: adminUser.id,
    },
    {
      slug: 'situs-megalitikum-pugung-raharjo',
      type: 'tempat',
      title: 'Taman Purbakala Pugung Raharjo: Benteng Kompleks Megalitikum Bertingkat',
      subtitle: 'Perpaduan Kebudayaan Megalitikum, Klasik Hindu-Buddha, hingga Era Islam',
      period: '2500 SM - Abad ke-16 M',
      location: 'Kecamatan Sekampung Udik, Lampung Timur',
      region: 'Lampung Timur',
      coordinates: '-5.3195, 105.5788',
      description: 'Situs Purbakala Pugung Raharjo adalah kompleks megalitikum unik dengan punden berundak, benteng tanah, batu bertulis, dan dolmen yang berdiri di tengah bentang alam asri.',
      content: `Disertai punden berundak megah berparit keliling, Taman Purbakala Pugung Raharjo ditemukan secara tidak sengaja oleh para transmigran pada tahun 1957. Situs ini sangat unik karena merekam keberlanjutan peradaban manusia dari zaman prasejarah hingga zaman Islam.

### Fitur Utama Situs:
- **Punden Berundak:** Bangunan bertingkat tempat ritual pemujaan roh leluhur.
- **Benteng Tanah Parit Dualisme:** Struktur pertahanan berupa tanggul tanah melingkar sepanjang ratusan meter.
- **Batu Mayat (Menhir):** Batu tegak antropomorfik bersimbologi kesuburan.`,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pugung_Raharjo_Pyramid_1.jpg/960px-Pugung_Raharjo_Pyramid_1.jpg',
      references: JSON.stringify([
        { title: 'Laporan Ekskavasi Pugung Raharjo', author: 'Pusat Penelitian Arkeologi Nasional', year: 1985 }
      ]),
      verifiedBy: 'Dewan Kebudayaan Lampung',
      status: 'PUBLISHED',
      categoryId: catTempat.id,
      authorId: adminUser.id,
    },
    {
      slug: 'radin-inten-ii-pahlawan-perlawanan-lampung',
      type: 'tokoh',
      title: 'Radin Inten II: Sang Singa Penjaga Kedaulatan Tanah Lampung',
      subtitle: 'Pahlawan Nasional Asal Lampung Penentang Kolonialisme Belanda di Benteng Gunung Rajabasa',
      period: '1834 - 1856',
      location: 'Gunung Rajabasa, Lampung Selatan',
      region: 'Lampung Selatan',
      coordinates: '-5.7481, 105.6268',
      description: 'Radin Inten II memimpin perjuangan rakyat Lampung menolak imperialisme Belanda pada usia 16 tahun hingga gugur heroik pada tahun 1856 di lereng Gunung Rajabasa.',
      content: `Radin Inten II lahir pada tahun 1834 di Keratuan Darah Putih. Beliau merupakan keturunan langsung dari Radin Inten I dan Sunan Gunung Jati. Sejak usia remaja, Radin Inten II melanjutkan perlawanan gigih melawan kompeni Belanda yang berniat menguasai komoditas lada dan pelabuhan strategis Lampung.

### Strategi Perang Benteng Rajabasa
Beliau mendirikan jaringan benteng pertahanan di lereng Gunung Rajabasa seperti Benteng Kahua, Benteng Gajah Berak, dan Benteng Bendulu. Pasukan tempurnya menggunakan taktik gerilya bertumpu pada penguasaan medan perbukitan.`,
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Radin_Inten_II%2C_National_Hero_of_Indonesia.jpg',
      references: JSON.stringify([
        { title: 'Sejarah Perjuangan Radin Inten II', author: 'Drs. Suparman Ahmad', year: 1995 }
      ]),
      verifiedBy: 'Dewan Kebudayaan Lampung',
      status: 'PUBLISHED',
      categoryId: catSejarah.id,
      authorId: adminUser.id,
    },
    {
      slug: 'falsafah-piil-pesenggiri-kehormatan-diri',
      type: 'budaya',
      title: 'Piil Pesenggiri: Falsafah Moral dan Kehormatan Diri Masyarakat Lampung',
      subtitle: 'Empat Pilar Etika Utama: Juluk Adok, Nemui Nyimah, Nengah Nyappur, Sakai Sambayan',
      period: 'Tradisional - Sekarang',
      location: 'Seluruh Wilayah Lampung',
      region: 'Bandar Lampung',
      coordinates: '-5.4292, 105.2611',
      description: 'Piil Pesenggiri adalah pandangan hidup dan tatanan etika adat Lampung yang menjunjung kehormatan, kedermawanan, keterbukaan sosial, dan semangat gotong royong.',
      content: `Piil Pesenggiri merupakan pegangan hidup yang membentuk norma sosial bagi masyarakat beradat Pepadun maupun Saibatin.

### 4 Unsur Utama Falsafah:
1. **Juluk Adok:** Tata gelar kehormatan dan kebanggaan atas nama baik keluarga.
2. **Nemui Nyimah:** Sikap murah hati, ramah, dan memuliakan setiap tamu yang berkunjung.
3. **Nengah Nyappur:** Pergaulan yang terbuka, toleran, dan suka bermusyawarah.
4. **Sakai Sambayan:** Gotong royong dan tolong-menolong tanpa pamrih demi kemaslahatan bersama.`,
      image: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tari_Melinting.jpg',
      references: JSON.stringify([
        { title: 'Falsafah Budaya Lampung', author: 'H. Mawardi M.P.', year: 2012 }
      ]),
      verifiedBy: 'Dewan Kebudayaan Lampung',
      status: 'PUBLISHED',
      categoryId: catBudaya.id,
      authorId: adminUser.id,
    },
    {
      slug: 'mahkota-siger-simbol-keagungan-wanita-lampung',
      type: 'artefak',
      title: 'Mahkota Siger: Keagungan sembilan lekuk mahkota adat wanita Lampung',
      subtitle: 'Perbedaan Siger Pepadun dan Saibatin serta Nilai Filosofis Pemimpin',
      period: 'Tradisional',
      location: 'Bandar Lampung',
      region: 'Bandar Lampung',
      coordinates: '-5.4500, 105.2667',
      description: 'Siger adalah mahkota kuno berwarna keemasan yang dipakai pengantin wanita Lampung. Bentuk 9 lekukan melambangkan 9 sungai atau 9 kemuflikatan adat.',
      content: `Siger melambangkan kehormatan wanita dan kepemimpinan. Pada suku Lampung Pepadun, Siger memiliki 9 lekukan (*pucuk*), sedangkan pada Saibatin memiliki 7 lekukan melambangkan 7 stelsel pimpinan raja adat.`,
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Menara_Siger.jpg',
      references: JSON.stringify([
        { title: 'Simbolisme Siger Lampung', author: 'Museum Lampung', year: 2020 }
      ]),
      verifiedBy: 'Dewan Kebudayaan Lampung',
      status: 'PUBLISHED',
      categoryId: catArtefak.id,
      authorId: adminUser.id,
    },
    {
      slug: 'menjaga-warisan-aksara-lampung-had-lampung',
      type: 'artikel',
      title: 'Menjaga Denyut Aksara Lampung: Upaya Pelestarian Had Lampung di Era Digital',
      subtitle: 'Kajian Filologi Terhadap Naskah Kulit Kayu (Khat) dan Tantangan Generasi Z',
      period: 'Abad ke-14 - Kontemporer',
      location: 'Bandar Lampung',
      region: 'Bandar Lampung',
      coordinates: '-5.3971, 105.2668',
      description: 'Aksara Lampung atau Had Lampung adalah salah satu aksara pribumi Nusantara turunan Brahmi yang tersimpan dalam manuskrip kulit kayu alim dan bambu kuno.',
      content: `Aksara Lampung, yang kerap disebut sebagai *Had Lampung*, merupakan kekayaan intelektual luhur masyarakat Lampung. Aksara ini terdiri dari 20 huruf induk (*kelabai surat*) dan sejumlah anak huruf (*benai surat*) yang menandai variasi vokal serta konsonan penutup.

### Jejak Manuskrip Kuno
Sebagian besar rekaman tertulis masa lalu Lampung dipahat di atas bilah bambu atau ditulis dengan tinta alami pada kulit kayu pohon alim (*Aquilaria microcarpa*). Naskah-naskah ini merekam hukum adat, mantra pengobatan, syair pergaulan, hingga silsilah para tetua marga.

### Digitalisasi dan Tantangan Zaman
Di era modern, ancaman kepunahan aksara daerah menjadi keprihatinan serius. JEJAK bersama para pegiat budaya terus mendorong transliterasi digital dan standardisasi Unicode aksara Lampung agar dapat diakses generasi masa depan dengan mudah di ruang digital.`,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/A_naturalist%27s_wanderings_in_the_Eastern_Archipelago%2C_a_narrative_of_travel_and_exploration_from_1878_to_1883_BHL46282805.jpg/1280px-A_naturalist%27s_wanderings_in_the_Eastern_Archipelago%2C_a_narrative_of_travel_and_exploration_from_1878_to_1883_BHL46282805.jpg',
      references: JSON.stringify([
        { title: 'Katalog Naskah Kuno Lampung', author: 'Pusat Bahasa Kemendikbud', year: 2016 },
        { title: 'Filologi Nusantara: Studi Had Lampung', author: 'Dr. Ahmad Fauzi', year: 2019 }
      ]),
      verifiedBy: 'Dewan Kurator JEJAK',
      status: 'PUBLISHED',
      categoryId: catArtikel.id,
      authorId: adminUser.id,
    },
    {
      slug: 'jejak-lada-hitam-emas-hitam-pesisir-lampung',
      type: 'artikel',
      title: 'Lada Hitam Lampung: Jejak Komoditas Dunia yang Mengubah Geopolitik Selat Sunda',
      subtitle: 'Menelusuri Kejayaan Perdagangan Maritim Abad 16–18 yang Memikat Bangsa Eropa',
      period: 'Abad ke-16 - 19',
      location: 'Teluk Betung, Bandar Lampung',
      region: 'Bandar Lampung',
      coordinates: '-5.4500, 105.2600',
      description: 'Lada hitam (Piper nigrum) dari tanah Lampung pernah menjadi primadona perdagangan global yang menghubungkan pelabuhan-pelabuhan Nusantara dengan pasar Eropa dan Asia.',
      content: `Sejak abad ke-16, reputasi Lampung sebagai produsen utama "emas hitam" (lada hitam) telah tersohor hingga ke Venesia, Lisabon, dan Amsterdam. Aroma pedas rempah ini menjadi pemicu persaingan geopolitik yang sengit di kawasan Selat Sunda.

### Aliansi Dagang dan Perubahan Sosial
Hubungan istimewa antara keratuan-keratuan di Lampung dengan Kesultanan Banten dibangun atas dasar perdagangan lada. Sistem perniagaan ini memicu pembukaan perkebunan luas di pedalaman serta melahirkan struktur adat Pepadun yang makmur lewat ritus *begawi*.

### Warisan Ekonomi
Hingga kini, lada hitam Lampung (dikenal di dunia internasional sebagai *Lampung Black Pepper*) tetap menjadi indikasi geografis kebanggaan Indonesia dengan cita rasa pedas khas yang tak tergantikan.`,
      image: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Black_Pepper_Grains.jpg',
      references: JSON.stringify([
        { title: 'The Pepper Trade of Southeast Asia', author: 'Anthony Reid', year: 1993 },
        { title: 'Sejarah Perdagangan Maritim Lampung', author: 'Dinas Kebudayaan Lampung', year: 2015 }
      ]),
      verifiedBy: 'Dewan Kurator JEJAK',
      status: 'PUBLISHED',
      categoryId: catArtikel.id,
      authorId: adminUser.id,
    }
  ];

  for (const c of contentsData) {
    await prisma.content.create({ data: c });
  }

  console.log('✅ Published Contents seeded');

  // 5. Create Timeline Events
  const createdContentPrasasti = await prisma.content.findUnique({ where: { slug: 'prasasti-palas-pasemah-jejak-sriwijaya' } });
  const createdContentPugung = await prisma.content.findUnique({ where: { slug: 'situs-megalitikum-pugung-raharjo' } });
  const createdContentRadin = await prisma.content.findUnique({ where: { slug: 'radin-inten-ii-pahlawan-perlawanan-lampung' } });

  const timelineData = [
    {
      year: '2500 SM',
      epoch: 'Pra-Sejarah',
      title: 'Pemukiman Megalitikum Pugung Raharjo',
      subtitle: 'Awal mula kehidupan menetap dan tempat ritual ritual leluhur',
      location: 'Sekampung Udik, Lampung Timur',
      category: 'Peradaban',
      summary: 'Masyarakat pra-sejarah Lampung membangun kompleks punden berundak dan dolmen di Pugung Raharjo.',
      details: 'Ditemukan menhir, punden berundak bertingkat 3, serta kapak batu persegi peninggalan kebudayaan Neolitikum.',
      keyFigure: 'Leluhur Proto-Melayu',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pugung_Raharjo_Pyramid_1.jpg/960px-Pugung_Raharjo_Pyramid_1.jpg',
      order: 1,
      contentId: createdContentPugung?.id,
    },
    {
      year: '683 M',
      epoch: 'Kedatuan Sriwijaya',
      title: 'Penetapan Prasasti Palas Pasemah',
      subtitle: 'Perluasan pengaruh Sriwijaya ke wilayah selatan Sumatra',
      location: 'Palas Pasemah, Lampung Selatan',
      category: 'Politik',
      summary: 'Dapunhta Hyang Sri Jayanasa menegakkan prasasti kutukan di Lampung untuk menjaga keamanan jalur pelayaran Selat Sunda.',
      details: 'Prasasti bertuliskan bahasa Melayu Kuno menyebutkan penundukan Lampung di bawah Kedatuan Sriwijaya.',
      keyFigure: 'Dapunta Hyang Sri Jayanasa',
      image: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Prasasti_Kota_Kapur.jpg',
      order: 2,
      contentId: createdContentPrasasti?.id,
    },
    {
      year: '1550 M',
      epoch: 'Kesultanan Banten',
      title: 'Persetujuan Perdagangan Lada Lampung - Banten',
      subtitle: 'Monopoli lada hitam dan pengakuan kekuasaan adat Saibatin',
      location: 'Cirebon & Banten',
      category: 'Perdagangan',
      summary: 'Keratuan di Lampung menjalin persekutuan dagang lada hitam dengan Sultan Banten Hasanuddin.',
      details: 'Lampung menjadi pemasok utama lada hitam dunia yang diekspor hingga ke Eropa dan Tiongkok.',
      keyFigure: 'Sultan Hasanuddin Banten',
      image: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Black_Pepper_Grains.jpg',
      order: 3,
    },
    {
      year: '1856 M',
      epoch: 'Perang Rajabasa',
      title: 'Perlawanan Radin Inten II dan Gugurnya Sang Singa Rajabasa',
      subtitle: 'Pertempuran puncak membendung kolonial Belanda di Gunung Rajabasa',
      location: 'Gunung Rajabasa, Lampung Selatan',
      category: 'Perang',
      summary: 'Radin Inten II gugur setelah dikhianati saat perang gerilya melawan pasukan Belanda.',
      details: 'Pasukan Belanda melancarkan ekspedisi militer besar-besaran untuk menghancurkan Benteng Kahua.',
      keyFigure: 'Radin Inten II',
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Radin_Inten_II%2C_National_Hero_of_Indonesia.jpg',
      order: 4,
      contentId: createdContentRadin?.id,
    },
    {
      year: '1883 M',
      epoch: 'Bencana Alam',
      title: 'Letusan Dahsyat Gunung Krakatau',
      subtitle: 'Gelombang tsunami dahsyat menghantam pesisir Teluk Lampung',
      location: 'Selat Sunda & Pesawi, Lampung',
      category: 'Bencana',
      summary: 'Letusan Krakatau menenggelamkan kota-kota pesisir Lampung dan memicu perubahan iklim global.',
      details: 'Tsunami setinggi 30 meter menghancurkan daerah pesisir Kalianda dan Bandar Lampung kuno.',
      keyFigure: 'Penduduk Pesisir Lampung',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600',
      order: 5,
    }
  ];

  for (const t of timelineData) {
    await prisma.timelineEvent.create({ data: t });
  }

  console.log('✅ Timeline Events seeded');

  // 6. Create Seed Contributions with various statuses
  await prisma.contribution.create({
    data: {
      title: 'Dokumentasi Rumah Panggung Kayu Tradisional Lamban Gedung',
      category: 'Cagar Budaya & Tempat',
      region: 'Pesisir Barat',
      period: 'Abad 18',
      location: 'Krui, Pesisir Barat',
      content: 'Rumah panggung kayu berukir khas Saibatin Krui yang masih berdiri kokoh dengan arsitektur kayu tanpa paku besi. Bangunan ini memiliki nilai historis sebagai kediaman penyimbang adat.',
      interviewee: 'H. Syahrial (Tokoh Adat Krui)',
      sourceRef: 'Catatan Silsilah Penyimbang Saibatin Krui',
      status: 'SUBMITTED',
      urgencyScore: 90,
      userId: demoUser.id,
    },
  });

  await prisma.contribution.create({
    data: {
      title: 'Asal-usul Tradisi Tari Melinting di Lampung Timur',
      category: 'Tradisi & Kultural',
      region: 'Lampung Timur',
      period: 'Abad ke-16',
      location: 'Labuhan Maringgai',
      content: 'Tari Melinting diciptakan oleh Ratu Melinting sebagai tarian sakral istana yang kini berkembang menjadi tarian penyambutan tamu kehormatan.',
      interviewee: 'Pak Hamdan (Penari Senior)',
      sourceRef: 'Naskah Kuno Keratuan Melinting',
      status: 'REVISION',
      adminNotes: 'Tolong tambahkan perincian gerakan kipas dan pakaian adat yang dikenakan oleh penari pria dan wanita.',
      urgencyScore: 85,
      userId: contributor2.id,
    },
  });

  await prisma.contribution.create({
    data: {
      title: 'Cerita Rakyat Legenda Serunting Sakti (Pahit Lidah)',
      category: 'Tradisi & Kultural',
      region: 'Lampung Barat',
      period: 'Mitos/Legenda',
      location: 'Liwa',
      content: 'Legenda Serunting Sakti atau Si Pahit Lidah yang kutukannya dipercayai menciptakan berbagai bentukan batu unik di wilayah dataran tinggi Lampung.',
      status: 'REJECTED',
      rejectionReason: 'Narasi yang dikirimkan terlalu singkat dan tidak menyertakan sumber cerita/narasumber lokal yang valid.',
      userId: demoUser.id,
    },
  });

  console.log('✅ Contributions seeded');
  console.log('🎉 Seeding selesai dengan sukses!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
