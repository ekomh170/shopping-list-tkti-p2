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
- **Edit barang**: ubah nama barang langsung di daftar.
- **Tandai sudah dibeli**: centang barang yang sudah masuk keranjang.
- **Hapus barang**: hapus satu per satu, atau hapus semua yang sudah selesai sekaligus.
- **Filter daftar**: tampilkan _Semua_, _Belum_, atau _Selesai_.
- **Progres belanja**: penghitung `selesai/total` dan jumlah barang tersisa.
- **Tersimpan otomatis**: data disimpan di `localStorage`, jadi tidak hilang saat halaman di-refresh.
- **Notifikasi singkat (toast)**: muncul setiap ada perubahan pada daftar.
- **Responsif**: nyaman dipakai di desktop maupun HP.

## Teknologi

| Teknologi            | Kegunaan                           |
| -------------------- | ---------------------------------- |
| HTML5                | Struktur halaman                   |
| Tailwind CSS (CDN)   | Styling utama dan tema warna       |
| CSS                  | Style tambahan (`styles.css`)      |
| JavaScript (vanilla) | Logika aplikasi dan manipulasi DOM |
| Web Storage API      | Menyimpan data di `localStorage`   |
| Vercel               | Hosting static site                |

Tidak ada proses _build_. Semua file langsung dijalankan oleh browser.

## Struktur Proyek

```
.
├── index.html    # Halaman utama dan konfigurasi Tailwind
├── styles.css    # Style tambahan di luar Tailwind
├── app.js        # Logika aplikasi (CRUD, filter, localStorage)
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

2. Buka `index.html` langsung di browser, **atau** jalankan server lokal:

   ```bash
   npx serve .
   ```

   Lalu buka alamat yang muncul di terminal (biasanya `http://localhost:3000`).

> Butuh koneksi internet saat membuka aplikasi karena Tailwind CSS dan Google Fonts dimuat lewat CDN.

## Cara Kerja Singkat

- Data barang disimpan sebagai array objek `{ id, name, completed }` di `localStorage` dengan key `belanjakita-items`.
- Saat pertama kali dibuka (belum ada data), aplikasi menampilkan beberapa contoh barang.
- Setiap perubahan (tambah, edit, centang, hapus) langsung disimpan lalu tampilan di-render ulang.
- Input pengguna di-_escape_ sebelum ditampilkan untuk mencegah injeksi HTML.

Untuk mengosongkan data, hapus key `belanjakita-items` lewat DevTools browser (tab **Application → Local Storage**).

## Deploy ke Vercel

1. Push repository ini ke GitHub.
2. Buka [Vercel](https://vercel.com) lalu pilih **Add New → Project**.
3. Import repository `shopping-list-tkti-p2`.
4. Biarkan **Framework Preset** di `Other`, tanpa build command.
5. Klik **Deploy**.

File `vercel.json` sudah mengarahkan semua route ke `index.html` dan mengaktifkan _clean URLs_.

## Pembuat

**Eko Muchamad Haryono** ([@ekomh170](https://github.com/ekomh170))
