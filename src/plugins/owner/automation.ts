import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const automationPlugin: Plugin = {
  name: 'automation',
  setup(client: Client) {
    // Command: /broadcast
    client.command('broadcast|bc', async (ctx) => {
      try {
        const text = ctx.args.join(' ');
        if (!text) {
          await ctx.reply('⚠️ Silakan masukkan pesan broadcast. Contoh: /broadcast Halo semuanya!');
          return;
        }

        // Untuk alasan keamanan, kita broadcast ke ruang obrolan saat ini
        const targets = [ctx.message().key.remoteJid!];
        await ctx.reply(`⏳ Memulai broadcast ke ${targets.length} obrolan...`);
        
        const result = await client.broadcast(
          targets, 
          (b) => b.text(`📢 *BROADCAST MESSAGE* 📢\n\n${text}`), 
          { rateLimitPerSec: 2 }
        );
        
        await ctx.reply(`✅ Broadcast selesai!\n• Sukses: ${result.sent.length}\n• Gagal: ${result.failed.length}`);
      } catch (err: any) {
        await ctx.reply(`❌ Gagal melakukan broadcast: ${err.message || err}`);
      }
    });

    // Command: /schedule
    client.command('schedule', async (ctx) => {
      try {
        const delaySec = parseInt(ctx.args[0]);
        const text = ctx.args.slice(1).join(' ');
        
        if (isNaN(delaySec) || !text) {
          await ctx.reply('⚠️ Format salah. Contoh: /schedule 10 Pesan ini akan dikirim setelah 10 detik.');
          return;
        }

        const scheduledTime = new Date(Date.now() + delaySec * 1000);
        await ctx.reply(`⏳ Pesan Anda telah dijadwalkan untuk dikirim dalam ${delaySec} detik (${scheduledTime.toLocaleTimeString('id-ID')}).`);
        
        await client.scheduleAt(scheduledTime, (b) => 
          b.text(`⏰ *PESAN TERJADWAL* ⏰\n\n${text}`).reply(ctx.message())
        );
      } catch (err: any) {
        await ctx.reply(`❌ Gagal menjadwalkan pesan: ${err.message || err}`);
      }
    });
  }
};
