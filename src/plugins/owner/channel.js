import { definePlugin } from 'zaileys';
import { downloadMediaMessage, prepareWAMessageMedia, generateWAMessageFromContent } from 'baileys';
async function sendNewsletterMedia(client, channelId, mediaType, buffer, options = {}) {
    const socket = client.socket;
    if (!socket) {
        throw new Error('Socket not initialized');
    }
    // 1. Prepare media payload
    const mediaPayload = {};
    if (mediaType === 'document') {
        mediaPayload.document = buffer;
        mediaPayload.fileName = options.fileName;
        mediaPayload.mimetype = options.mimetype;
    }
    else {
        mediaPayload[mediaType] = buffer;
    }
    // 2. Prepare WAMessage media using Baileys
    const prepared = await prepareWAMessageMedia(mediaPayload, {
        upload: socket.waUploadToServer,
    });
    // 3. Fix the directPath: replace /o1/ with /m1/
    const messageKey = `${mediaType}Message`;
    const mediaMessage = prepared[messageKey];
    if (mediaMessage) {
        if (mediaMessage.directPath) {
            mediaMessage.directPath = mediaMessage.directPath.replaceAll('/o1/', '/m1/');
        }
        if (options.caption && 'caption' in mediaMessage) {
            mediaMessage.caption = options.caption;
        }
    }
    // 4. Generate WA message content
    const waMsg = generateWAMessageFromContent(channelId, { [messageKey]: mediaMessage }, { userJid: socket.user?.id ?? '' });
    // 5. Relay message to channel JID
    await socket.relayMessage(channelId, waMsg.message, {
        messageId: waMsg.key.id,
    });
}
export default definePlugin({
    name: 'channel-post',
    setup(ctx) {
        ctx.command('push|ch|saluran', async (c) => {
            const channelId = '120363406948789183@newsletter';
            const quoted = await c.replied();
            if (!quoted) {
                await c.reply('⚠️ Silakan reply pesan yang ingin dikirim ke saluran/channel.');
                return;
            }
            const chatType = quoted.chatType;
            try {
                await c.reply('⏳ Mengirim ke channel/saluran...');
                // 1. Text Message
                if (chatType === 'text') {
                    if (!quoted.text) {
                        await c.reply('❌ Pesan teks kosong.');
                        return;
                    }
                    await ctx.client.send(channelId).text(quoted.text);
                    await c.reply('✅ Berhasil mengirim teks ke channel.');
                    return;
                }
                // 2. Media Messages
                const rawMsg = quoted.message();
                // 2a. Image Message
                if (chatType === 'image') {
                    const buffer = await downloadMediaMessage(rawMsg, 'buffer', {});
                    await sendNewsletterMedia(ctx.client, channelId, 'image', buffer, { caption: quoted.text || undefined });
                    await c.reply('✅ Berhasil mengirim gambar ke channel.');
                    return;
                }
                // 2b. Video Message
                if (chatType === 'video') {
                    const buffer = await downloadMediaMessage(rawMsg, 'buffer', {});
                    await sendNewsletterMedia(ctx.client, channelId, 'video', buffer, { caption: quoted.text || undefined });
                    await c.reply('✅ Berhasil mengirim video ke channel.');
                    return;
                }
                // 2c. Audio Message
                if (chatType === 'audio') {
                    const buffer = await downloadMediaMessage(rawMsg, 'buffer', {});
                    await sendNewsletterMedia(ctx.client, channelId, 'audio', buffer);
                    await c.reply('✅ Berhasil mengirim audio ke channel.');
                    return;
                }
                // 2d. Document Message
                if (chatType === 'document') {
                    const buffer = await downloadMediaMessage(rawMsg, 'buffer', {});
                    // Try to extract original filename and mimetype from message
                    const docMessage = rawMsg.message?.documentMessage;
                    const fileName = docMessage?.fileName || 'document.pdf';
                    const mimetype = docMessage?.mimetype || 'application/octet-stream';
                    const caption = docMessage?.caption || undefined;
                    await sendNewsletterMedia(ctx.client, channelId, 'document', buffer, { fileName, mimetype, caption });
                    await c.reply('✅ Berhasil mengirim dokumen ke channel.');
                    return;
                }
                // 2e. Sticker Message
                if (chatType === 'sticker') {
                    const buffer = await downloadMediaMessage(rawMsg, 'buffer', {});
                    await sendNewsletterMedia(ctx.client, channelId, 'sticker', buffer);
                    await c.reply('✅ Berhasil mengirim stiker ke channel.');
                    return;
                }
                await c.reply(`⚠️ Tipe pesan '${chatType}' belum didukung untuk dikirim ke channel.`);
            }
            catch (err) {
                await c.reply(`❌ Gagal mengirim ke channel: ${err.message || err}`);
            }
        });
    }
});
