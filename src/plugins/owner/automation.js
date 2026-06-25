import { definePlugin } from 'zaileys';
export default definePlugin({
    name: 'automation',
    setup(ctx) {
        // Command: /broadcast
        ctx.command('broadcast|bc', async (c) => {
            try {
                const text = c.args.join(' ');
                if (!text) {
                    await c.reply('⚠️ Silakan masukkan pesan broadcast. Contoh: /broadcast Halo semuanya!');
                    return;
                }
                // Untuk alasan keamanan, kita broadcast ke ruang obrolan saat ini
                const targets = [c.message().key.remoteJid];
                await c.reply(`⏳ Memulai broadcast ke ${targets.length} obrolan...`);
                const result = await ctx.client.broadcast(targets, (b) => b.text(`📢 *BROADCAST MESSAGE* 📢\n\n${text}`), { rateLimitPerSec: 2 });
                await c.reply(`✅ Broadcast selesai!\n• Sukses: ${result.sent.length}\n• Gagal: ${result.failed.length}`);
            }
            catch (err) {
                await c.reply(`❌ Gagal melakukan broadcast: ${err.message || err}`);
            }
        });
        // Command: /schedule
        ctx.command('schedule', async (c) => {
            try {
                const delaySec = parseInt(c.args[0]);
                const text = c.args.slice(1).join(' ');
                if (isNaN(delaySec) || !text) {
                    await c.reply('⚠️ Format salah. Contoh: /schedule 10 Pesan ini akan dikirim setelah 10 detik.');
                    return;
                }
                const scheduledTime = new Date(Date.now() + delaySec * 1000);
                await c.reply(`⏳ Pesan Anda telah dijadwalkan untuk dikirim dalam ${delaySec} detik (${scheduledTime.toLocaleTimeString('id-ID')}).`);
                await ctx.client.scheduleAt(scheduledTime, (b) => b.text(`⏰ *PESAN TERJADWAL* ⏰\n\n${text}`).reply(c.message()));
            }
            catch (err) {
                await c.reply(`❌ Gagal menjadwalkan pesan: ${err.message || err}`);
            }
        });
    }
});
