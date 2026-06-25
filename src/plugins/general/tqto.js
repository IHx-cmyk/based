import { definePlugin } from 'zaileys';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

export default definePlugin({
  name: 'tqto',
  setup(ctx) {
    ctx.command('tqto|thanksto', async (c) => {
      const bgPath = path.join(process.cwd(), 'src/source/background.jpg');
      const bgBuffer = existsSync(bgPath) ? readFileSync(bgPath) : undefined;
      const remoteJid = c.roomId ?? c.senderId ?? c.message().key.remoteJid;

      try {
        await ctx.client.send(remoteJid).carousel(
          [
            {
              title: '✨ SHNNY BOT ✨',
              subtitle: 'WhatsApp Modular Bot',
              body: 'Terima kasih kepada seluruh kontributor, pengembang framework.',
              footer: 'Halaman 1 dari 4',
              image: bgBuffer,
              buttons: [
                { type: 'url', text: 'GitHub Owner 👤', url: 'https://github.com/IHx-cmyk/based' }
              ]
            },
            {
              title: '📦 ZAILEYS FRAMEWORK',
              subtitle: 'Modern & Modular Framework',
              body: 'Dibuat oleh Zeative. Framework modular WhatsApp berbasis Baileys yang mempermudah pembuatan bot modular dengan efisiensi tinggi.',
              footer: 'Halaman 2 dari 4',
              buttons: [
                { type: 'url', text: 'GitHub Zaileys 🌐', url: 'https://github.com/zeative/zaileys' }
              ]
            },
            {
              title: '🌐 ZPI REST API',
              subtitle: 'Free & Premium API Provider',
              body: 'Terima kasih kepada penyedia API Zpi (zpi.web.id) ',
              footer: 'Halaman 3 dari 4',
              buttons: [
                { type: 'url', text: 'Situs ZPI API 🌐', url: 'https://zpi.my.id' }
              ]
            },
            {
              title: '🤖 GOOGLE GEMINI',
              subtitle: 'AI Assistant & Code Debugger',
              body: 'Selalu siap mengawasi performa, serta memburu bug (debug & checking error) agar bot tetap stabil dan responsif.',
              footer: 'Halaman 4 dari 4'
            }
          ],
          { text: '✨ *THANKS TO (KONTRIBUTOR & KREDIT)* ✨\n\nGeser kartu di bawah untuk melihat detail kredit:' }
        );
      } catch (err) {
        console.error('❌ Error sending tqto carousel:', err);
        const textFallback = `✨ *THANKS TO (KREDIT)* ✨

1. *Zeative (Zaileys)*
   - Pembuat Framework modular WhatsApp.
   - https://github.com/zeative/zaileys

2. *Owner Zpi*
   - Penyedia ZPI API.
   - https://zpi.my.id

3. *Google Gemini*
   - AI Assistant: Debug & Checking Error.

4. *Shnny*
   - Owner & Developer Utama bot ini.

Terima kasih atas segala dukungan dan kontribusinya! ❤️`;
        await c.reply(textFallback);
      }
    });
  }
});