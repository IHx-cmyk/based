import { definePlugin } from 'zaileys';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
function getRuntime(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}h ${h}j ${m}m ${s}d`;
}
export default definePlugin({
    name: 'help',
    setup(ctx) {
        const userPrefixes = new Map();
        async function sendHelp(targetJid, arg, pref, quotedKey) {
            const runtime = getRuntime(process.uptime());
            // Cari path background secara aman
            const imagePathCwd = path.join(process.cwd(), 'src/source/background.jpg');
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const imagePathDir = path.join(__dirname, '../../source/background.jpg');
            let selectedImagePath = '';
            if (existsSync(imagePathCwd)) {
                selectedImagePath = imagePathCwd;
            }
            else if (existsSync(imagePathDir)) {
                selectedImagePath = imagePathDir;
            }
            // Siapkan context reply agar tombol interaktif bisa dibalas kembali
            let replyTarget = quotedKey;
            if (replyTarget && !replyTarget.message) {
                if (replyTarget.remoteJid) {
                    replyTarget = {
                        key: replyTarget,
                        message: { conversation: 'Button Click' }
                    };
                }
                else if (replyTarget.key) {
                    replyTarget = {
                        ...replyTarget,
                        message: replyTarget.message || { conversation: 'Button Click' }
                    };
                }
            }
            const replyIfTarget = (builder) => {
                return replyTarget ? builder.reply(replyTarget) : builder;
            };
            const formatMenu = (text) => {
                return text
                    .replace(/🔹 \//g, `🔹 ${pref}`)
                    .replace(/Cmd: \*\//g, `Cmd: *${pref}`)
                    .replace(/\(alias: \//g, `(alias: ${pref}`)
                    .replace(/, \//g, `, ${pref}`);
            };
            const sendCategoryMenu = async (title, content) => {
                try {
                    await replyIfTarget(ctx.client.send(targetJid).buttons([
                        { id: 'opt_help', text: '🏠 Menu Utama' },
                        { id: 'btn_menu_all', text: '📋 Semua Menu' }
                    ], {
                        title: title,
                        text: content,
                        image: selectedImagePath ? readFileSync(selectedImagePath) : undefined,
                        footer: 'Tekan tombol di bawah untuk navigasi'
                    }));
                }
                catch (err) {
                    console.error(`Failed to send category menu buttons for ${title}:`, err);
                    await replyIfTarget(ctx.client.send(targetJid).text(content));
                }
            };
            if (arg === 'umum' || arg === 'general') {
                const subMenu = `*📂 MENU: General*

🤖 *INFO SISTEM*
 ├ Based : Zaileys
 └ Uptime : ${runtime}

📋 *DAFTAR PERINTAH*
 🔹 /ping
 🔹 /help
 🔹 /tqto - Terima kasih (Kredit/Kontributor)`;
                await sendCategoryMenu('> Menu Umum', formatMenu(subMenu));
                return;
            }
            if (arg === 'grup' || arg === 'group') {
                const subMenu = `*👥 MENU: Group*

 🔹 /groupinfo
 🔹 /tagall <pesan>
 🔹 /promote <tag>
 🔹 /demote <tag>
 🔹 /kick <tag>
 🔹 /add <nomor> `;
                await sendCategoryMenu('> Menu Grup', formatMenu(subMenu));
                return;
            }
            if (arg === 'maker' || arg === 'pembuat') {
                const subMenu = `*🎨 MENU: Maker*

 🔹 /sticker
 🔹 /qwa`;
                await sendCategoryMenu('> Menu Maker', formatMenu(subMenu));
                return;
            }
            if (arg === 'tools' || arg === 'alat') {
                const subMenu = `*🛠️ MENU: Tools*

 🔹 /sitekey <url>
 🔹 /get <url>
 🔹 /igstalk <username>
 🔹 /dl <url> - Download media (TikTok, IG, YT, dll)`;
                await sendCategoryMenu('> Menu Tools', formatMenu(subMenu));
                return;
            }
            if (arg === 'owner' || arg === 'pemilik') {
                const subMenu = `*⚙️ MENU: Owner*

 🔹 /presence <mode>
 🔹 /selfmode <mode>
 🔹 /broadcast <pesan>
 🔹 /schedule <detik> <teks>
 🔹 /delete
 🔹 /react <emoji>
 🔹 /edit <teks>
 🔹 /push
 🔹 /ap <nama>
 🔹 /dp <nama>
 🔹 /getplugin <nama>
 🔹 /find <query> 
 🔹 /aplug <path>
 🔹 /dplug <nama>`;
                await sendCategoryMenu('> Menu Owner', formatMenu(subMenu));
                return;
            }
            if (arg === 'all' || arg === 'semua') {
                const allMenu = `*🤖 SHNNY BOT*

🤖 *INFO SISTEM*
 ├ Based : Zaileys
 └ Uptime : ${runtime}

📋 *DAFTAR PERINTAH*

┌── *1. UMUM (general)*
│ 🔹 /ping
│ 🔹 /help
│ 🔹 /tqto
└──

┌── *2. Group*
│ 🔹 /groupinfo
│ 🔹 /tagall <pesan>
│ 🔹 /promote <tag>
│ 🔹 /demote <tag>
│ 🔹 /kick <tag>
│ 🔹 /add <nomor>
└──

┌── *3. Maker*
│ 🔹 /sticker
│ 🔹 /qwa
└──

┌── *4. Tools*
│ 🔹 /sitekey <url>
│ 🔹 /get <url>
│ 🔹 /igstalk <username>
│ 🔹 /dl <url>
└──

┌── *5. Owner*
│ 🔹 /presence <mode>
│ 🔹 /selfmode <mode>
│ 🔹 /broadcast <pesan>
│ 🔹 /schedule <detik> <pesan>
│ 🔹 /delete
│ 🔹 /react <emoji>
│ 🔹 /edit <teks>
│ 🔹 /push
│ 🔹 /ap <nama>
│ 🔹 /dp <nama>
│ 🔹 /getplugin <nama>
│ 🔹 /find <query>
│ 🔹 /aplug <path>
│ 🔹 /dplug <nama>
└──`;
                let sentAll = false;
                try {
                    await replyIfTarget(ctx.client.send(targetJid).buttons([
                        { id: 'opt_help', text: '🏠 Menu Utama' }
                    ], {
                        title: '> Semua Perintah',
                        text: formatMenu(allMenu),
                        image: selectedImagePath || undefined,
                        footer: 'Tekan tombol di bawah untuk navigasi'
                    }));
                    sentAll = true;
                }
                catch (err) {
                    console.error('Failed to send all help buttons:', err);
                }
                if (!sentAll) {
                    if (selectedImagePath) {
                        try {
                            await replyIfTarget(ctx.client.send(targetJid).image(selectedImagePath, { caption: formatMenu(allMenu) }));
                            sentAll = true;
                        }
                        catch (err) {
                            console.error('Failed to send all help image:', err);
                        }
                    }
                    if (!sentAll) {
                        await replyIfTarget(ctx.client.send(targetJid).text(formatMenu(allMenu)));
                    }
                }
                return;
            }
            const mainText = `🌠  *System Info*
 ├ Based : Zaileys
 ├ Repo  : github.com/IHx-cmyk/based
 └ Uptime : ${runtime}

 ✢ Cmd: */help <category>*

*Category:*
- *general*
- *group*
- *maker*
- *tools*
- *owner*
- *all*`;
            let sentMain = false;
            try {
                // Kirim menu utama menggunakan buttons interaktif dengan bottom sheet
                await replyIfTarget(ctx.client.send(targetJid).buttons([
                    { id: 'btn_menu_umum', text: 'General' },
                    { id: 'btn_menu_grup', text: 'Group' },
                    { id: 'btn_menu_maker', text: 'Maker' },
                    { id: 'btn_menu_tools', text: 'Tools' },
                    { id: 'btn_menu_owner', text: 'Owner' },
                    { id: 'btn_menu_all', text: 'All Menu' }
                ], {
                    title: '',
                    text: formatMenu(mainText),
                    image: selectedImagePath ? readFileSync(selectedImagePath) : undefined,
                    footer: '⊕ ShnN',
                    bottomSheet: {
                        listTitle: 'Pilih Kategori Menu',
                        buttonTitle: '✉️ Menu',
                        buttonsLimit: 2
                    }
                }));
                sentMain = true;
            }
            catch (err) {
                console.error('Failed to send buttons menu:', err);
            }
            if (!sentMain) {
                // Kirim teks biasa/gambar jika pengiriman tombol interaktif gagal
                let sentImageOnly = false;
                if (selectedImagePath) {
                    try {
                        await replyIfTarget(ctx.client.send(targetJid).image(selectedImagePath, { caption: `╔════════════════════╗\n      *SHNNY BOT*\n╚════════════════════╝\n` + formatMenu(mainText) }));
                        sentImageOnly = true;
                    }
                    catch (err) {
                        console.error('Failed to send help image fallback:', err);
                    }
                }
                if (!sentImageOnly) {
                    await replyIfTarget(ctx.client.send(targetJid).text(`╔════════════════════╗\n      *SHNNY BOT*\n╚════════════════════╝\n` + formatMenu(mainText)));
                }
            }
        }
        // Interseptor pesan masuk untuk mendeteksi klik menu kategori manual
        ctx.use(async (c, next) => {
            const text = (c.text || '').trim().toLowerCase();
            if (text === 'umum 🔹' || text === 'btn_menu_umum' || text === 'general') {
                c.command = 'help';
                c.args = ['general'];
            }
            else if (text === 'grup 👥' || text === 'btn_menu_grup' || text === 'group') {
                c.command = 'help';
                c.args = ['group'];
            }
            else if (text === 'maker 🔹' || text === 'btn_menu_maker' || text === 'maker') {
                c.command = 'help';
                c.args = ['maker'];
            }
            else if (text === 'tools 🔹' || text === 'btn_menu_tools' || text === 'tools') {
                c.command = 'help';
                c.args = ['tools'];
            }
            else if (text === 'owner 🔹' || text === 'btn_menu_owner' || text === 'owner') {
                c.command = 'help';
                c.args = ['owner'];
            }
            else if (text === 'semua menu 📋' || text === 'btn_menu_all') {
                c.command = 'help';
                c.args = ['all'];
            }
            await next();
        });
        ctx.command('help|menu', async (c) => {
            try {
                await c.react('♻️');
                await c.react('❇️');
            }
            catch { }
            const arg = (c.args[0] || '').toLowerCase().trim();
            const rawText = c.raw || '';
            const prefixes = ctx.commandPrefixes || ['/', '#', '!', '📍'];
            const matchedPrefixInRaw = prefixes.find((p) => rawText.startsWith(p));
            let matchedPrefix = matchedPrefixInRaw;
            const chatJid = c.message().key.remoteJid;
            if (matchedPrefix) {
                if (chatJid) {
                    userPrefixes.set(chatJid, matchedPrefix);
                }
            }
            else {
                matchedPrefix = (chatJid && userPrefixes.get(chatJid)) || '/';
            }
            await sendHelp(c.message().key.remoteJid, arg, matchedPrefix, c.message());
        });
        // Proses event klik tombol interaktif secara native
        ctx.on('button-click', async (c) => {
            const buttonId = c.buttonId;
            if (buttonId.startsWith('btn_menu_') || buttonId === 'opt_help') {
                let category = '';
                if (buttonId === 'btn_menu_all')
                    category = 'all';
                else if (buttonId === 'btn_menu_umum')
                    category = 'general';
                else if (buttonId === 'btn_menu_grup')
                    category = 'group';
                else if (buttonId === 'btn_menu_maker')
                    category = 'maker';
                else if (buttonId === 'btn_menu_tools')
                    category = 'tools';
                else if (buttonId === 'btn_menu_owner')
                    category = 'owner';
                else if (buttonId === 'opt_help')
                    category = '';
                else
                    return;
                const chatJid = c.key.remoteJid;
                const prefix = (chatJid && userPrefixes.get(chatJid)) || '/';
                await sendHelp(c.key.remoteJid, category, prefix, c.key);
            }
        });
        // Proses event pemilihan opsi list menu secara native
        ctx.on('list-select', async (c) => {
            const rowId = c.rowId;
            if (rowId.startsWith('btn_menu_') || rowId === 'opt_help') {
                let category = '';
                if (rowId === 'btn_menu_all')
                    category = 'all';
                else if (rowId === 'btn_menu_umum')
                    category = 'general';
                else if (rowId === 'btn_menu_grup')
                    category = 'group';
                else if (rowId === 'btn_menu_maker')
                    category = 'maker';
                else if (rowId === 'btn_menu_tools')
                    category = 'tools';
                else if (rowId === 'btn_menu_owner')
                    category = 'owner';
                else if (rowId === 'opt_help')
                    category = '';
                else
                    return;
                const chatJid = c.key.remoteJid;
                const prefix = (chatJid && userPrefixes.get(chatJid)) || '/';
                await sendHelp(c.key.remoteJid, category, prefix, c.key);
            }
        });
    }
});
