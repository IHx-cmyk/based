import { Client } from 'zaileys';
import { Plugin } from '../../types.js';
import { resolveJids } from '../../utils/resolve-jids.js';

export const kickPlugin: Plugin = {
  name: 'kick',
  setup(client: Client) {
    client.command('kick|remove', async (ctx) => {
      if (!ctx.isGroup) {
        await ctx.reply('⚠️ Perintah ini hanya bisa digunakan di dalam grup.');
        return;
      }
      
      const jidsToKick = await resolveJids(ctx, client);
      if (jidsToKick.length === 0) {
        await ctx.reply('⚠️ Silakan mention user atau reply pesan user yang ingin dikeluarkan.');
        return;
      }
      
      try {
        await client.group.removeMember(ctx.message().key.remoteJid!, jidsToKick);
        await client.send(ctx.message().key.remoteJid!)
          .text(`✅ Berhasil mengeluarkan ${jidsToKick.map(j => `@${j.split('@')[0]}`).join(', ')} dari grup.`)
          .reply(ctx.message())
          .mentions(jidsToKick);
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengeluarkan anggota: ${err.message || err}`);
      }
    });
  }
};
