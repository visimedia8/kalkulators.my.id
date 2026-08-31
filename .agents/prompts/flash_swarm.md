# THE FLASH SWARM - MASTER PROMPT
**Role**: Flash Worker
**Goal**: Build a specific calculator component and generate its SEO content.

## TUGAS 1: BANGUN KOMPONEN KALKULATOR
1. Buat file `src/components/calculators/[nama-kalkulator].tsx`.
2. Gunakan **HANYA** komponen UI kustom berikut dari `@/components/ui/`:
   - `Card`, `Input`, `Button`, `OutputBox`, `Select`
   - **DILARANG KERAS** menggunakan tag HTML `<select>` biasa. Wajib impor dari `@/components/ui/select`.
3. State Management WAJIB menggunakan `nuqs` (URL Query State).
   - Jangan gunakan `useState` untuk parameter kalkulasi yang ingin di-share.
   - Gunakan `useQueryState` atau `useQueryStates` dengan `parseAsFloat` atau tipe yang sesuai agar *state* sinkron dengan URL (cth: `?price=10000`).
4. Pastikan kalkulasi ditangani dengan presisi matematis dan menggunakan *useEffect* agar otomatis terkalkulasi saat parameter URL berubah.
5. (Opsional) Jika visualisasi dibutuhkan, gunakan komponen kustom dari `recharts`.

## TUGAS 2: BUAT KONTEN SEO (KORAY METHOD)
Baca `.agents/rules/brand-lexicon.md`. Tulis konten edukasi mendalam (H2, H3, H4) sesuai dengan Lexicon tersebut.
**CRITICAL RULE:** Kamu **TIDAK BOLEH** merender teks Markdown mentah. Kamu WAJIB mengembalikan output berupa format **JSON murni** yang siap dimasukkan ke dalam skema Prisma `ContentBlock`.

Struktur JSON yang WAJIB dikembalikan di dalam file `scratch/[nama]-seo.json`:
```json
{
  "slug": "nama-kalkulator",
  "definitionalH2": "Isi teks Markdown untuk penjelasan H2 (Definisi dan Rumus)...",
  "actionableH3": "Isi teks Markdown untuk H3 (Langkah-langkah penggunaan)...",
  "booleanFaqH4": "Isi teks Markdown untuk H4 (Tanya Jawab)...",
  "faqJsonLd": "Isi string mentah dari Schema.org JSON-LD FAQPage lengkap dengan tag <script type=\"application/ld+json\">..."
}
```

Pastikan JSON valid (lolos `JSON.parse`) dan *escape* karakter petik (`"`) dan baris baru (`\n`) dengan benar di dalam *string value*-nya. Lapor ke Orkestrator (Pro Agent) jika file sudah di-*generate*.
