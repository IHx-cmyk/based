import { Client } from 'zaileys';
import { Plugin } from '../../types.js';
import { resolveJids } from '../../utils/resolve-jids.js';

export const addPlugin: Plugin = {
  name: 'add',
  setup(client: Client) {
    client.command('add', async (ctx) => {
      if (!ctx.isGroup) {
        await ctx.reply('⚠️ Perintah ini hanya bisa digunakan di dalam grup.');
        return;
      }
      
      const jidsToAdd = await resolveJids(ctx, client);
      if (jidsToAdd.length === 0) {
        await ctx.reply('⚠️ Silakan masukkan nomor HP atau tag user yang ingin ditambahkan (contoh: /add 628123456789 atau /add @user).');
        return;
      }
      
      try {
        await client.group.addMember(ctx.message().key.remoteJid!, jidsToAdd);
        await client.send(ctx.message().key.remoteJid!)
          .text(`✅ Berhasil menambahkan ${jidsToAdd.map(j => `@${j.split('@')[0]}`).join(', ')} ke dalam grup.`)
          .reply(ctx.message())
          .mentions(jidsToAdd);
      } catch (err: any) {
        await ctx.reply(`❌ Gagal menambahkan anggota: ${err.message || err}`);
      }
    });
  }
};
