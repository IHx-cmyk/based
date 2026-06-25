import { definePlugin } from 'zaileys';
import { config } from '../../types.js';
export default definePlugin({
    name: 'find-sitekey',
    setup(ctx) {
        ctx.command('findsitekey|sitekey', async (c) => {
            const url = c.args[0];
            if (!url) {
                await c.reply('⚠️ Silakan masukkan URL target.\nContoh: */sitekey https://recaptcha-demo.appspot.com/recaptcha-v2-checkbox.php*');
                return;
            }
            await c.reply('⏳ Sedang mencari sitekey untuk URL tersebut...');
            try {
                const apiUrl = `https://api.theresav.biz.id/bypass/find-sitekey?url=${encodeURIComponent(url)}&apikey=${encodeURIComponent(config.theresav)}`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`API HTTP error status: ${response.status}`);
                }
                const data = await response.json();
                if (data.status && data.siteKey) {
                    const replyText = `🔍 *CAPTCHA SITEKEY FOUND*\n\n` +
                        `• *Target URL:* ${url}\n` +
                        `• *SiteKey:* \`${data.siteKey}\``;
                    await c.reply(replyText);
                }
                else {
                    await c.reply(`❌ Gagal mendapatkan sitekey. ${data.message || 'Sitekey tidak ditemukan di halaman tersebut.'}`);
                }
            }
            catch (err) {
                console.error('❌ Error Find Sitekey API:', err);
                await c.reply(`❌ Terjadi kesalahan saat memanggil API: ${err.message || err}`);
            }
        });
    }
});
