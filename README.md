# 🤖 Shnny Bot — WhatsApp Assistant

**Shnny Bot** adalah bot asisten WhatsApp modular premium berbasis TypeScript yang dirancang untuk performa tinggi, struktur modular, serta visual interaktif yang memukau (menggunakan WhatsApp Native Buttons dan Bottom Sheets).

Bot ini dikembangkan menggunakan library **[Zaileys](https://github.com/zeative/zaileys)**, sebuah framework pembungkus modern dan sederhana di atas engine **Baileys**.

---

## ✨ Fitur Utama

- 🖼️ **Menu Interaktif dengan Thumbnail**: Tampilan menu utama `/help` menggunakan WhatsApp Native Buttons + Bottom Sheet (`bottomSheet`) dengan header gambar background secara native.
- ⚙️ **Modular Plugin System**: Semua modul perintah dipisah secara rapi dalam folder `src/plugins` dan di-load secara dinamis.
- 👥 **Group Management**: Perintah lengkap untuk admin grup seperti Tagall, Promote, Demote, Kick, Add, dan Group Info.
- 🎨 **Media & Maker**: Fitur pembuat stiker (`/sticker`) dan quote WhatsApp (`/qwa`).
- 🛠️ **Owner Control**: Mode kehadiran, pengontrolan plugin (aktif/nonaktifkan dinamis), mode public/self, broadcast, dan penjadwal pesan.
- 💾 **Storage/History Tracking**: Penyimpanan data riwayat pesan yang rapi.

---

## 🚀 Persyaratan Sistem

Sebelum menjalankan bot ini, pastikan Anda telah menginstal komponen berikut:
* **Node.js** v20 atau lebih baru
* **pnpm** (direkomendasikan sebagai package manager)

---

## 🛠️ Instalasi & Cara Menjalankan

1. **Pasang Dependensi:**
   Jalankan perintah berikut di terminal untuk memasang semua modul yang dibutuhkan:
   ```bash
   pnpm install
   ```

2. **Konfigurasi Nomor Bot:**
   Buka file `src/index.ts` dan ganti nilai `phoneNumber` dengan nomor WhatsApp yang ingin Anda gunakan sebagai bot (gunakan format kode negara tanpa simbol `+`, contoh: `628xxxxxxxx`):
   ```typescript
   const client = new Client({
     authType: 'pairing',
     phoneNumber: '628xxxxxxxx', // Ganti dengan nomor WhatsApp bot Anda
     ...
   });
   ```

3. **Jalankan Bot:**
   Jalankan perintah berikut untuk mengaktifkan bot:
   ```bash
   pnpm start
   ```

4. **Pairing dengan WhatsApp:**
   Setelah bot berjalan, kode pairing (8 digit) akan muncul di terminal Anda. Buka WhatsApp di HP Anda -> **Perangkat Tertaut** -> **Tautkan Perangkat** -> **Tautkan dengan Nomor Telepon**, kemudian masukkan 8 digit kode tersebut.

---

## 📂 Struktur Proyek

```bash
├── src/
│   ├── index.ts          # Entry point utama inisialisasi client
│   ├── types.ts          # Definisi tipe TypeScript
│   ├── utils/            # Helper & utilitas pembantu
│   └── plugins/          # Folder kumpulan plugin/perintah bot
│       ├── general/      # Perintah umum & help
│       ├── group/        # Perintah administrasi grup
│       ├── interactive/  # Contoh fitur interaktif buttons/list
│       ├── maker/        # Stiker & media maker
│       ├── media/        # Pengirim media (gambar, video, audio)
│       └── owner/        # Perintah khusus pemilik bot (mutasi/plugin control)
├── package.json          # File konfigurasi dependensi npm
├── tsconfig.json         # Konfigurasi compiler TypeScript
└── README.md             # Dokumentasi ini
```

---

## 📋 Pembagian Kategori Menu

* **Umum (General)**: Perintah dasar sistem dan pengecekan bot (e.g. `/ping`, `/help`).
* **Grup (Group)**: Administrasi anggota grup (e.g. `/kick`, `/promote`, `/tagall`).
* **Interaktif (Interactive)**: Contoh pesan kaya WhatsApp (e.g. `/buttons`, `/carousel`, `/markdown`, `/poll`).
* **Maker**: Konversi media ke stiker (`/sticker`) dan pembuatan quote gambar (`/qwa`).
* **Media**: Pengiriman file dan link media (`/image`, `/video`, `/audio`).
* **Owner (Pemilik)**: Manajemen bot level tinggi (e.g. `/presence`, `/selfmode`, `/broadcast`, `/aplug`, `/dplug`).
* **Penyimpanan (Storage)**: Log riwayat pesan (`/history`).

---

## 📜 Lisensi & Aturan Penggunaan

Proyek ini dilisensikan di bawah **Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)**.

* ❌ **DILARANG UNTUK DIJUAL KEMBALI (PROHIBITED FOR RESALE)**.
* ❌ Dilarang mengambil keuntungan komersial dari distribusi kode ini tanpa izin tertulis.
* 🏷️ Wajib mencantumkan atribusi/kredit kepada pembuat asli serta library **Zaileys**.

---

## 💖 Penghargaan (Credits)

Terima kasih sebesar-besarnya kepada:
* **[Zaileys](https://github.com/zeative/zaileys)** oleh [zaadevofc](https://github.com/zaadevofc) sebagai library wrapper WhatsApp API utama bot ini.
* **[Baileys](https://github.com/WhiskeySockets/Baileys)** sebagai engine WhatsApp API mendasar.
