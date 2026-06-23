import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const listPlugin: Plugin = {
  name: 'list',
  setup(client: Client) {
    client.command('list', async (ctx) => {
      await client.send(ctx.message().key.remoteJid!).list({
        title: 'Menu List Interaktif',
        description: 'Silakan pilih opsi dari menu daftar di bawah ini:',
        buttonText: 'Lihat Opsi 📋',
        footerText: 'Zaileys Bot Framework',
        sections: [
          {
            title: 'Layanan Utama',
            rows: [
              { id: 'opt_profile', title: 'Cek Profil', description: 'Lihat profil pengguna Anda' },
              { id: 'opt_ping', title: 'Cek Ping', description: 'Uji latensi koneksi bot' }
            ]
          },
          {
            title: 'Bantuan & Info',
            rows: [
              { id: 'opt_help', title: 'Menu Bantuan', description: 'Tampilkan panduan perintah lengkap' },
              { id: 'opt_info', title: 'Tentang Zaileys', description: 'Informasi tentang framework Zaileys' }
            ]
          }
        ]
      });
    });
  }
};
