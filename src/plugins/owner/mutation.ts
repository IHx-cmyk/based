import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const mutationPlugin: Plugin = {
  name: 'mutation',
  setup(client: Client) {
    // Command: /delete
    client.command('delete|del', async (ctx) => {
      try {
        const quoted = await ctx.replied();
        if (!quoted) {
          await ctx.reply('⚠️ Silakan reply pesan yang ingin Anda hapus.');
          return;
        }
        await client.delete(quoted.message().key);
      } catch (err: any) {
        await ctx.reply(`❌ Gagal menghapus pesan: ${err.message || err}`);
      }
    });

    // Command: /react
    client.command('react', async (ctx) => {
      try {
        const emoji = ctx.args[0] || '👍';
        const quoted = await ctx.replied();
        const targetKey = quoted ? quoted.message().key : ctx.message().key;
        
        await client.react(targetKey, emoji);
      } catch (err: any) {
        await ctx.reply(`❌ Gagal memberikan reaksi: ${err.message || err}`);
      }
    });

    // Command: /edit
    client.command('edit', async (ctx) => {
      try {
        const text = ctx.args.join(' ');
        const quoted = await ctx.replied();
        
        if (quoted && quoted.message().key.fromMe) {
          if (!text) {
            await ctx.reply('⚠️ Silakan masukkan teks baru untuk mengedit pesan ini.');
            return;
          }
          await client.edit(quoted.message().key).text(text);
        } else {
          // Demo editing a message sent by the command
          const key = await ctx.reply('⏳ Memproses...');
          await new Promise(r => setTimeout(r, 1000));
          await client.edit(key).text('✅ Pesan berhasil di-edit! ✨');
        }
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengedit pesan: ${err.message || err}`);
      }
    });
  }
};
