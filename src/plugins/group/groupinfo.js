import { definePlugin } from 'zaileys';
export default definePlugin({
    name: 'groupinfo',
    setup(ctx) {
        ctx.command('groupinfo|ginfo', async (c) => {
            if (!c.isGroup) {
                await c.reply('⚠️ Perintah ini hanya bisa digunakan di dalam grup.');
                return;
            }
            try {
                const metadata = await ctx.client.group.metadata(c.message().key.remoteJid);
                const creationDate = metadata.creation
                    ? new Date(metadata.creation * 1000).toLocaleString('id-ID')
                    : 'Tidak diketahui';
                const infoMessage = `🏢 *INFORMASI GRUP* 🏢\n\n` +
                    `• *Nama Grup:* ${metadata.subject}\n` +
                    `• *Deskripsi:* ${metadata.desc || 'Tidak ada deskripsi'}\n` +
                    `• *ID Grup:* ${metadata.id}\n` +
                    `• *Pembuat:* @${(metadata.owner || '').split('@')[0]}\n` +
                    `• *Dibuat Pada:* ${creationDate}\n` +
                    `• *Jumlah Anggota:* ${metadata.participants.length}\n` +
                    `• *Hanya Admin Bisa Kirim Pesan:* ${metadata.announce ? 'Ya' : 'Tidak'}\n` +
                    `• *Hanya Admin Bisa Edit Info:* ${metadata.restrict ? 'Ya' : 'Tidak'}`;
                await ctx.client.send(c.message().key.remoteJid)
                    .text(infoMessage)
                    .reply(c.message())
                    .mentions(metadata.owner ? [metadata.owner] : []);
            }
            catch (err) {
                await c.reply(`❌ Gagal mengambil informasi grup: ${err.message || err}`);
            }
        });
    }
});
