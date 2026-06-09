# Issue: Implementasi Endpoint Katalog Paket Wisata (Tour Packages)

## Deskripsi Tugas
Tugas ini bertujuan untuk membuat endpoint RESTful API yang menampilkan daftar paket wisata yang aktif. Fitur ini juga harus mendukung pencarian atau filter berdasarkan destinasi menggunakan query parameter.

**Spesifikasi Endpoint:**
- **Metode:** `GET`
- **URL:** `/api/v1/packages`
- **Akses:** Publik (Tidak memerlukan token otentikasi)
- **Tujuan:** Mengambil data dari tabel `tour_packages` di database.
- **Kondisi Utama:** Hanya tampilkan paket wisata yang statusnya aktif (`is_active = true`).
- **Filter (Opsional):** Jika terdapat query parameter `destination` (contoh: `/api/v1/packages?destination=bali`), maka filter hasil pencarian agar hanya menampilkan paket yang destinasinya sesuai atau mengandung kata tersebut.

---

## Panduan Implementasi (Langkah demi Langkah)

Panduan ini disusun agar mudah diikuti oleh Junior Programmer atau AI Assistant. Silakan kerjakan secara berurutan:

### Langkah 1: Pembuatan Controller
1. Buka (atau buat jika belum ada) file `backend/src/controllers/packageController.ts`.
2. Import tipe data yang dibutuhkan: `import type { Request, Response } from 'express';`.
3. Import koneksi database: `import pool from '../utils/db.ts';`.
4. Buat fungsi asynchronous bernama `getPackages`:
   ```typescript
   export const getPackages = async (req: Request, res: Response) => {
     // Logika akan ditulis di sini
   };
   ```
5. **Logika Internal `getPackages`:**
   - Ambil nilai `destination` dari query parameter: `const { destination } = req.query;`
   - Siapkan kerangka query SQL dasar: `let queryStr = 'SELECT * FROM tour_packages WHERE is_active = true';`
   - Siapkan array untuk parameter query: `const queryParams: any[] = [];`
   - Buat logika percabangan untuk filter:
     - Jika `destination` ada nilainya, tambahkan klausa ke `queryStr`: `queryStr += ' AND destination LIKE ?';`
     - Masukkan nilai destination (tambahkan `%` untuk pencarian parsial) ke dalam array `queryParams`: `queryParams.push('%' + destination + '%');`
   - Lakukan query ke database menggunakan blok `try...catch`:
     ```typescript
     try {
       const [rows] = await pool.query(queryStr, queryParams);
       return res.status(200).json({
         status: 'Success',
         message: 'Packages retrieved successfully',
         data: rows
       });
     } catch (error: any) {
       console.error('Error fetching packages:', error);
       return res.status(500).json({
         status: 'Error',
         message: 'Internal server error',
         data: null,
         details: error.message
       });
     }
     ```

### Langkah 2: Pembuatan Router
1. Buka (atau buat jika belum ada) file `backend/src/routes/packageRoutes.ts`.
2. Setup router Express dan daftarkan fungsi controller:
   ```typescript
   import { Router } from 'express';
   import { getPackages } from '../controllers/packageController.ts';

   const router = Router();

   // Rute untuk mendapatkan semua paket
   router.get('/', getPackages);

   export default router;
   ```

### Langkah 3: Registrasi Router di Aplikasi Utama
1. Buka file `backend/index.ts`.
2. Import router yang baru saja dibuat di bagian atas file:
   ```typescript
   import packageRoutes from './src/routes/packageRoutes.ts';
   ```
3. Daftarkan router tersebut di bagian konfigurasi // Routes:
   ```typescript
   app.use('/api/v1/packages', packageRoutes);
   ```

### Langkah 4: Pengujian (Testing)
Pastikan backend berjalan (misal dengan `npm run dev:node` di dalam folder backend), lalu uji endpoint menggunakan `curl` atau API Client (seperti Postman).

- **Skenario 1 (Tanpa Filter):**
  Akses `GET http://localhost:3000/api/v1/packages`.
  *Ekspektasi: Menampilkan semua paket wisata yang aktif.*

- **Skenario 2 (Dengan Filter):**
  Akses `GET http://localhost:3000/api/v1/packages?destination=bali`.
  *Ekspektasi: Hanya menampilkan paket wisata aktif yang kolom destinasinya mengandung kata "bali".*

---
**Catatan Penting:** 
Selalu pertahankan standar format respons (Uniform JSON structure) yang terdiri dari `status`, `message`, dan `data` baik untuk respons sukses maupun respons error.
