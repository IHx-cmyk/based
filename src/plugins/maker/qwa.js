import { definePlugin } from 'zaileys';
import { downloadMediaMessage } from 'baileys';
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}.${minutes}`;
}
function formatPhoneNumber(jid) {
    const clean = jid.split('@')[0];
    if (clean.startsWith('62')) {
        const rest = clean.slice(2);
        if (rest.length >= 9) {
            const part1 = rest.slice(0, 3);
            const part2 = rest.slice(3, 7);
            const part3 = rest.slice(7);
            return `+62 ${part1}-${part2}-${part3}`;
        }
        return `+62 ${rest}`;
    }
    return `+${clean}`;
}
export default definePlugin({
    name: 'qwa',
    setup(ctx) {
        ctx.command('qwa', async (c) => {
            const quoted = await c.replied();
            if (!quoted) {
                await c.reply('⚠️ Harap reply pesan yang ingin dijadikan gambar QWA.');
                return;
            }
            try {
                await c.reply('⏳ *Generating QWA image...*');
                const senderId = quoted.senderId;
                const rawMsg = quoted.message();
                const chatType = quoted.chatType;
                let senderAvatar = '';
                try {
                    if (ctx.client.socket) {
                        const ppUrl = await ctx.client.socket.profilePictureUrl(senderId, 'image');
                        if (ppUrl) {
                            senderAvatar = ppUrl;
                        }
                    }
                }
                catch (ppErr) {
                }
                let displayName = quoted.senderName;
                if (!displayName) {
                    try {
                        const contact = await ctx.client.store.getContact(senderId);
                        displayName = contact?.name || contact?.notify || contact?.verifiedName || '';
                    }
                    catch (contactErr) {
                    }
                }
                if (!displayName) {
                    displayName = senderId.split('@')[0];
                }
                if (!displayName.startsWith('~')) {
                    displayName = `~ ${displayName}`;
                }
                const senderNumber = formatPhoneNumber(senderId);
                let msgTimestamp = quoted.timestamp;
                if (msgTimestamp <= 0 || new Date(msgTimestamp).getFullYear() === 1970) {
                    try {
                        const original = await ctx.client.store.getMessage({
                            id: quoted.chatId,
                            remoteJid: c.message().key.remoteJid,
                            fromMe: quoted.isFromMe
                        });
                        if (original && original.messageTimestamp) {
                            const ts = Number(original.messageTimestamp);
                            if (ts > 0) {
                                msgTimestamp = ts * 1000;
                            }
                        }
                    }
                    catch (storeErr) {
                    }
                }
                if (msgTimestamp <= 0 || new Date(msgTimestamp).getFullYear() === 1970) {
                    msgTimestamp = c.timestamp;
                }
                const timeText = formatTime(msgTimestamp);
                let messageText = quoted.text || '';
                let senderImage = '';
                if (chatType === 'image') {
                    const buffer = await downloadMediaMessage(rawMsg, 'buffer', {});
                    const mimetype = rawMsg.message?.imageMessage?.mimetype || 'image/jpeg';
                    senderImage = `data:${mimetype};base64,${buffer.toString('base64')}`;
                    messageText = rawMsg.message?.imageMessage?.caption || '';
                }
                const res = await fetch('https://qwa.eeq.my.id/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sender_name: displayName,
                        sender_number: senderNumber,
                        sender_avatar: senderAvatar,
                        sender_image: senderImage,
                        message: messageText,
                        time: timeText,
                        background: true
                    })
                });
                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(errText || `API status ${res.status}`);
                }
                const arrayBuffer = await res.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                await ctx.client.send(c.roomId ?? c.senderId).image(buffer);
            }
            catch (err) {
                await c.reply(`❌ Gagal membuat gambar QWA: ${err.message || err}`);
            }
        });
    }
});
