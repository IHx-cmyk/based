import { definePlugin } from 'zaileys';
import { resolveJids } from '../../utils/resolve-jids.js';
export default definePlugin({
    name: 'demote',
    setup(ctx) {
        ctx.command('demote', async (c) => {
            if (!c.isGroup) {
                await c.reply('⚠️ Perintah ini hanya bisa digunakan di dalam grup.');
                return;
            }
            const jidsToDemote = await resolveJids(c, ctx.client);
            if (jidsToDemote.length === 0) {
                await c.reply('⚠️ Silakan mention user atau reply pesan user yang ingin diturunkan jabatannya.');
                return;
            }
            try {
                await ctx.client.group.demote(c.message().key.remoteJid, jidsToDemote);
                await ctx.client.send(c.message().key.remoteJid)
                    .text(`✅ Berhasil menurunkan jabatan ${jidsToDemote.map(j => `@${j.split('@')[0]}`).join(', ')} dari Admin.`)
                    .reply(c.message())
                    .mentions(jidsToDemote);
            }
            catch (err) {
                await c.reply(`❌ Gagal menurunkan jabatan: ${err.message || err}`);
            }
        });
    }
});
