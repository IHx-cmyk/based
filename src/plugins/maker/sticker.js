import { definePlugin, Media } from 'zaileys';
import { downloadMediaMessage } from 'baileys';
export default definePlugin({
    name: 'sticker',
    setup(ctx) {
        ctx.command('sticker|s', async (c) => {
            let buffer;
            if (c.media && 'buffer' in c.media) {
                try {
                    buffer = await c.media.buffer();
                }
                catch (err) {
                    await c.reply(`❌ Gagal mengambil gambar: ${err.message || err}`);
                    return;
                }
            }
            if (!buffer) {
                const quoted = await c.replied();
                if (quoted) {
                    const rawMsg = quoted.message();
                    const chatType = quoted.chatType;
                    if (chatType === 'image' || chatType === 'video' || chatType === 'sticker') {
                        try {
                            buffer = await downloadMediaMessage(rawMsg, 'buffer', {});
                        }
                        catch (err) {
                            await c.reply(`❌ Gagal mendownload media dari reply: ${err.message || err}`);
                            return;
                        }
                    }
                }
            }
            if (!buffer) {
                await c.reply('Kirim atau reply gambar dulu');
                return;
            }
            try {
                const sticker = await new Media(buffer).sticker.create();
                await ctx.client.send(c.roomId ?? c.senderId).sticker(sticker);
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                await c.reply(`❌ Gagal bikin stiker: ${message}`);
            }
        });
    }
});
