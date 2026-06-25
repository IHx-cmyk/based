import { definePlugin } from 'zaileys';
import { savefrom } from '../../source/scrape/savefrom.js';
export default definePlugin({
    name: 'downloader',
    setup(ctx) {
        ctx.command('dl|download', async (c) => {
            const url = c.args[0];
            if (!url) {
                await c.reply('⚠️ Silakan masukkan URL target.\nContoh: */dl https://vt.tiktok.com/ZSQaQuXkh/*');
                return;
            }
            // Check if it looks like a URL
            if (!/^https?:\/\//i.test(url)) {
                await c.reply('⚠️ Harap masukkan URL yang valid diawali dengan http:// atau https://');
                return;
            }
            await c.reply('⏳ Sedang menganalisis tautan...');
            try {
                const res = await savefrom(url);
                if (!res || !res.ok) {
                    await c.reply(`❌ Gagal mendownload media: ${res?.error || 'Tautan tidak didukung atau terproteksi.'}`);
                    return;
                }
                const mediaList = res.media || [];
                const firstMedia = mediaList[0];
                if (!firstMedia || !firstMedia.url) {
                    await c.reply('❌ Tidak ada tautan unduhan langsung yang ditemukan.');
                    return;
                }
                await c.reply(`📥 Mengunduh *${res.title || 'Media'}* (${firstMedia.quality || 'default'} - ${firstMedia.ext || 'unknown'})...`);
                const mediaRes = await fetch(firstMedia.url);
                if (!mediaRes.ok) {
                    throw new Error(`HTTP Error Status: ${mediaRes.status}`);
                }
                const contentLength = mediaRes.headers.get('content-length');
                if (contentLength) {
                    const sizeInMb = parseInt(contentLength) / 1024 / 1024;
                    if (sizeInMb > 50) {
                        await c.reply(`⚠️ Ukuran file terlalu besar (${sizeInMb.toFixed(1)} MB). Batas maksimum pengiriman melalui bot adalah 50 MB.`);
                        return;
                    }
                }
                const buffer = Buffer.from(await mediaRes.arrayBuffer());
                const remoteJid = c.message().key.remoteJid;
                const caption = `📥 *DOWNLOADER SUKSES*\n\n• *Judul:* ${res.title || '-'}\n• *Durasi:* ${res.duration || '-'}\n• *Kualitas:* ${firstMedia.quality || '-'}\n• *Format:* ${firstMedia.ext || '-'}\n\n🤖 _Powered by Savefrom Scraper_`;
                const isVideo = firstMedia.type === 'video' || firstMedia.ext === 'mp4';
                const isAudio = firstMedia.type === 'audio' || firstMedia.ext === 'mp3';
                const isImage = firstMedia.type === 'image' || ['jpg', 'jpeg', 'png', 'webp'].includes(firstMedia.ext || '');
                if (isVideo) {
                    await ctx.client.send(remoteJid).video(buffer, { caption });
                }
                else if (isAudio) {
                    await ctx.client.send(remoteJid).audio(buffer);
                }
                else if (isImage) {
                    await ctx.client.send(remoteJid).image(buffer, { caption });
                }
                else {
                    const filename = `${res.title || 'download'}.${firstMedia.ext || 'bin'}`;
                    await ctx.client.send(remoteJid).document(buffer, {
                        fileName: filename,
                        mimetype: mediaRes.headers.get('content-type') || 'application/octet-stream'
                    });
                }
            }
            catch (err) {
                console.error('❌ Error in Downloader Plugin:', err);
                await c.reply(`❌ Terjadi kesalahan saat mengunduh: ${err.message || err}`);
            }
        });
    }
});
