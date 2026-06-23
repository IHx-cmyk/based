import { Client } from 'zaileys';
import { Plugin } from '../../types.js';
import { publicMode, setPublicMode } from './middleware.js';

export const selfModePlugin: Plugin = {
  name: 'selfmode',
  setup(client: Client) {
    client.command('selfmode', async (ctx) => {
      const isOwner = await ctx.citation.authors();
      const mode = ctx.args[0]?.toLowerCase();
      
      if (!mode) {
        await ctx.reply(
          `🤖 *STATUS AKSES BOT*\n\n` +
          `• Mode aktif: *${publicMode ? 'Public' : 'Self (Owner Only)'}*\n\n` +
          `ℹ️ *Cara Mengubah Mode (Hanya Owner):*\n` +
          `• */selfmode public* - Aktifkan mode Publik\n` +
          `• */selfmode self* - Aktifkan mode Mandiri/Owner`
        );
        return;
      }
      
      if (!isOwner) {
        await ctx.reply('⚠️ Perintah ini hanya bisa dijalankan oleh Owner bot.');
        return;
      }
      
      if (mode === 'self' || mode === 'off' || mode === 'false') {
        setPublicMode(false);
        await ctx.reply('🔒 Mode *Self* diaktifkan. Sekarang perintah bot hanya merespon Owner saja.');
      } else if (mode === 'public' || mode === 'on' || mode === 'true') {
        setPublicMode(true);
        await ctx.reply('🔓 Mode *Public* diaktifkan. Sekarang perintah bot bisa digunakan oleh semua orang.');
      } else {
        await ctx.reply('⚠️ Mode tidak dikenal. Gunakan: `/selfmode self` atau `/selfmode public`');
      }
    });
  }
};
