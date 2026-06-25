import { definePlugin } from 'zaileys';
export default definePlugin({
    name: 'fetch-tool',
    setup(ctx) {
        ctx.command('fetch|get', async (c) => {
            const url = c.args[0];
            if (!url) {
                await c.reply('⚠️ Silakan masukkan URL target.\nContoh: */get https://example.com* atau */get https://picsum.photos/200*');
                return;
            }
            // Check if it looks like a URL
            if (!/^https?:\/\//i.test(url)) {
                await c.reply('⚠️ Harap masukkan URL yang valid diawali dengan http:// atau https://*');
                return;
            }
            await c.reply('⏳ Sedang mengambil data dari URL...');
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const contentType = response.headers.get('content-type') || '';
                const buffer = Buffer.from(await response.arrayBuffer());
                const remoteJid = c.message().key.remoteJid;
                // 1. Image
                if (contentType.startsWith('image/')) {
                    await ctx.client.send(remoteJid).image(buffer, { caption: `🖼️ Gambar dari: ${url}` });
                    return;
                }
                // 2. Video
                if (contentType.startsWith('video/')) {
                    await ctx.client.send(remoteJid).video(buffer, { caption: `🎥 Video dari: ${url}` });
                    return;
                }
                // 3. Audio
                if (contentType.startsWith('audio/')) {
                    await ctx.client.send(remoteJid).audio(buffer);
                    return;
                }
                // 4. JSON
                if (contentType.includes('application/json')) {
                    const jsonText = buffer.toString('utf-8');
                    try {
                        // Pretty print JSON
                        const parsed = JSON.parse(jsonText);
                        const formattedJson = JSON.stringify(parsed, null, 2);
                        if (formattedJson.length < 4000) {
                            await c.reply(`📝 *JSON RESPONSE:*\n\`\`\`json\n${formattedJson}\n\`\`\``);
                        }
                        else {
                            // Send as document file
                            await ctx.client.send(remoteJid).document(Buffer.from(formattedJson), {
                                fileName: 'response.json',
                                mimetype: 'application/json'
                            });
                        }
                    }
                    catch {
                        await c.reply(`📝 *JSON RESPONSE (Raw):*\n\`\`\`json\n${jsonText.slice(0, 4000)}\n\`\`\``);
                    }
                    return;
                }
                // 5. HTML or text
                if (contentType.startsWith('text/')) {
                    const text = buffer.toString('utf-8');
                    if (text.length < 4000) {
                        await c.reply(`📄 *TEXT/HTML RESPONSE:*\n\`\`\`html\n${text}\n\`\`\``);
                    }
                    else {
                        // Send as text document
                        await ctx.client.send(remoteJid).document(buffer, {
                            fileName: 'response.txt',
                            mimetype: 'text/plain'
                        });
                    }
                    return;
                }
                // 6. Generic Document / Other Binary format
                const filename = url.split('/').pop()?.split('?')[0] || 'file';
                await ctx.client.send(remoteJid).document(buffer, {
                    fileName: filename,
                    mimetype: contentType || 'application/octet-stream'
                });
            }
            catch (err) {
                console.error('❌ Error fetching URL:', err);
                await c.reply(`❌ Gagal mengambil data: ${err.message || err}`);
            }
        });
    }
});
