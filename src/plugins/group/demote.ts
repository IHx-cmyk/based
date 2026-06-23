import { Client } from 'zaileys';
import { Plugin } from '../../types.js';
import { resolveJids } from '../../utils/resolve-jids.js';

export const demotePlugin: Plugin = {
  name: 'demote',
  setup(client: Client) {
    client.command('demote', async (ctx) => {
      if (!ctx.isGroup) {
        await ctx.reply('⚠️ Perintah ini hanya bisa digunakan di dalam grup.');
        return;
      }
      
      const jidsToDemote = await resolveJids(ctx, client);
      if (jidsToDemote.length === 0) {
        await ctx.reply('⚠️ Silakan mention user atau reply pesan user yang ingin diturunkan jabatannya.');
        return;
      }
      
      try {
        await client.group.demote(ctx.message().key.remoteJid!, jidsToDemote);
        await client.send(ctx.message().key.remoteJid!)
          .text(`✅ Berhasil menurunkan jabatan ${jidsToDemote.map(j => `@${j.split('@')[0]}`).join(', ')} dari Admin.`)
          .reply(ctx.message())
          .mentions(jidsToDemote);
      } catch (err: any) {
        await ctx.reply(`❌ Gagal menurunkan jabatan: ${err.message || err}`);
      }
    });
  }
};
