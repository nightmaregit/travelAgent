# Issue: Implementasi Endpoint Detail Paket Wisata (Katalog Paket)

## Deskripsi Tugas
Tugas ini bertujuan untuk membuat endpoint RESTful API yang berfungsi untuk menampilkan detail dari satu paket wisata berdasarkan ID-nya. Endpoint ini harus menggunakan standar format respons JSON yang seragam di seluruh aplikasi.

**Spesifikasi Endpoint:**
- **Modul:** Tour Packages (Katalog Paket)
- **Metode:** `GET`
- **URL:** `/api/v1/packages/{id}`
- **Akses:** Publik (Tidak memerlukan Bearer Token)
- **Tujuan:** Mengambil data detail satu paket wisata dari database berdasarkan `id`.
- **Format Respons:** Wajib mengembalikan JSON dengan properti `status`, `message`, dan `data`.

---

## Panduan Implementasi (Langkah demi Langkah)

Panduan ini disusun agar sangat mudah dipahami dan dieksekusi oleh Junior Programmer atau AI model. Silakan kerjakan secara berurutan:

### Langkah 1: Pembuatan Logika di Controller
1. Buka file controller untuk paket wisata, yaitu di `backend/src/controllers/packageController.ts` (buat jika belum ada).
2. *Import* tipe `Request` dan `Response` dari `express`, serta koneksi database.
3. Buat dan *export* fungsi *asynchronous* bernama `getPackageById`:
   ```typescript
   export const getPackageById = async (req: Request, res: Response) => {
     // Logika akan ditulis di sini
   };
   ```
4. **Logika Internal `getPackageById`:**
   - Ambil nilai `id` dari parameter URL: `const { id } = req.params;`.
   - Gunakan blok `try...catch` untuk menangkap potensi *error* saat akses database.
   - Di dalam blok `try`:
     - Jalankan query SQL untuk mencari paket wisata: `SELECT * FROM tour_packages WHERE id = ?`. Jangan lupa *passing* variabel `id` ke dalam query untuk mencegah SQL Injection.
     - Simpan hasil query ke dalam sebuah variabel (misalnya `rows`).
     - Lakukan pengecekan:
       - Jika array hasil query kosong (`rows.length === 0` atau paket tidak ada), kembalikan respons HTTP `404 Not Found`:
         ```json
         { "status": "Error", "message": "Package not found", "data": null }
         ```
       - Jika paket ditemukan, kembalikan respons HTTP `200 OK`:
         ```json
         { "status": "Success", "message": "Package retrieved successfully", "data": { /* objek paket di sini */ } }
         ```
   - Di dalam blok `catch`:
     - Tampilkan error di console (`console.error`).
     - Kembalikan respons HTTP `500 Internal Server Error`:
       ```json
       { "status": "Error", "message": "Internal server error", "data": null, "details": error.message }
       ```

### Langkah 2: Registrasi Endpoint di Router
1. Buka file routing paket wisata di `backend/src/routes/packageRoutes.ts`.
2. Pastikan fungsi `getPackageById` sudah di-*import* dari `packageController.ts`.
3. Daftarkan *route* baru untuk *method* `GET` yang mengarah ke `/:id`:
   ```typescript
   router.get('/:id', getPackageById);
   ```
   *(Catatan: Pastikan penempatan rute dinamis `/:id` berada di bawah rute statis jika ada rute statis lain, agar tidak terjadi bentrok. Base URL `/api/v1/packages` sudah ditangani di `index.ts`)*.

### Langkah 3: Pengujian (Testing)
Setelah kode ditulis, jalankan server *backend* (misal dengan `bun run dev`) dan lakukan pengujian dengan API Client seperti Thunder Client, Postman, atau perintah `curl` di terminal.

- **Skenario 1 (Sukses):**
  Lakukan *request*: `GET http://localhost:3000/api/v1/packages/{id_yang_valid_di_db}`
  *Ekspektasi:* Status HTTP 200 dan JSON mengembalikan detail spesifik paket tersebut.

- **Skenario 2 (Gagal - Data Tidak Ada):**
  Lakukan *request*: `GET http://localhost:3000/api/v1/packages/id-palsu-123`
  *Ekspektasi:* Status HTTP 404 dan JSON menginformasikan bahwa *Package not found*.
