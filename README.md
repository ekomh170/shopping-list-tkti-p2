# BelanjaKita

> Belanja tanpa ada yang tertinggal.

BelanjaKita adalah aplikasi web _shopping list_ sederhana untuk mencatat kebutuhan belanja, menandai barang yang sudah dibeli, dan menyimpan daftar secara otomatis di browser. Proyek ini dibuat sebagai tugas **Pengembangan Aplikasi Sederhana** pada mata kuliah **TKTI**.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

## Fitur

- **Tambah barang**: ketik nama barang lalu tekan Enter atau tombol `+`.
- **Saran AI (Gemini)**: tanyakan makanan, kegiatan, atau benda apa pun, misalnya _"soto ayam untuk 4 orang"_ atau _"mau camping 2 hari"_. AI memberi penjelasan singkat dan daftar barang beserta kegunaannya, lalu kamu pilih mana yang ingin ditambahkan (satu per satu atau sekaligus).
- **Chat Belanja**: jendela chat asisten belanja (n8n) yang muncul langsung di halaman, lewat tombol _Chat Belanja_ atau ikon chat di pojok kanan bawah.
- **Edit barang**: ubah nama barang langsung di daftar.
- **Tandai sudah dibeli**: centang barang yang sudah masuk keranjang.
- **Hapus barang**: hapus satu per satu, atau hapus semua yang sudah selesai sekaligus.
- **Filter daftar**: tampilkan _Semua_, _Belum_, atau _Selesai_.
- **Progres belanja**: penghitung `selesai/total` dan jumlah barang tersisa.
- **Tersimpan otomatis**: data disimpan di `localStorage`, jadi tidak hilang saat halaman di-refresh.
- **Notifikasi singkat (toast)**: muncul setiap ada perubahan pada daftar.
- **Responsif**: nyaman dipakai di desktop maupun HP.

## Teknologi

| Teknologi              | Kegunaan                           |
| ---------------------- | ---------------------------------- |
| HTML5                  | Struktur halaman                   |
| Tailwind CSS (CDN)     | Styling utama dan tema warna       |
| CSS                    | Style tambahan (`styles.css`)      |
| JavaScript (vanilla)   | Logika aplikasi dan manipulasi DOM |
| Web Storage API        | Menyimpan data di `localStorage`   |
| Google Gemini API      | Saran daftar belanja dari AI       |
| n8n Chat (`@n8n/chat`) | Jendela Chat Belanja di halaman    |
| Vercel                 | Hosting + serverless function      |

Tidak ada proses _build_. File frontend langsung dijalankan oleh browser, sedangkan `api/suggest.js` berjalan sebagai serverless function di Vercel supaya API key Gemini tidak terlihat di browser.

## Struktur Proyek

```
.
├── index.html    # Halaman utama dan konfigurasi Tailwind
├── styles.css    # Style tambahan di luar Tailwind
├── app.js        # Logika aplikasi (CRUD, filter, localStorage)
├── favicon.svg   # Ikon tab browser (+ favicon.ico dan apple-touch-icon.png)
├── api/
│   └── suggest.js # Serverless function yang memanggil Gemini API
├── .env.example  # Contoh environment variable
├── vercel.json   # Konfigurasi routing Vercel
├── package.json  # Dependency Vercel CLI
└── README.md
```

## Menjalankan Secara Lokal

1. Clone repository ini:

   ```bash
   git clone https://github.com/ekomh170/shopping-list-tkti-p2.git
   cd shopping-list-tkti-p2
   ```

2. Salin `.env.example` menjadi `.env`, lalu isi `GEMINI_API_KEY` dengan API key dari [Google AI Studio](https://aistudio.google.com/apikey).

3. Jalankan server lokal Vercel (butuh login `npx vercel login` sekali):

   ```bash
   npx vercel dev
   ```

   Lalu buka alamat yang muncul di terminal (biasanya `http://localhost:3000`).

   Membuka `index.html` langsung atau lewat `npx serve .` tetap bisa, tetapi fitur **Saran AI** tidak akan jalan karena butuh `api/suggest.js`.

> Butuh koneksi internet saat membuka aplikasi karena Tailwind CSS dan Google Fonts dimuat lewat CDN.

## Cara Kerja Singkat

- Data barang disimpan sebagai array objek `{ id, name, completed }` di `localStorage` dengan key `belanjakita-items`.
- Saat pertama kali dibuka (belum ada data), aplikasi menampilkan beberapa contoh barang.
- Setiap perubahan (tambah, edit, centang, hapus) langsung disimpan lalu tampilan di-render ulang.
- Input pengguna di-_escape_ sebelum ditampilkan untuk mencegah injeksi HTML.
- Saran AI dikirim ke `POST /api/suggest`. Function tersebut memanggil model `gemini-3.8-flash` (fallback ke `gemini-flash-lite-latest` saat model utama sibuk) dan meminta balasan JSON berbentuk `{ explanation, items: [{ name, note }] }`. Barang yang sudah ada di daftar ditandai _Di daftar_ dan tidak ditambahkan dua kali.

Untuk mengosongkan data, hapus key `belanjakita-items` lewat DevTools browser (tab **Application → Local Storage**).

## Deploy ke Vercel

1. Push repository ini ke GitHub.
2. Buka [Vercel](https://vercel.com) lalu pilih **Add New → Project**.
3. Import repository `shopping-list-tkti-p2`.
4. Biarkan **Framework Preset** di `Other`, tanpa build command.
5. Di **Environment Variables**, tambahkan `GEMINI_API_KEY` berisi API key Gemini.
6. Klik **Deploy**.

File `vercel.json` sudah mengarahkan semua route (kecuali `/api/*`) ke `index.html` dan mengaktifkan _clean URLs_.

## Pembuat

**Eko Muchamad Haryono** ([@ekomh170](https://github.com/ekomh170))
