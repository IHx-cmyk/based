import { definePlugin } from 'zaileys';
export default definePlugin({
    name: 'call-reject',
    setup(ctx) {
        ctx.on('call-incoming', async (payload) => {
            try {
                console.log(`📞 [Incoming Call] ID: ${payload.callId}, From: ${payload.from}`);
                // Reject the call via the underlying baileys socket
                if (ctx.client.socket && typeof ctx.client.socket.rejectCall === 'function') {
                    await ctx.client.socket.rejectCall(payload.callId, payload.from);
                }
                // Notify the caller
                await ctx.client.send(payload.from).text(`⚠️ *PANGGILAN DITOLAK OTOMATIS*\n\nMaaf, bot ini tidak menerima panggilan telepon/video. Silakan hubungi via pesan teks/chat saja.`);
            }
            catch (err) {
                console.error('⚠️ Gagal menolak panggilan masuk:', err);
            }
        });
    }
});
