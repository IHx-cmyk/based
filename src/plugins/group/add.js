import { definePlugin } from 'zaileys';
import { resolveJids } from '../../utils/resolve-jids.js';
export default definePlugin({
    name: 'add',
    setup(ctx) {
        ctx.command('add', async (c) => {
            if (!c.isGroup) {
                await c.reply('⚠️ Perintah ini hanya bisa digunakan di dalam grup.');
                return;
            }
            const jidsToAdd = await resolveJids(c, ctx.client);
            if (jidsToAdd.length === 0) {
                await c.reply('⚠️ Silakan masukkan nomor HP atau tag user yang ingin ditambahkan (contoh: /add 628123456789 atau /add @user).');
                return;
            }
            try {
                await ctx.client.group.addMember(c.message().key.remoteJid, jidsToAdd);
                await ctx.client.send(c.message().key.remoteJid)
                    .text(`✅ Berhasil menambahkan ${jidsToAdd.map(j => `@${j.split('@')[0]}`).join(', ')} ke dalam grup.`)
                    .reply(c.message())
                    .mentions(jidsToAdd);
            }
            catch (err) {
                await c.reply(`❌ Gagal menambahkan anggota: ${err.message || err}`);
            }
        });
    }
});
