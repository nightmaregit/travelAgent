# Task: Implementasi Landing Page & Panduan Penggunaan

## Latar Belakang
Saat ini, aplikasi Travel Agent kita sudah memiliki fungsionalitas inti (Autentikasi, Katalog Paket, Pemesanan, Pembayaran, dan Dashboard Admin). Namun, saat ini kita belum memiliki sebuah **Landing Page** yang menarik untuk menyambut pengunjung baru. Selain itu, panduan yang jelas mengenai cara menggunakan aplikasi untuk Customer maupun panduan operasional untuk Admin belum terstruktur dengan baik.

Tugas ini bertujuan untuk:
1. Membuat **Landing Page** (Halaman Beranda) yang informatif dan menarik untuk pengunjung umum.
2. Menambahkan panduan/alur penggunaan aplikasi (How-To) bagi pelanggan langsung di dalam Landing Page.
3. Menambahkan panduan spesifik operasional Admin di dalam file `README.md` pada repositori GitHub.

---

## Tahapan Implementasi (Panduan untuk Junior Programmer / AI)

Silakan ikuti langkah-langkah berikut secara berurutan. Kerjakan satu fase hingga teruji sebelum beranjak ke fase berikutnya.

### Fase 1: Implementasi Komponen Landing Page
*Tujuan: Mengganti halaman root (`/`) yang sebelumnya berupa Dashboard statis menjadi Landing Page publik.*

1. **Buat Komponen Landing Page (`frontend/src/pages/LandingPage.tsx`)**
   - Buat file baru bernama `LandingPage.tsx` dan `LandingPage.css`.
   - **Hero Section**: Buat bagian atas halaman yang menampilkan ucapan selamat datang (misal: "Jelajahi Destinasi Impianmu Bersama Kami") dan sebuah tombol *Call to Action* (CTA) bertuliskan "Lihat Paket Wisata" yang mengarah (route) ke `/packages`.
   - **Section Panduan Penggunaan (Customer)**: Di bawah Hero Section, buat blok informasi yang menjelaskan cara menggunakan website secara visual/step-by-step:
     1. Cari & Pilih Paket Wisata.
     2. Registrasi / Login Akun.
     3. Masukkan Jumlah Pax & Lakukan Pemesanan.
     4. Unggah Bukti Pembayaran & Tunggu E-Tiket Terbit.
   - Gunakan desain yang rapi (menggunakan Vanilla CSS, Flexbox/Grid).

2. **Perbarui Konfigurasi Routing (`frontend/src/App.tsx`)**
   - Ubah agar *route* `/` (root) memuat komponen `LandingPage` yang baru dibuat.
   - Pastikan pengguna yang belum login (public user) tetap bisa melihat `LandingPage` dengan sempurna.
   - Jika diperlukan, pindahkan logika Dashboard utama yang ada sebelumnya ke rute baru (misal `/profile` atau biarkan dihapus jika fungsionalitasnya sudah digantikan oleh navigasi di Landing Page).

### Fase 2: Pembaruan Panduan Admin di `README.md`
*Tujuan: Memastikan Admin baru tahu cara menggunakan fitur-fitur panel pengelolaan.*

1. **Buka file `README.md`** (yang berada di root proyek atau folder frontend/backend).
2. **Tambahkan Seksi Baru**: Buat heading baru berjudul **"Panduan Penggunaan untuk Admin"**.
3. **Jelaskan Alur Admin**: Tuliskan panduan berikut di dalamnya:
   - **Login Admin**: Cara login menggunakan akun dengan kredensial role `admin`.
   - **Manajemen Paket Wisata**: Cara mengakses menu "Manage Tour Packages" untuk membuat paket baru, mengedit, atau menonaktifkan paket yang sudah ada.
   - **Verifikasi Transaksi**: Cara mengakses menu "Manage Transactions" untuk memantau pesanan yang masuk. Jelaskan bahwa admin harus mengecek bukti pembayaran pelanggan (klik "View Proof"), lalu memutuskan untuk mengubah status pesanan menjadi `Confirm (Paid)` atau `Cancel`.
   - **Laporan Dashboard**: Cara mengakses "Admin Dashboard" untuk melihat ringkasan performa (Total Revenue, Pesanan Sukses, dan Pesanan Pending).

---
**Catatan Penting untuk Implementator:**
- Jangan gunakan *library* CSS pihak ketiga yang belum terinstal (seperti Tailwind/Bootstrap). Gunakan Vanilla CSS murni.
- Fokus pada pengalaman pengguna (UX) yang *clean* dan intuitif.
- Selalu uji perubahan pada tampilan lokal sebelum melakukan *commit*.