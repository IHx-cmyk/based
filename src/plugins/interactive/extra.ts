import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const extraPlugin: Plugin = {
  name: 'interactive-extra',
  setup(client: Client) {
    // Command: /template
    client.command('template', async (ctx) => {
      try {
        await client.send(ctx.message().key.remoteJid!).template({
          header: 'Zaileys Premium',
          body: 'Terima kasih telah menggunakan Zaileys Bot Framework. Ini adalah template pesan native.',
          footer: 'Powered by zaadevofc',
          buttons: [
            { id: 't_yes', text: 'Suka 👍' },
            { id: 't_no', text: 'Biasa saja 😐' }
          ]
        });
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengirim template: ${err.message || err}`);
      }
    });

    // Command: /bottomsheet
    client.command('bottomsheet', async (ctx) => {
      try {
        await client.send(ctx.message().key.remoteJid!).buttons(
          [
            { id: 's1', text: 'Pilihan Pertama' },
            { id: 's2', text: 'Pilihan Kedua' },
            { id: 's3', text: 'Pilihan Ketiga' },
            { id: 's4', text: 'Pilihan Keempat' },
            { id: 's5', text: 'Pilihan Kelima' }
          ],
          {
            text: 'Ketuk tombol di bawah untuk melihat pilihan lengkap di Bottom Sheet:',
            bottomSheet: {
              listTitle: 'Daftar Layanan Lengkap',
              buttonTitle: 'Lihat Semua Layanan',
              buttonsLimit: 2
            }
          }
        );
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengirim bottomsheet: ${err.message || err}`);
      }
    });

    // Command: /limitedoffer
    client.command('limitedoffer', async (ctx) => {
      try {
        await client.send(ctx.message().key.remoteJid!).buttons(
          [
            { type: 'url', text: 'Klaim Diskon 🎟️', url: 'https://github.com/zeative/zaileys' },
            { type: 'copy', text: 'Salin Kode Kupon', code: 'WAFEST2026' }
          ],
          {
            title: '⚡ PROMO TERBATAS ⚡',
            text: 'Dapatkan diskon 80% untuk pembelian langganan tahunan.',
            limitedTimeOffer: {
              text: 'Penawaran berakhir dalam:',
              copyCode: 'WAFEST2026',
              expiresAt: Math.floor(Date.now() / 1000) + 1800 // 30 menit dari sekarang
            }
          }
        );
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengirim limitedoffer: ${err.message || err}`);
      }
    });

    // Command: /reminder
    client.command('reminder', async (ctx) => {
      try {
        await client.send(ctx.message().key.remoteJid!).buttons(
          [
            { type: 'reminder', text: 'Ingatkan Saya ⏰', id: 'remind_event_1' },
            { type: 'cancel-reminder', text: 'Batalkan Pengingat ❌' }
          ],
          {
            title: '📅 Pengingat Kegiatan',
            text: 'Acara Web seminar Zaileys v4 akan dimulai besok pagi pukul 09.00 WIB.'
          }
        );
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengirim reminder: ${err.message || err}`);
      }
    });

    // Command: /location
    client.command('location', async (ctx) => {
      try {
        await client.send(ctx.message().key.remoteJid!).buttons(
          [
            { type: 'location', text: 'Bagikan Lokasi Saya 📍' },
            { type: 'address', text: 'Lengkapi Alamat Kirim 🏠', id: 'addr_checkout_1' }
          ],
          {
            title: '📦 Pengiriman Pesanan',
            text: 'Untuk menyelesaikan checkout belanjaan, harap bagikan lokasi GPS atau isi alamat lengkap Anda di bawah.'
          }
        );
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengirim location request: ${err.message || err}`);
      }
    });
  }
};
