import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const statsFilePath = path.join(__dirname, 'stats.json');

let stats = {
    daily: {},
    groups: {},
    users: {}
};

// Load stats from file
export async function loadStats() {
    try {
        const data = await fs.readFile(statsFilePath, 'utf8');
        stats = JSON.parse(data);
        // Ensure structure is correct
        if (!stats.daily) stats.daily = {};
        if (!stats.groups) stats.groups = {};
        if (!stats.users) stats.users = {};
    } catch (err) {
        // Fallback if file doesn't exist
        stats = {
            daily: {},
            groups: {},
            users: {}
        };
    }
}

// Save stats to file
export async function saveStats() {
    try {
        await fs.writeFile(statsFilePath, JSON.stringify(stats, null, 2), 'utf8');
    } catch (err) {
        console.error('⚠️ Failed to save stats:', err);
    }
}

// Track an incoming message
export async function trackMessage(ctx) {
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Update daily count
    stats.daily[today] = (stats.daily[today] || 0) + 1;
    
    // 2. Update group count if from a group
    if (ctx.isGroup) {
        const groupId = ctx.roomId || ctx.message().key.remoteJid;
        if (groupId) {
            let groupName = 'Grup Tanpa Nama';
            try {
                groupName = await ctx.roomName() || 'Grup Tanpa Nama';
            } catch {}
            
            if (!stats.groups[groupId]) {
                stats.groups[groupId] = { name: groupName, count: 0 };
            }
            stats.groups[groupId].count += 1;
            stats.groups[groupId].name = groupName; // Keep name updated
        }
    }
    
    // 3. Update user count
    const userId = ctx.senderId;
    if (userId) {
        const userName = ctx.senderName || userId.split('@')[0];
        if (!stats.users[userId]) {
            stats.users[userId] = { name: userName, count: 0 };
        }
        stats.users[userId].count += 1;
        stats.users[userId].name = userName; // Keep name updated
    }
    
    // Limit daily keys to last 30 days to keep the file lightweight
    const dates = Object.keys(stats.daily).sort();
    if (dates.length > 30) {
        delete stats.daily[dates[0]];
    }
    
    await saveStats();
}

// Get the current statistics object
export function getStats() {
    return stats;
}

// Clear all statistics
export async function clearStats() {
    stats = {
        daily: {},
        groups: {},
        users: {}
    };
    await saveStats();
}
