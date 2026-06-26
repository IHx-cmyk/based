import { definePlugin } from 'zaileys';

export default definePlugin({
    name: 'session-manager',
    setup(ctx) {
        ctx.command('clearsession|logout', async (c) => {
            const isOwner = await c.citation.authors();
            if (!isOwner) {
                await c.reply('⚠️ Perintah ini hanya bisa dijalankan oleh Owner bot.');
                return;
            }

            try {
                await c.reply('⏳ Menghapus session, memutuskan koneksi, dan mematikan bot...');
                // Tunggu sebentar agar pesan status terkirim terlebih dahulu
                await new Promise((resolve) => setTimeout(resolve, 2000));
                
                // Lakukan logout bersih dari WhatsApp & hapus credentials local
                await ctx.client.logout();
                
                console.log('✅ Session default dibersihkan dan koneksi diputuskan.');
                
                // Matikan proses secara bersih agar process manager (seperti pm2) merestart bot dalam mode pairing/QR
                process.exit(0);
            } catch (err) {
                await c.reply(`❌ Gagal membersihkan session: ${err.message || err}`);
            }
        });
    }
});
