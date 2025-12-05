# BMKG Wilayah & Prakiraan (CLI + Library)

CLI dan utilitas JS/TS untuk mencari kode wilayah administrasi (adm4) dan mengambil prakiraan cuaca BMKG. Dibuat ringan untuk dipakai di backend, CLI, atau dijembatani ke frontend.

## Instalasi

```bash
bun install
# atau npm install / pnpm install

# build (bundled ke dist + copy base.csv)
bun run build
```

## Pemakaian CLI

```bash
# fokus Malang + pencarian cepat "malang"
bmkg

# ringkasan wilayah Malang (kab/kota, kecamatan, contoh adm4)
bmkg malang

# cari wilayah
bmkg search "<nama>" [--limit=N]
bmkg search "Banyuwangi" --limit=20

# ambil prakiraan cuaca (adm4)
bmkg fetch 35.07.01.2001
```

Output fetch menampilkan 10 slot waktu terdekat (3 harian, per 3 jam). Sumber data: BMKG (api.bmkg.go.id). Batas akses API: 60 permintaan/menit/IP.

## API Library

Import dari package (ESM):

```ts
import {
  loadRegions,
  searchRegions,
  fetchForecast,
  BASE_CSV_PATH,
  type Region,
  type ForecastEntry,
} from "@hades/bmkg-cli";

const regions: Region[] = loadRegions(); // default pakai base.csv terbundle
const matches = searchRegions(regions, "Malang", 10);

const adm4 = matches[0]?.code;
if (adm4) {
  const { forecasts } = await fetchForecast(adm4);
  forecasts.slice(0, 5).forEach((f: ForecastEntry) => {
    console.log(f.local_datetime, f.weather_desc, f.t, f.hu);
  });
}
```

Fungsi utama:
- `loadRegions(path?)` memuat base.csv (kode wilayah adm1–adm4).
- `searchRegions(regions, query, limit?)` mencari nama/kode, memprioritaskan Malang jika relevan.
- `fetchForecast(adm4)` mengambil prakiraan 3 hari (3 jam sekali) dari BMKG.
- `BASE_CSV_PATH` menunjuk file CSV terbundle (berguna saat dijalankan dari luar repo).

## Integrasi Frontend

- Library ini memakai `fs` untuk memuat `base.csv`, jadi untuk browser:
  1. Sajikan `base.csv` sebagai aset statik (misal `/base.csv`).
  2. Ambil dengan `fetch("/base.csv")` lalu parsing client-side, atau gunakan endpoint backend yang sudah memanggil `loadRegions`.
- Panggilan API prakiraan tetap langsung ke `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=...` (ingat batas 60/min/IP). Tambahkan cache di backend jika memerlukan.

## Pengembangan & Publikasi

- `bun run dev` menjalankan CLI dari sumber (TS).
- `bun run build` menghasilkan bundle ESM di `dist/` dan menyalin `base.csv`.
- Untuk publikasi npm: pastikan versi di `package.json`, lalu `npm publish --access public` (atau `pnpm/npm publish` sesuai registry).

## Catatan & Kepatuhan

- Cantumkan BMKG sebagai sumber data pada aplikasi Anda.
- Hormati batas laju 60 permintaan per menit per IP.
- Data wilayah berasal dari `base.csv` (kode wilayah administrasi tingkat IV, Kemendagri 100.1.1-6117/2022).
