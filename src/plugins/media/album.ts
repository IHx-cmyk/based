import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const albumPlugin: Plugin = {
  name: 'album',
  setup(client: Client) {
    client.command('album', async (ctx) => {
      try {
        await ctx.reply('⏳ Mengirim album media...');
        await client.send(ctx.message().key.remoteJid!).album([
          { type: 'image', src: 'https://picsum.photos/400/400', caption: 'Gambar 1' },
          { type: 'image', src: 'https://picsum.photos/401/401', caption: 'Gambar 2' }
        ]);
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengirim album: ${err.message || err}`);
      }
    });
  }
};
