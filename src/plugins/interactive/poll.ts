import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const pollPlugin: Plugin = {
  name: 'poll',
  setup(client: Client) {
    client.command('poll', async (ctx) => {
      const input = ctx.args.join(' ');
      if (!input.includes('|')) {
        await ctx.reply('⚠️ Format salah. Contoh: /poll Siapa pemenang pemilu? | Calon A | Calon B | Calon C');
        return;
      }

      const parts = input.split('|').map(p => p.trim());
      const question = parts[0];
      const options = parts.slice(1);

      if (options.length < 2) {
        await ctx.reply('⚠️ Polling minimal membutuhkan 2 opsi pilihan.');
        return;
      }

      try {
        await client.send(ctx.message().key.remoteJid!).poll(question, options, {
          multipleChoice: false
        });
      } catch (err: any) {
        await ctx.reply(`❌ Gagal membuat polling: ${err.message || err}`);
      }
    });
  }
};
