import { definePlugin } from 'zaileys';
import { publicMode, setPublicMode } from './middleware.js';
export default definePlugin({
    name: 'selfmode',
    setup(ctx) {
        ctx.command('selfmode', async (c) => {
            const isOwner = await c.citation.authors();
            const mode = c.args[0]?.toLowerCase();
            if (!mode) {
                await c.reply(`🤖 *STATUS AKSES BOT*\n\n` +
                    `• Mode aktif: *${publicMode ? 'Public' : 'Self (Owner Only)'}*\n\n` +
                    `ℹ️ *Cara Mengubah Mode (Hanya Owner):*\n` +
                    `• */selfmode public* - Aktifkan mode Publik\n` +
                    `• */selfmode self* - Aktifkan mode Mandiri/Owner`);
                return;
            }
            if (!isOwner) {
                await c.reply('⚠️ Perintah ini hanya bisa dijalankan oleh Owner bot.');
                return;
            }
            if (mode === 'self' || mode === 'off' || mode === 'false') {
                setPublicMode(false);
                await c.reply('🔒 Mode *Self* diaktifkan. Sekarang perintah bot hanya merespon Owner saja.');
            }
            else if (mode === 'public' || mode === 'on' || mode === 'true') {
                setPublicMode(true);
                await c.reply('🔓 Mode *Public* diaktifkan. Sekarang perintah bot bisa digunakan oleh semua orang.');
            }
            else {
                await c.reply('⚠️ Mode tidak dikenal. Gunakan: `/selfmode self` atau `/selfmode public`');
            }
        });
    }
});
