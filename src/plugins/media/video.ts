import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const videoPlugin: Plugin = {
  name: 'video',
  setup(client: Client) {
    client.command('video', async (ctx) => {
      const url = ctx.args[0];
      if (!url) {
        await ctx.reply('⚠️ Silakan masukkan URL video.');
        return;
      }

      try {
        await ctx.reply('⏳ Mengunduh dan mengirim video...');
        await client.send(ctx.message().key.remoteJid!).video(url, { caption: 'Ini video yang Anda minta.' });
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengirim video: ${err.message || err}`);
      }
    });
  }
};
