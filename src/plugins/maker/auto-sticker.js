import { definePlugin } from 'zaileys';
export default definePlugin({
    name: 'media-auto-sticker',
    setup(ctx) {
        ctx.on('image', async (c) => {
            const caption = c.text?.trim().toLowerCase();
            if (caption === '/sticker' || caption === '/s') {
                if (c.media && 'buffer' in c.media) {
                    try {
                        await c.reply('⏳ Sedang memproses stiker Anda...');
                        const buffer = await c.media.buffer();
                        await ctx.client.send(c.message().key.remoteJid).sticker(buffer).reply(c.message());
                    }
                    catch (err) {
                        await c.reply(`❌ Gagal membuat stiker: ${err.message || err}`);
                    }
                }
            }
        });
    }
});
