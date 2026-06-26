import http from 'http';
import os from 'os';
import { getStats, clearStats } from './utils/statsTracker.js';
import { dashboardHtml } from './utils/dashboardHtml.js';

export function startDashboard(client, connectionTracker) {
    const port = process.env.PORT || 3000;

    const server = http.createServer(async (req, res) => {
        // Set CORS headers for local debugging if needed
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        // Routing
        if (req.method === 'GET' && req.url === '/') {
            // Serve the dashboard HTML page
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(dashboardHtml);
        } 
        else if (req.method === 'GET' && req.url === '/api/stats') {
            // Serve JSON stats
            const stats = getStats();
            
            let totalChats = 0;
            let totalGroups = 0;
            let totalContacts = 0;

            try {
                if (client.store) {
                    const chats = await client.store.listChats();
                    totalChats = chats.length;
                    totalGroups = chats.filter(c => c.id && c.id.endsWith('@g.us')).length;
                    
                    const contacts = await client.store.listContacts();
                    totalContacts = contacts.length;
                }
            } catch (err) {
                console.error('⚠️ Failed to fetch counts from client store:', err);
            }
            
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const systemInfo = {
                uptime: process.uptime(),
                totalMemory: totalMem,
                freeMemory: freeMem,
                usedMemory: usedMem,
                memoryPercentage: ((usedMem / totalMem) * 100).toFixed(1),
                os: os.platform(),
                osRelease: os.release(),
                nodeVersion: process.version,
                arch: os.arch(),
                cpus: os.cpus().length
            };
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                connection: {
                    state: connectionTracker.state,
                    me: connectionTracker.me,
                    sessionId: client.sessionId
                },
                db: {
                    chats: totalChats,
                    groups: totalGroups,
                    contacts: totalContacts
                },
                system: systemInfo,
                stats: stats
            }));
        } 
        else if (req.method === 'POST' && req.url === '/api/clear') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
                let action = 'cache';
                try {
                    const parsed = JSON.parse(body);
                    action = parsed.action || 'cache';
                } catch {}
                
                try {
                    if (action === 'all') {
                        // Clear message store cache and logout WhatsApp session
                        if (client.store) {
                            try {
                                await client.store.clear();
                            } catch (storeErr) {
                                console.error('⚠️ Failed to clear message store:', storeErr);
                            }
                        }
                        await client.logout();
                        
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, message: 'WhatsApp session logged out and cache cleared.' }));
                    } else {
                        // Clear message store cache safely without logging out
                        if (client.store) {
                            try {
                                await client.store.clear();
                            } catch (storeErr) {
                                console.error('⚠️ Failed to clear message store:', storeErr);
                            }
                        }

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, message: 'Message store cache cleared successfully.' }));
                    }
                } catch (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: err.message || err }));
                }
            });
        } 
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    });

    server.listen(port, () => {
        console.log(`🚀 [Dashboard] Panel web aktif di http://localhost:${port}`);
    });
}
