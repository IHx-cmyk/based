import { definePlugin } from 'zaileys';
export default definePlugin({
    name: 'mutation',
    setup(ctx) {
        // Command: /delete
        ctx.command('delete|del', async (c) => {
            try {
                const quoted = await c.replied();
                if (!quoted) {
                    await c.reply('⚠️ Silakan reply pesan yang ingin Anda hapus.');
                    return;
                }
                await ctx.client.delete(quoted.message().key);
            }
            catch (err) {
                await c.reply(`❌ Gagal menghapus pesan: ${err.message || err}`);
            }
        });
        // Command: /react
        ctx.command('react', async (c) => {
            try {
                const emoji = c.args[0] || '👍';
                const quoted = await c.replied();
                const targetKey = quoted ? quoted.message().key : c.message().key;
                await ctx.client.react(targetKey, emoji);
            }
            catch (err) {
                await c.reply(`❌ Gagal memberikan reaksi: ${err.message || err}`);
            }
        });
        // Command: /edit
        ctx.command('edit', async (c) => {
            try {
                const text = c.args.join(' ');
                const quoted = await c.replied();
                if (quoted && quoted.message().key.fromMe) {
                    if (!text) {
                        await c.reply('⚠️ Silakan masukkan teks baru untuk mengedit pesan ini.');
                        return;
                    }
                    await ctx.client.edit(quoted.message().key).text(text);
                }
                else {
                    // Demo editing a message sent by the command
                    const key = await c.reply('⏳ Memproses...');
                    await new Promise(r => setTimeout(r, 1000));
                    await ctx.client.edit(key).text('✅ Pesan berhasil di-edit! ✨');
                }
            }
            catch (err) {
                await c.reply(`❌ Gagal mengedit pesan: ${err.message || err}`);
            }
        });
    }
});
