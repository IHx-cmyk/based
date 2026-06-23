import { Client } from 'zaileys';
import { Plugin } from '../../types.js';
import { resolveJids } from '../../utils/resolve-jids.js';

export const promotePlugin: Plugin = {
  name: 'promote',
  setup(client: Client) {
    client.command('promote', async (ctx) => {
      if (!ctx.isGroup) {
        await ctx.reply('⚠️ Perintah ini hanya bisa digunakan di dalam grup.');
        return;
      }
      
      const jidsToPromote = await resolveJids(ctx, client);
      if (jidsToPromote.length === 0) {
        await ctx.reply('⚠️ Silakan mention user atau reply pesan user yang ingin dipromosikan sebagai admin.');
        return;
      }
      
      try {
        await client.group.promote(ctx.message().key.remoteJid!, jidsToPromote);
        await client.send(ctx.message().key.remoteJid!)
          .text(`✅ Berhasil mempromosikan ${jidsToPromote.map(j => `@${j.split('@')[0]}`).join(', ')} menjadi Admin.`)
          .reply(ctx.message())
          .mentions(jidsToPromote);
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mempromosikan: ${err.message || err}`);
      }
    });
  }
};
