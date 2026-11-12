# JEJAK

Museum Digital Interaktif untuk Eksplorasi Sejarah dan Warisan Budaya Lampung.
*Temukan sejarahnya. Jaga ceritanya.*

## Struktur
- `client/` React + Vite + Tailwind CSS
- `server/` Node.js + Express + Prisma (PostgreSQL)

## Menjalankan (Tahap 0)

### 1. Backend
```bash
cd server
cp .env.example .env      # isi DATABASE_URL, JWT_SECRET, dll
npm install
npm run dev               # http://localhost:5000/api/health
```

### 2. Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

## Catatan keamanan
Jangan commit file `.env`. Hanya `.env.example` yang boleh masuk repository.
