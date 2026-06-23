import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const tagallPlugin: Plugin = {
  name: 'tagall',
  setup(client: Client) {
    client.command('tagall|everyone', async (ctx) => {
      if (!ctx.isGroup) {
        await ctx.reply('⚠️ Perintah ini hanya bisa digunakan di dalam grup.');
        return;
      }
      
      try {
        const metadata = await client.group.metadata(ctx.message().key.remoteJid!);
        const participants = metadata.participants;
        
        let message = `📢 *PENGUMUMAN / TAG ALL* 📢\n\n`;
        const jids: string[] = [];
        
        for (const p of participants) {
          message += `👥 @${p.id.split('@')[0]}\n`;
          jids.push(p.id);
        }
        
        if (ctx.args.length > 0) {
          message += `\n💬 *Pesan:* ${ctx.args.join(' ')}`;
        }
        
        await client.send(ctx.message().key.remoteJid!).text(message).mentions(jids);
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengambil daftar anggota: ${err.message || err}`);
      }
    });
  }
};
