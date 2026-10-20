# RuMa Shalat — Panduan Shalat Anak

Aplikasi web (PWA) panduan shalat untuk anak usia 4–12 tahun dari **RuMa Digital**. Bisa dibuka dari browser dan dipasang di HP lewat menu "Tambahkan ke Layar Utama". Setelah dibuka sekali, aplikasi tetap bisa dipakai tanpa internet. Pengecualiannya murattal Al-Qur'an, yang tetap butuh koneksi.

Materi mengikuti **madzhab Syafi'i** seperti yang umum diajarkan di TPA dan sekolah di Indonesia.

## Isi aplikasi

| Menu | Isi |
|---|---|
| 💧 Wudhu | 10 langkah wudhu bergambar, fardhu & sunnah wudhu, pembatal wudhu, tayamum, niat & doa setelah wudhu |
| 🧎 Gerakan Shalat | 12 gerakan dengan karakter animasi (putra berpeci / putri bermukena), penjelasan, dan bacaannya |
| 📖 Bacaan Shalat | Semua bacaan dari takbir sampai salam (Arab, latin, arti, suara), Al-Fatihah + 11 surat pendek, mode hafalan |
| ▶️ Ayo Praktik! | Simulasi shalat Subuh/Dzuhur/Ashar/Maghrib/Isya langkah demi langkah sesuai jumlah rakaat, bisa jalan otomatis |
| 🕌 Jenis Shalat & Niat | 5 shalat wajib + Jumat, 9 shalat sunnah, rakaat, waktu, bacaan keras/pelan, lafaz niat, penjelasan kata dalam niat |
| ✅ Syarat & Rukun | Syarat wajib, syarat sah, 13 rukun, sunnah ab'adh & hai'at, pembatal shalat, sujud sahwi |
| 🤲 Doa Harian | 19 doa sehari-hari |
| 📿 Dzikir & Tasbih | Tasbih digital 33-33-33 + urutan dzikir setelah shalat (termasuk Ayat Kursi) |
| 🎯 Kuis | ±100 soal: Mudah (4–6 th), Sedang (7–9 th), Sulit (10–12 th), Tantangan Kilat 60 detik. Ada soal bergambar, soal teks Arab, dan soal menyusun urutan |
| ⏰ Jadwal & Checklist | Jadwal shalat 49 kota (kriteria Kemenag) atau lokasi GPS, hitung mundur, checklist 5 waktu, riwayat 7 hari, arah kiblat |
| ⭐ Bintangku | Bintang & 16 lencana |
| 👨‍👩‍👧 Orang Tua | Nama anak, karakter, pilihan qari, simpan semua suara untuk offline, sumber materi (Studio Rekam disembunyikan, buka lewat `/#/studio`) |
| 📲 Pasang & Offline | Tombol pasang ke layar utama HP (Android, plus panduan untuk iPhone) dan tombol simpan semua suara untuk offline |

## Suara

Urutan suara yang diputar untuk setiap bacaan:

1. **Rekaman Ayah/Bunda** dari menu Orang Tua (disimpan di HP masing-masing).
2. **File audio buatan sendiri** di folder `public/audio/` (lihat di bawah).
3. **Murattal Al-Qur'an** dari EveryAyah, untuk Al-Fatihah, surat pendek, dan Ayat Kursi.
4. **Suara bawaan HP** (text-to-speech). Kalau HP tidak punya suara bahasa Arab, yang dibacakan tulisan latinnya.

### Merekam suara sendiri dengan perekam HP (berlaku untuk semua pengguna)

Naskahnya bernomor: **A01–A63** untuk bacaan Arab dan **K01–K96** untuk soal kuis. Halaman naskah untuk dibuka di HP: https://claude.ai/artifact/HTkUeVBfikTSSN4i1B7zWy (salinannya ada di `tools/naskah-rekaman.html`).

1. Rekam dengan aplikasi perekam bawaan HP dalam format M4A/MP3. Satu nomor satu file, berurutan. Nama file tidak perlu diganti, kecuali file rekaman ulang yang diberi nama sesuai nomornya (misalnya `A05.m4a`).
2. Salin file ke laptop. Gunakan satu folder per bagian, misalnya `Downloads\rekaman-A`.
3. Cek pasangan nomor dan file dulu:
   ```
   powershell -ExecutionPolicy Bypass -File tools/pasang-rekaman-hp.ps1 -Folder "C:\Users\ASUS\Downloads\rekaman-A" -Bagian A -Coba
   ```
   Untuk sesi lanjutan, tambahkan `-Mulai 31` (nomor awal sesi itu).
4. Kalau pasangannya sudah benar, jalankan lagi tanpa `-Coba`, lalu deploy ulang.

Pemetaan nomor ke id suara ada di `tools/naskah.json` dan harus sama dengan `public/js/naskah.js`.

**Olah dulu sebelum dipasang.** Alat `tools/olah-suara` membersihkan rekaman secara otomatis:
- buang dengung di bawah 80 Hz,
- kurangi noise dan desis,
- redam napas di sela kata,
- potong jeda kosong di awal dan akhir,
- pertegas suara,
- samakan kekerasan suara ke -16 LUFS dengan puncak maksimal -1 dB,
- simpan sebagai MP3 96 kbps.

File asli tidak diubah. Cara pakainya:
```
powershell -ExecutionPolicy Bypass -File tools/olah-suara/server.ps1 -Masuk "C:\Users\ASUS\Downloads\Ruma Shalat\Rekaman 2" -Keluar "C:\Users\ASUS\Downloads\Ruma Shalat\Rekaman 2 olahan"
```
1. Buka http://localhost:8090 lalu tekan **Olah semua**.
2. Bandingkan suara asli dan hasilnya di tabel. Rekaman yang durasinya janggal akan ditandai.
3. Pasang folder hasil dengan `pasang-rekaman-hp.ps1` seperti di atas. File hasilnya sudah bernama A01.mp3, K01.mp3, dan seterusnya.

### Merekam suara sendiri lewat Studio Rekam (berlaku untuk semua pengguna)

1. Buka **Studio Rekam** lewat link khusus `<alamat aplikasi>/#/studio` (misalnya http://localhost:8080/#/studio), lalu jawab soal hitungan. Studio sengaja tidak ditampilkan di menu agar tidak membingungkan pengguna umum.
2. Rekam naskahnya satu per satu: **63 bacaan Arab** (bacaan shalat, niat, wudhu, dzikir, doa) dan **96 soal kuis**. Di laptop: Spasi = rekam/berhenti, ← → = pindah naskah, Enter = dengar.
3. Tekan **Ekspor .zip**, lalu pasang hasilnya ke aplikasi:
   ```
   powershell -ExecutionPolicy Bypass -File tools/pasang-rekaman.ps1 "C:\Users\ASUS\Downloads\rekaman-ruma-shalat-2026-10-17.zip"
   ```
   Skrip ini menyalin file ke `public/audio/`, memperbarui `public/audio/daftar.json`, dan menaikkan `VERSION` di `public/sw.js`. Setelah itu deploy ulang.

Rekaman bisa dicicil. Ekspor dan pasang berkali-kali tidak masalah, karena rekaman yang baru akan menggantikan yang lama.

### Menambah file audio secara manual

Simpan file di `public/audio/` lalu daftarkan di `public/audio/daftar.json` dengan format `{"id-bacaan": "nama-file"}`, misalnya `{"takbir": "takbir.mp3"}`. Daftar id bacaan ada di `public/js/content.js`.

## Mencoba di komputer

```bash
powershell -ExecutionPolicy Bypass -File tools/serve.ps1
```
Lalu buka http://localhost:8080.

## Deploy ke Cloudflare

Alamat aplikasi: **https://rumasholat.ruumadigital.workers.dev** (Worker `rumasholat`, repo `ruumadigital-arch/Sholat`). Setiap `git push` ke branch `main` otomatis memperbarui aplikasi.

Sama seperti RuMa Belajar: `wrangler.jsonc` menyajikan folder `public/` sebagai static assets. Hubungkan repo ini ke Cloudflare Workers (Workers Builds), atau jalankan `npx wrangler deploy`.

**Setiap kali mengubah file aplikasi**, naikkan `VERSION` di `public/sw.js` (misalnya `ruma-shalat-v2`) supaya HP pengguna mengambil versi terbaru.

## Sumber materi

- Teks Al-Qur'an: Tanzil (quran-simple). Terjemahan: Kementerian Agama RI. Keduanya diambil lewat api.alquran.cloud dan dibuat otomatis oleh `tools/build-quran.ps1`.
- Murattal: EveryAyah.com (Syaikh Mishary Alafasy, Al-Husary, Al-Minshawi).
- Jadwal shalat: dihitung di perangkat (algoritma PrayTimes) dengan kriteria Kemenag RI: Subuh −20°, Isya −18°, Ashar madzhab Syafi'i, ihtiyat 2 menit.
- Bacaan shalat, niat, doa, dan fikih dasar disusun mengikuti buku pelajaran fikih madzhab Syafi'i di Indonesia.

> Sebelum dibagikan luas, sebaiknya materi diperiksa ulang oleh ustadz atau guru ngaji.

## Struktur

```
public/
  index.html, manifest.webmanifest, sw.js
  css/app.css
  js/app.js        tampilan & navigasi semua menu
  js/content.js    semua materi (bacaan, niat, wudhu, rukun, doa, soal kuis, lencana)
  js/quran.js      teks Al-Qur'an (dibuat otomatis, jangan diedit manual)
  js/figure.js     ilustrasi & animasi gerakan shalat
  js/praytimes.js  perhitungan jadwal shalat & kiblat
  js/audio.js      pemutar suara, rekaman, efek suara
  js/store.js      penyimpanan progres anak
  icons/, audio/
tools/             skrip pembuat quran.js, ikon, dan server lokal
```
