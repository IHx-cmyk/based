import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const imagePlugin: Plugin = {
  name: 'image',
  setup(client: Client) {
    client.command('image', async (ctx) => {
      const url = ctx.args[0];
      if (!url) {
        await ctx.reply('⚠️ Silakan masukkan URL gambar. Contoh: /image https://picsum.photos/500/500');
        return;
      }

      try {
        await ctx.reply('⏳ Mengunduh dan mengirim gambar...');
        await client.send(ctx.message().key.remoteJid!).image(url, { caption: 'Ini gambar yang Anda minta.' });
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengirim gambar: ${err.message || err}`);
      }
    });
  }
};
