import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const updates = [
  { slug: "kain-tapis-lampung-kilau-benang-emas", image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Kain_tapis.JPG", images: JSON.stringify(["https://upload.wikimedia.org/wikipedia/commons/6/6a/Kain_tapis.JPG","https://upload.wikimedia.org/wikipedia/commons/9/9c/Black_and_red_tapis.png"]) },
  { slug: "prasasti-palas-pasemah-jejak-sriwijaya", image: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Prasasti_Kota_Kapur.jpg", images: JSON.stringify(["https://upload.wikimedia.org/wikipedia/commons/b/b4/Prasasti_Kota_Kapur.jpg"]) },
  { slug: "situs-megalitikum-pugung-raharjo", image: "https://upload.wikimedia.org/wikipedia/commons/2/23/Pugung_Raharjo_Pyramid_2.jpg", images: JSON.stringify(["https://upload.wikimedia.org/wikipedia/commons/2/23/Pugung_Raharjo_Pyramid_2.jpg","https://upload.wikimedia.org/wikipedia/commons/6/68/Pugung_Raharjo_Pyramid_1.jpg"]) },
  { slug: "radin-inten-ii-pahlawan-perlawanan-lampung", image: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Radin_Inten_II%2C_National_Hero_of_Indonesia.jpg", images: JSON.stringify(["https://upload.wikimedia.org/wikipedia/commons/c/c1/Radin_Inten_II%2C_National_Hero_of_Indonesia.jpg"]) },
  { slug: "falsafah-piil-pesenggiri-kehormatan-diri", image: "https://upload.wikimedia.org/wikipedia/commons/7/78/Tari_Sigeh_Penguten_Lampung_%287%29.jpg", images: JSON.stringify(["https://upload.wikimedia.org/wikipedia/commons/7/78/Tari_Sigeh_Penguten_Lampung_%287%29.jpg"]) },
  { slug: "mahkota-siger-simbol-keagungan-wanita-lampung", image: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Pengantin_Suku_Lampung.jpg", images: JSON.stringify(["https://upload.wikimedia.org/wikipedia/commons/5/5a/Pengantin_Suku_Lampung.jpg","https://upload.wikimedia.org/wikipedia/commons/9/9e/Tugu_Siger.jpg"]) },
];
const tUpdates = [
  { title: "Pemukiman Megalitikum Pugung Raharjo", image: "https://upload.wikimedia.org/wikipedia/commons/2/23/Pugung_Raharjo_Pyramid_2.jpg" },
  { title: "Penetapan Prasasti Palas Pasemah", image: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Prasasti_Kota_Kapur.jpg" },
  { title: "Persetujuan Perdagangan Lada Lampung - Banten", image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Kain_tapis.JPG" },
  { title: "Perlawanan Radin Inten II dan Gugurnya Sang Singa Rajabasa", image: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Radin_Inten_II%2C_National_Hero_of_Indonesia.jpg" },
  { title: "Letusan Dahsyat Gunung Krakatau", image: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Eruption_of_Krakatoa%2C_August_26%2C_1883.jpg" },
];
async function main() {
  for (const u of updates) { const r = await prisma.content.updateMany({ where: { slug: u.slug }, data: { image: u.image, images: u.images } }); console.log(r.count > 0 ? "OK: " + u.slug : "SKIP: " + u.slug); }
  for (const t of tUpdates) { const r = await prisma.timelineEvent.updateMany({ where: { title: t.title }, data: { image: t.image } }); console.log(r.count > 0 ? "TL-OK: " + t.title.substring(0,50) : "TL-SKIP: " + t.title.substring(0,50)); }
  console.log("Done!");
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
