import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const groupinfoPlugin: Plugin = {
  name: 'groupinfo',
  setup(client: Client) {
    client.command('groupinfo|ginfo', async (ctx) => {
      if (!ctx.isGroup) {
        await ctx.reply('⚠️ Perintah ini hanya bisa digunakan di dalam grup.');
        return;
      }
      
      try {
        const metadata = await client.group.metadata(ctx.message().key.remoteJid!);
        const creationDate = metadata.creation 
          ? new Date(metadata.creation * 1000).toLocaleString('id-ID')
          : 'Tidak diketahui';
        
        const infoMessage = `🏢 *INFORMASI GRUP* 🏢\n\n` +
          `• *Nama Grup:* ${metadata.subject}\n` +
          `• *Deskripsi:* ${metadata.desc || 'Tidak ada deskripsi'}\n` +
          `• *ID Grup:* ${metadata.id}\n` +
          `• *Pembuat:* @${(metadata.owner || '').split('@')[0]}\n` +
          `• *Dibuat Pada:* ${creationDate}\n` +
          `• *Jumlah Anggota:* ${metadata.participants.length}\n` +
          `• *Hanya Admin Bisa Kirim Pesan:* ${metadata.announce ? 'Ya' : 'Tidak'}\n` +
          `• *Hanya Admin Bisa Edit Info:* ${metadata.restrict ? 'Ya' : 'Tidak'}`;
          
        await client.send(ctx.message().key.remoteJid!)
          .text(infoMessage)
          .reply(ctx.message())
          .mentions(metadata.owner ? [metadata.owner] : []);
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengambil informasi grup: ${err.message || err}`);
      }
    });
  }
};
