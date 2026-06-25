import { definePlugin } from 'zaileys';
export default definePlugin({
    name: 'tagall',
    setup(ctx) {
        ctx.command('tagall|everyone', async (c) => {
            if (!c.isGroup) {
                await c.reply('⚠️ Perintah ini hanya bisa digunakan di dalam grup.');
                return;
            }
            try {
                const metadata = await ctx.client.group.metadata(c.message().key.remoteJid);
                const participants = metadata.participants;
                let message = `📢 *PENGUMUMAN / TAG ALL* 📢\n\n`;
                const jids = [];
                for (const p of participants) {
                    message += `👥 @${p.id.split('@')[0]}\n`;
                    jids.push(p.id);
                }
                if (c.args.length > 0) {
                    message += `\n💬 *Pesan:* ${c.args.join(' ')}`;
                }
                await ctx.client.send(c.message().key.remoteJid).text(message).mentions(jids);
            }
            catch (err) {
                await c.reply(`❌ Gagal mengambil daftar anggota: ${err.message || err}`);
            }
        });
    }
});
