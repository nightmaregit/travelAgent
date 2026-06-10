# Task: Audit System Flow & Implementasi Sisa Fitur (Pembayaran & Laporan)

## Latar Belakang
Saat ini, fitur Autentikasi (Register/Login), Manajemen Paket Wisata (CRUD Katalog), dan Pemesanan Dasar (Booking) sudah berhasil diimplementasikan. Tugas ini bertujuan untuk **mengevaluasi** kesesuaian kode saat ini dengan Alur Sistem (System Flow) standar Travel Agent, sekaligus **mengimplementasikan fitur-fitur yang masih kurang**, khususnya pada tahap Pembayaran, Manajemen Transaksi oleh Admin, dan Laporan.

Panduan ini disusun secara berurutan dan mendetail agar mudah dipahami dan dieksekusi oleh Junior Programmer atau AI assistant.

---

## Alur Aplikasi Web (System Flow) yang Diharapkan

**A. Alur Pelanggan (Customer Flow):**
1. **[SELESAI] Registrasi/Login:** Pengguna membuat akun atau masuk menggunakan email dan password.
2. **[SELESAI] Eksplorasi Paket:** Pengguna melihat daftar paket wisata yang tersedia beserta detailnya (destinasi, jadwal, harga, sisa kuota).
3. **[SELESAI] Pemesanan (Booking):** Pengguna memilih paket, memasukkan jumlah peserta (pax), dan sistem akan mengalkulasi total harga secara otomatis.
4. **[BELUM SELESAI] Pembayaran:** Pengguna diarahkan ke halaman pembayaran untuk memilih metode bayar dan menyelesaikan transaksi.
5. **[BELUM SELESAI] Konfirmasi & Tiket:** Setelah pembayaran dikonfirmasi (otomatis atau manual oleh admin), status berubah menjadi sukses dan pengguna mendapatkan riwayat pemesanan/e-tiket.

**B. Alur Administrator (Admin Flow):**
1. **[SELESAI] Login Admin:** Masuk ke dashboard khusus pengelola.
2. **[SELESAI] Manajemen Paket (CRUD):** Admin dapat menambah, mengubah, menghapus, atau menonaktifkan paket wisata.
3. **[BELUM SELESAI] Manajemen Transaksi:** Admin memantau pesanan masuk, memverifikasi pembayaran (jika manual), dan memperbarui status pesanan (Pending -> Paid / Cancelled).
4. **[BELUM SELESAI] Laporan:** Admin dapat melihat rekapitulasi jumlah pesanan dan total pendapatan.

---

## Tahapan Implementasi (Panduan Langkah Demi Langkah)

Silakan kerjakan instruksi di bawah ini secara bertahap untuk menyelesaikan fitur-fitur yang berstatus **[BELUM SELESAI]**.

### Fase 1: Implementasi Modul Pembayaran (Customer Flow)
*Tujuan: Memungkinkan pelanggan mengunggah bukti pembayaran atau melakukan simulasi pembayaran (mock payment).*

1. **Persiapan Backend (Cek API Payment):**
   - Pastikan backend memiliki endpoint untuk memproses pembayaran (misalnya `POST /api/v1/payments` atau `POST /api/v1/bookings/:id/pay`).
   - Jika endpoint sudah ada, pelajari struktur *request body*-nya (misalnya butuh `booking_id`, `payment_method`, `amount`).
2. **Persiapan Service Frontend (`paymentService.ts`):**
   - Buat file `frontend/src/services/paymentService.ts`.
   - Implementasikan fungsi `processPayment(bookingId, paymentData)` menggunakan `axios` dengan menyertakan `Authorization: Bearer <token>`.
3. **UI Halaman Pembayaran (`PaymentPage.tsx`):**
   - Buat komponen halaman baru untuk pembayaran (bisa juga diintegrasikan di dalam `BookingDetail.tsx` menggunakan modal/form).
   - Tampilkan Total Tagihan yang harus dibayar.
   - Sediakan pilihan metode pembayaran sederhana (misal: Transfer Bank, Kartu Kredit).
   - Sediakan tombol "Bayar Sekarang" atau form upload bukti transfer (tergantung spesifikasi backend).
   - Saat berhasil, *trigger* pembaruan data agar status booking berubah dari `pending` menjadi `paid` (atau menunggu konfirmasi admin).

### Fase 2: Manajemen Transaksi & Konfirmasi (Admin Flow)
*Tujuan: Memungkinkan Admin untuk mengelola semua pesanan dan mengonfirmasi pembayaran pelanggan.*

1. **Halaman Daftar Transaksi Admin (`AdminBookingTable.tsx`):**
   - Buat halaman/tabel khusus admin (di dalam folder `src/pages/admin`) untuk melihat seluruh transaksi (`GET /api/v1/bookings`).
   - Tampilkan kolom penting: Nama Pelanggan (jika ada), Kode Booking, Paket, Total Pax, Total Tagihan, dan **Status**.
2. **Aksi Ubah Status (Update Booking Status):**
   - Pada tabel tersebut, tambahkan tombol aksi (Aprove/Reject) atau dropdown status (Pending, Success/Paid, Cancelled).
   - Buat fungsi di `bookingService.ts` (misalnya `updateBookingStatus(id, status)`) yang menembak API backend (seperti `PUT /api/v1/bookings/:id/status`).
   - Saat status diubah menjadi "Success/Paid", pastikan UI ter-update secara *real-time* atau *refresh* otomatis.

### Fase 3: Tampilan Konfirmasi/E-Tiket (Customer Flow)
*Tujuan: Memberikan tanda bukti kepada pelanggan ketika pembayaran sudah dikonfirmasi.*

1. **Pembaruan UI `BookingDetail.tsx`:**
   - Tambahkan logika visual: Jika status pesanan adalah `success` atau `paid`, tampilkan elemen khusus seperti label hijau besar **"E-Ticket Confirmed"** atau tampilkan QR Code sederhana (bisa berupa gambar *placeholder* atau generate dari text).
   - Sembunyikan tombol "Lakukan Pembayaran" jika status sudah *paid/success*.

### Fase 4: Laporan Rekapitulasi (Admin Dashboard)
*Tujuan: Memberikan gambaran bisnis secara umum kepada pemilik travel.*

1. **UI Laporan di Dashboard Admin:**
   - Di halaman beranda Admin (misalnya di `App.tsx` bagian Dashboard Admin, atau buat komponen `AdminDashboard.tsx`), buat kartu rekapitulasi (*Summary Cards*).
   - Hitung statistik sederhana dari data pemesanan yang ditarik via API (`GET /api/v1/bookings`):
     *   **Total Pesanan Sukses**: Menghitung *length* pesanan dengan status 'success'.
     *   **Total Pendapatan**: Menjumlahkan (sum) `total_amount` dari pesanan yang berstatus 'success'.
     *   **Pesanan Menunggu Konfirmasi**: Menghitung jumlah pesanan dengan status 'pending'.
2. **Routing Tambahan:**
   - Daftarkan rute-rute admin baru di `App.tsx` (misal: `/admin/bookings`, `/admin/dashboard`).

---
**Catatan Penting:** 
*   Selalu kerjakan satu fase sampai benar-benar selesai dan teruji sebelum lanjut ke fase berikutnya.
*   Periksa *Console Log* dan tab *Network* di browser secara berkala untuk memastikan respons API backend dikelola dengan benar (berada di dalam properti `response.data.data`).