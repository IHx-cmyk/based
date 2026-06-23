import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const autoStickerPlugin: Plugin = {
  name: 'media-auto-sticker',
  setup(client: Client) {
    client.on('image', async (ctx) => {
      const caption = ctx.text?.trim().toLowerCase();
      if (caption === '/sticker' || caption === '/s') {
        if (ctx.media && 'buffer' in ctx.media) {
          try {
            await ctx.reply('⏳ Sedang memproses stiker Anda...');
            const buffer = await ctx.media.buffer();
            await client.send(ctx.message().key.remoteJid!).sticker(buffer).reply(ctx.message());
          } catch (err: any) {
            await ctx.reply(`❌ Gagal membuat stiker: ${err.message || err}`);
          }
        }
      }
    });
  }
};
