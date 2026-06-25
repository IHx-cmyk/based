import { definePlugin } from 'zaileys';
import { resolveJids } from '../../utils/resolve-jids.js';
export default definePlugin({
    name: 'kick',
    setup(ctx) {
        ctx.command('kick|remove', async (c) => {
            if (!c.isGroup) {
                await c.reply('⚠️ Perintah ini hanya bisa digunakan di dalam grup.');
                return;
            }
            const jidsToKick = await resolveJids(c, ctx.client);
            if (jidsToKick.length === 0) {
                await c.reply('⚠️ Silakan mention user atau reply pesan user yang ingin dikeluarkan.');
                return;
            }
            try {
                await ctx.client.group.removeMember(c.message().key.remoteJid, jidsToKick);
                await ctx.client.send(c.message().key.remoteJid)
                    .text(`✅ Berhasil mengeluarkan ${jidsToKick.map(j => `@${j.split('@')[0]}`).join(', ')} dari grup.`)
                    .reply(c.message())
                    .mentions(jidsToKick);
            }
            catch (err) {
                await c.reply(`❌ Gagal mengeluarkan anggota: ${err.message || err}`);
            }
        });
    }
});
