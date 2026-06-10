# Task: Implementasi Frontend Modul Bookings (Pemesanan)

## Deskripsi Tugas
Tugas ini bertujuan untuk membangun antarmuka pengguna (UI) dengan tema *Travel Agent* untuk fitur **Bookings** (Pemesanan Paket Wisata). Anda harus membuat tampilan yang terintegrasi dengan RESTful API yang sudah disediakan.

Pastikan mengikuti panduan ini langkah demi langkah secara berurutan. Panduan ini dirancang agar mudah diikuti oleh Junior Programmer atau AI assistant.

---

## Endpoint API yang Digunakan

Semua API harus diawali dengan base URL `/api/v1` dan akan mengembalikan data dalam format JSON standar: `{ "status": "...", "message": "...", "data": ... }`.

1.  **`POST /api/v1/bookings`**
    *   **Akses:** Customer (Wajib mengirimkan Bearer Token di Header Authorization).
    *   **Request Body:** `tour_package_id` (string), `total_pax` (number).
    *   **Tujuan:** Membuat pesanan baru.
    *   *Catatan Integrasi:* Sistem backend akan otomatis mengecek ketersediaan quota pada paket wisata dan mengkalkulasi `total_amount`. Tidak perlu mengirim harga dari frontend.

2.  **`GET /api/v1/bookings`**
    *   **Akses:** Admin & Customer (Wajib mengirimkan Bearer Token).
    *   **Tujuan:** Menampilkan daftar pemesanan.
    *   *Catatan:* Backend otomatis memfilter: jika user biasa, hanya pesanan miliknya yang tampil; jika admin, semua pesanan akan tampil.

3.  **`GET /api/v1/bookings/{id}`**
    *   **Akses:** Admin & Customer (Wajib mengirimkan Bearer Token).
    *   **Tujuan:** Menampilkan detail spesifik dari sebuah pesanan, termasuk relasinya ke tabel `tour_packages` (seperti nama paket, destinasi, dan tanggal).

---

## Tahapan Implementasi (Step-by-Step)

Kerjakan instruksi di bawah ini secara bertahap:

### Langkah 1: Persiapan API Service (`bookingService.ts`)
1. Buat file baru di `frontend/src/services/bookingService.ts`.
2. Buat fungsi helper untuk mengambil token dari `localStorage` dan menyisipkannya ke header `Authorization: Bearer <token>`.
3. Gunakan library `axios` untuk membuat 3 fungsi:
   - `createBooking(data: { tour_package_id: string; total_pax: number })`
   - `getBookings()`
   - `getBookingById(id: string)`
4. *Penting:* Karena respons backend dibungkus dalam properti `data`, pastikan fungsi Anda me-*return* `response.data.data`.

### Langkah 2: UI Form Pemesanan (Di Halaman Detail Paket)
1. Buka file `frontend/src/pages/PackageDetail.tsx`.
2. Tambahkan *state* untuk `total_pax` (default: 1) dan *state* untuk proses loading/error pemesanan.
3. Di bagian informasi paket, buat sebuah form kecil berisi:
   - Input tipe `number` untuk "Jumlah Orang (Pax)" (minimal 1).
   - Tombol "Confirm Booking" (atau "Pesan Sekarang").
4. Saat tombol diklik:
   - Panggil fungsi `createBooking` dari *service* dengan membawa `tour_package_id` (dari parameter URL/data paket) dan `total_pax`.
   - Tampilkan alert sukses jika berhasil, dan *redirect* (menggunakan `useNavigate`) ke rute `/bookings`.

### Langkah 3: UI Daftar Pesanan (My Bookings)
1. Buat komponen baru di `frontend/src/pages/BookingList.tsx`.
2. Saat komponen di-*mount* (`useEffect`), panggil fungsi `getBookings()`.
3. Tampilkan data tersebut menggunakan desain tabel atau list/card. Pastikan kolom ini terlihat:
   - Kode Booking (`booking_code`)
   - Nama Paket
   - Tanggal Pesan
   - Total Pax
   - Total Harga (Format Rupiah)
   - Status (Pending/Success/Cancelled)
4. Pada setiap baris/card, berikan tombol "View Detail" yang mengarah ke link `/bookings/:id`.

### Langkah 4: UI Detail Pesanan
1. Buat komponen baru di `frontend/src/pages/BookingDetail.tsx`.
2. Tangkap ID dari URL menggunakan `useParams`.
3. Saat komponen di-*mount*, panggil fungsi `getBookingById(id)`.
4. Tampilkan informasi detail pemesanan dengan rapi (Kode, Status, Tanggal, Harga, dsb), serta informasi detail *Tour Package* yang dipesan.

### Langkah 5: Registrasi Rute (Routing) & Navigasi
1. Buka file `frontend/src/App.tsx`.
2. Daftarkan dua rute baru **di dalam `<ProtectedRoute>`** (karena butuh login):
   - `<Route path="/bookings" element={<BookingList />} />`
   - `<Route path="/bookings/:id" element={<BookingDetail />} />`
3. Tambahkan tombol/link navigasi "My Bookings" di komponen Dashboard (atau Navigation Bar) agar user mudah mengakses halaman daftar pemesanan.

---
**Catatan untuk Developer:** Fokuslah pada modularitas kode dan fungsionalitas utama terlebih dahulu. Desain CSS bisa menggunakan gaya dasar/vanilla atau menyamakan dengan `Package.css` yang sudah ada agar terkesan konsisten.
