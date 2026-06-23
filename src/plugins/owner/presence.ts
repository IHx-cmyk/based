import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const presencePlugin: Plugin = {
  name: 'presence',
  setup(client: Client) {
    client.command('presence', async (ctx) => {
      const mode = ctx.args[0];
      if (!mode) {
        await ctx.reply('⚠️ Mode kehadiran tidak ditentukan. Silakan pilih: online, offline, typing, recording (contoh: /presence online).');
        return;
      }

      try {
        if (mode === 'online') {
          await client.presence.online();
          await ctx.reply('✅ Status Anda sekarang *Online*.');
        } else if (mode === 'offline') {
          await client.presence.offline();
          await ctx.reply('✅ Status Anda sekarang *Offline*.');
        } else if (mode === 'typing') {
          await client.presence.typing(ctx.message().key.remoteJid!, 5000);
          await ctx.reply('✅ Mengetik selama 5 detik...');
        } else if (mode === 'recording') {
          await client.presence.recording(ctx.message().key.remoteJid!, 5000);
          await ctx.reply('✅ Merekam audio selama 5 detik...');
        } else {
          await ctx.reply('⚠️ Mode tidak dikenal. Gunakan: online, offline, typing, recording.');
        }
      } catch (err: any) {
        await ctx.reply(`❌ Gagal memperbarui kehadiran: ${err.message || err}`);
      }
    });
  }
};
