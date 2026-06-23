import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const historyPlugin: Plugin = {
  name: 'history',
  setup(client: Client) {
    // Helper untuk mengekstrak teks dari WAMessage
    function getMessageText(msg: any): string {
      if (!msg || !msg.message) return '';
      const m = msg.message;
      if (m.conversation) return m.conversation;
      if (m.extendedTextMessage?.text) return m.extendedTextMessage.text;
      if (m.imageMessage?.caption) return `🖼️ [Gambar] ${m.imageMessage.caption}`;
      if (m.videoMessage?.caption) return `📹 [Video] ${m.videoMessage.caption}`;
      if (m.audioMessage) return '🎵 [Audio]';
      if (m.stickerMessage) return '👾 [Stiker]';
      if (m.documentMessage) return '📄 [Dokumen]';
      if (m.pollCreationMessage) return `📊 [Polling] ${m.pollCreationMessage.name}`;
      return '✉️ [Pesan Lain]';
    }

    client.command('history', async (ctx) => {
      try {
        const messages = await client.store.listMessages(ctx.message().key.remoteJid!, { limit: 5 });
        
        if (!messages || messages.length === 0) {
          await ctx.reply('⚠️ Riwayat pesan tidak ditemukan atau kosong.');
          return;
        }

        let response = `⏳ *5 RIWAYAT PESAN TERAKHIR* ⏳\n\n`;
        
        for (let i = 0; i < messages.length; i++) {
          const msg = messages[i];
          const sender = msg.key.fromMe ? 'Bot' : (msg.pushName || 'Pengguna');
          const time = msg.messageTimestamp 
            ? new Date(Number(msg.messageTimestamp) * 1000).toLocaleTimeString('id-ID')
            : 'Tidak diketahui';
          const text = getMessageText(msg);
          
          response += `${i + 1}. *[${time}] ${sender}:* ${text}\n`;
        }

        await ctx.reply(response);
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengambil riwayat pesan: ${err.message || err}`);
      }
    });
  }
};
