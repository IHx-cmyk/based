import { definePlugin } from 'zaileys';
export default definePlugin({
    name: 'presence',
    setup(ctx) {
        ctx.command('presence', async (c) => {
            const mode = c.args[0];
            if (!mode) {
                await c.reply('⚠️ Mode kehadiran tidak ditentukan. Silakan pilih: online, offline, typing, recording (contoh: /presence online).');
                return;
            }
            try {
                if (mode === 'online') {
                    await ctx.client.presence.online();
                    await c.reply('✅ Status Anda sekarang *Online*.');
                }
                else if (mode === 'offline') {
                    await ctx.client.presence.offline();
                    await c.reply('✅ Status Anda sekarang *Offline*.');
                }
                else if (mode === 'typing') {
                    await ctx.client.presence.typing(c.message().key.remoteJid, 5000);
                    await c.reply('✅ Mengetik selama 5 detik...');
                }
                else if (mode === 'recording') {
                    await ctx.client.presence.recording(c.message().key.remoteJid, 5000);
                    await c.reply('✅ Merekam audio selama 5 detik...');
                }
                else {
                    await c.reply('⚠️ Mode tidak dikenal. Gunakan: online, offline, typing, recording.');
                }
            }
            catch (err) {
                await c.reply(`❌ Gagal memperbarui kehadiran: ${err.message || err}`);
            }
        });
    }
});
