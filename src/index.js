import { Client, RedisAuthStore, RedisMessageStore } from 'zaileys';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logIncomingMessage } from './utils/logger.js';
import { loadStats, trackMessage } from './utils/statsTracker.js';
import { startDashboard } from './dashboard.js';

// Load environment variables natively if supported
try {
    if (typeof process.loadEnvFile === 'function') {
        process.loadEnvFile();
    }
} catch (err) {
    // Ignore if .env is missing or loadEnvFile is not defined
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const redisUrl = process.env.REDIS_URL;

const clientOptions = {
    authType: 'pairing',
    phoneNumber: '6285815252091', // Ganti sama nomor lu bos
    sessionId: 'default',
    commandPrefix: ['/', '#', '!', '📍'],
    ignoreMe: true,
    citation: {
        authors: ['628818471170@s.whatsapp.net'],
    },
    plugins: {
        dir: join(__dirname, 'plugins'),
        watch: true,
    }
};

if (redisUrl) {
    console.log(`📡 [zaileys] Menggunakan database Redis: ${redisUrl}`);
    clientOptions.auth = new RedisAuthStore({ url: redisUrl, namespace: 'shnny-auth' });
    clientOptions.store = new RedisMessageStore({ url: redisUrl, namespace: 'shnny-store' });
} else {
    console.log('📂 [zaileys] Menggunakan database bawaan (File & Memory)');
}

// Track connection status globally for the web dashboard
const connectionTracker = {
    state: 'connecting',
    me: null
};

// Load persistent stats
await loadStats();

const client = new Client(clientOptions);

client.on('pairing-code', ({ code }) => {
    console.log('\n🔑 KODE PAIRING LU:', code, '\n');
    connectionTracker.state = 'connecting';
});
client.on('connect', ({ me }) => {
    console.log('✅ Connected as', me.id);
    connectionTracker.state = 'connected';
    connectionTracker.me = me;
});
client.on('disconnect', ({ reason, willReconnect }) => {
    console.log(`❌ Disconnected: ${reason}, will reconnect: ${willReconnect}`);
    connectionTracker.state = 'disconnected';
    connectionTracker.me = null;
});
client.on('error', ({ error }) => {
    console.error('⚠️ Client error:', error);
});

// Start the Web Dashboard Panel
startDashboard(client, connectionTracker);

// Helper wrapper for logging and auto reading incoming messages
async function handleIncomingMessage(ctx, msgType) {
    try {
        await logIncomingMessage(ctx, msgType);
        // Track the message for the dashboard charts & tables
        await trackMessage(ctx);
        
        const jid = ctx.roomId ?? ctx.senderId;
        if (jid) {
            await client.chat.markRead(jid);
        }
    }
    catch (err) {
        console.error('⚠️ Gagal memproses pesan masuk:', err);
    }
}
client.on('text', (ctx) => { handleIncomingMessage(ctx, 'text'); });
client.on('image', (ctx) => { handleIncomingMessage(ctx, 'image'); });
client.on('video', (ctx) => { handleIncomingMessage(ctx, 'video'); });
client.on('audio', (ctx) => { handleIncomingMessage(ctx, 'audio'); });
client.on('document', (ctx) => { handleIncomingMessage(ctx, 'document'); });
client.on('sticker', (ctx) => { handleIncomingMessage(ctx, 'sticker'); });

// Catch process crashes to prevent session corruption and log root causes
process.on('uncaughtException', (err) => {
    console.error('💥 CRITICAL: Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

