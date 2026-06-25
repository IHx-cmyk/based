import { definePlugin } from 'zaileys';
import { resolveJids } from '../../utils/resolve-jids.js';
export default definePlugin({
    name: 'promote',
    setup(ctx) {
        ctx.command('promote', async (c) => {
            if (!c.isGroup) {
                await c.reply('⚠️ Perintah ini hanya bisa digunakan di dalam grup.');
                return;
            }
            const jidsToPromote = await resolveJids(c, ctx.client);
            if (jidsToPromote.length === 0) {
                await c.reply('⚠️ Silakan mention user atau reply pesan user yang ingin dipromosikan sebagai admin.');
                return;
            }
            try {
                await ctx.client.group.promote(c.message().key.remoteJid, jidsToPromote);
                await ctx.client.send(c.message().key.remoteJid)
                    .text(`✅ Berhasil mempromosikan ${jidsToPromote.map(j => `@${j.split('@')[0]}`).join(', ')} menjadi Admin.`)
                    .reply(c.message())
                    .mentions(jidsToPromote);
            }
            catch (err) {
                await c.reply(`❌ Gagal mempromosikan: ${err.message || err}`);
            }
        });
    }
});
