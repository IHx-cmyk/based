import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const audioPlugin: Plugin = {
  name: 'audio',
  setup(client: Client) {
    client.command('audio', async (ctx) => {
      const url = ctx.args[0];
      if (!url) {
        await ctx.reply('⚠️ Silakan masukkan URL audio.');
        return;
      }

      try {
        await ctx.reply('⏳ Mengunduh dan mengirim audio...');
        await client.send(ctx.message().key.remoteJid!).audio(url, { ptt: false });
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengirim audio: ${err.message || err}`);
      }
    });
  }
};
