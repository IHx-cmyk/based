import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const callRejectPlugin: Plugin = {
  name: 'call-reject',
  setup(client: Client) {
    client.on('call-incoming', async (payload) => {
      try {
        console.log(`📞 [Incoming Call] ID: ${payload.callId}, From: ${payload.from}`);
        
        // Reject the call via the underlying baileys socket
        if (client.socket && typeof (client.socket as any).rejectCall === 'function') {
          await (client.socket as any).rejectCall(payload.callId, payload.from);
        }
        
        // Notify the caller
        await client.send(payload.from).text(
          `⚠️ *PANGGILAN DITOLAK OTOMATIS*\n\nMaaf, bot ini tidak menerima panggilan telepon/video. Silakan hubungi via pesan teks/chat saja.`
        );
      } catch (err) {
        console.error('⚠️ Gagal menolak panggilan masuk:', err);
      }
    });
  }
};
