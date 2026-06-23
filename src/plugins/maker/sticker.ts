import { Client, Media, type MessageContext } from 'zaileys';
import { Plugin } from '../../types.js';
import { downloadMediaMessage } from 'baileys';

export const stickerPlugin: Plugin = {
  name: 'sticker',
  setup(client: Client) {
    client.command('sticker|s', async (ctx: MessageContext & { reply: (text: string) => Promise<unknown> }) => {
      let buffer: Buffer | undefined;

      if (ctx.media && 'buffer' in ctx.media) {
        try {
          buffer = await ctx.media.buffer();
        } catch (err: any) {
          await ctx.reply(`❌ Gagal mengambil gambar: ${err.message || err}`);
          return;
        }
      }

      if (!buffer) {
        const quoted = await ctx.replied();
        if (quoted) {
          const rawMsg = quoted.message();
          const chatType = quoted.chatType;
          if (chatType === 'image' || chatType === 'video' || chatType === 'sticker') {
            try {
              buffer = await downloadMediaMessage(rawMsg, 'buffer', {});
            } catch (err: any) {
              await ctx.reply(`❌ Gagal mendownload media dari reply: ${err.message || err}`);
              return;
            }
          }
        }
      }

      if (!buffer) {
        await ctx.reply('Kirim atau reply gambar dulu');
        return;
      }

      try {
        const sticker = await new Media(buffer).sticker.create();
        await client.send(ctx.roomId ?? ctx.senderId).sticker(sticker);
      } catch (err: any) {
        const message = err instanceof Error ? err.message : String(err);
        await ctx.reply(`❌ Gagal bikin stiker: ${message}`);
      }
    });
  }
};