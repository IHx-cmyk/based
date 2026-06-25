import { definePlugin } from 'zaileys';
import { readdirSync, existsSync, mkdirSync, writeFileSync, unlinkSync, renameSync, readFileSync } from 'fs';
import { join, extname, relative, dirname } from 'path';
function getAllPlugins() {
    const pluginsDir = join(process.cwd(), 'src/plugins');
    const files = [];
    function walk(dir) {
        if (!existsSync(dir))
            return;
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath);
            }
            else if (entry.isFile()) {
                const ext = extname(entry.name);
                const relPath = relative(pluginsDir, fullPath);
                if (ext === '.ts' || ext === '.js') {
                    if (['index.ts', 'index.js', 'types.ts', 'types.js'].includes(entry.name))
                        continue;
                    const name = entry.name.slice(0, -ext.length);
                    files.push({
                        name,
                        relativePath: relPath,
                        fullPath,
                        isActive: true
                    });
                }
                else if (entry.name.endsWith('.ts.disabled') || entry.name.endsWith('.js.disabled')) {
                    const name = entry.name.split('.')[0];
                    files.push({
                        name,
                        relativePath: relPath,
                        fullPath,
                        isActive: false
                    });
                }
            }
        }
    }
    walk(pluginsDir);
    return files;
}
export default definePlugin({
    name: 'plugin-manager',
    setup(ctx) {
        const checkOwner = async (c) => {
            const isOwner = await c.citation.authors();
            if (!isOwner) {
                await c.reply('⚠️ Perintah ini hanya bisa dijalankan oleh Owner bot.');
                return false;
            }
            return true;
        };
        // 1. AP (Active Plugins or Activate Plugin)
        ctx.command('ap', async (c) => {
            if (!(await checkOwner(c)))
                return;
            const name = c.args[0];
            const allPlugins = getAllPlugins();
            if (!name) {
                // List active plugins
                const active = allPlugins.filter(p => p.isActive);
                if (active.length === 0) {
                    await c.reply('📭 Tidak ada plugin aktif.');
                    return;
                }
                const listText = active.map((p, idx) => `${idx + 1}. 🔌 *${p.name}* (${p.relativePath})`).join('\n');
                await c.reply(`🔌 *DAFTAR PLUGIN AKTIF*\n\n${listText}`);
                return;
            }
            // Activate plugin
            const target = allPlugins.find(p => p.name.toLowerCase() === name.toLowerCase() && !p.isActive);
            if (!target) {
                await c.reply(`❌ Plugin non-aktif bernama "${name}" tidak ditemukan.`);
                return;
            }
            const newPath = target.fullPath.replace('.disabled', '');
            try {
                renameSync(target.fullPath, newPath);
                await c.reply(`✅ Plugin *${target.name}* berhasil diaktifkan.`);
            }
            catch (err) {
                await c.reply(`❌ Gagal mengaktifkan plugin: ${err.message || err}`);
            }
        });
        // 2. DP (Deactivate Plugin or Deactive Plugins)
        ctx.command('dp', async (c) => {
            if (!(await checkOwner(c)))
                return;
            const name = c.args[0];
            const allPlugins = getAllPlugins();
            if (!name) {
                // List deactivated plugins
                const inactive = allPlugins.filter(p => !p.isActive);
                if (inactive.length === 0) {
                    await c.reply('📭 Tidak ada plugin non-aktif.');
                    return;
                }
                const listText = inactive.map((p, idx) => `${idx + 1}. 💤 *${p.name}* (${p.relativePath})`).join('\n');
                await c.reply(`💤 *DAFTAR PLUGIN NON-AKTIF*\n\n${listText}`);
                return;
            }
            // Deactivate plugin
            const target = allPlugins.find(p => p.name.toLowerCase() === name.toLowerCase() && p.isActive);
            if (!target) {
                await c.reply(`❌ Plugin aktif bernama "${name}" tidak ditemukan.`);
                return;
            }
            const newPath = target.fullPath + '.disabled';
            try {
                renameSync(target.fullPath, newPath);
                await c.reply(`💤 Plugin *${target.name}* berhasil dinonaktifkan.`);
            }
            catch (err) {
                await c.reply(`❌ Gagal menonaktifkan plugin: ${err.message || err}`);
            }
        });
        // 3. GP / GETPLUGIN (Get Plugin Code)
        ctx.command('gp|getplugin', async (c) => {
            if (!(await checkOwner(c)))
                return;
            const name = c.args[0];
            if (!name) {
                await c.reply('⚠️ Harap masukkan nama plugin. Contoh: /gp sticker');
                return;
            }
            const allPlugins = getAllPlugins();
            const target = allPlugins.find(p => p.name.toLowerCase() === name.toLowerCase());
            if (!target) {
                await c.reply(`❌ Plugin "${name}" tidak ditemukan.`);
                return;
            }
            try {
                const code = readFileSync(target.fullPath, 'utf-8');
                await ctx.client.send(c.message().key.remoteJid).text(`\`\`\`typescript\n${code}\n\`\`\``, {
                    rich: true,
                    title: `🔌 Plugin: ${target.name}`,
                    footer: `Path: src/plugins/${target.relativePath} | Status: ${target.isActive ? 'Aktif' : 'Non-aktif'}`
                });
            }
            catch (err) {
                await c.reply(`❌ Gagal membaca plugin: ${err.message || err}`);
            }
        });
        // 4. FP / FIND (Find Plugins)
        ctx.command('fp|find', async (c) => {
            if (!(await checkOwner(c)))
                return;
            const query = c.args[0];
            if (!query) {
                await c.reply('⚠️ Harap masukkan kata kunci pencarian. Contoh: /find stick');
                return;
            }
            const allPlugins = getAllPlugins();
            const matches = allPlugins.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
            if (matches.length === 0) {
                await c.reply(`🔍 Tidak ada plugin yang cocok dengan kata kunci "${query}".`);
                return;
            }
            const listText = matches.map((p, idx) => `${idx + 1}. ${p.isActive ? '🔌' : '💤'} *${p.name}* (${p.relativePath}) [${p.isActive ? 'Aktif' : 'Non-aktif'}]`).join('\n');
            await c.reply(`🔍 *HASIL PENCARIAN PLUGIN ("${query}")*\n\n${listText}`);
        });
        // 5. APLUG (Add Plugin from replied code message)
        ctx.command('aplug', async (c) => {
            if (!(await checkOwner(c)))
                return;
            const pathArg = c.args[0];
            if (!pathArg) {
                await c.reply('⚠️ Harap masukkan nama path plugin. Contoh: /aplug media/test.ts');
                return;
            }
            const quoted = await c.replied();
            if (!quoted) {
                await c.reply('⚠️ Silakan reply pesan yang berisi kode plugin.');
                return;
            }
            const code = quoted.text;
            if (!code) {
                await c.reply('❌ Pesan yang di-reply tidak berisi teks/kode.');
                return;
            }
            // Clean up code formatting (remove markdown code block wrappers if any)
            let cleanedCode = code.trim();
            if (cleanedCode.startsWith('```')) {
                const lines = cleanedCode.split('\n');
                if (lines[0].startsWith('```'))
                    lines.shift();
                if (lines[lines.length - 1].startsWith('```'))
                    lines.pop();
                cleanedCode = lines.join('\n');
            }
            const targetPath = join(process.cwd(), 'src/plugins', pathArg);
            try {
                const dir = dirname(targetPath);
                mkdirSync(dir, { recursive: true });
                writeFileSync(targetPath, cleanedCode, 'utf-8');
                await c.reply(`✅ Plugin berhasil dibuat di *src/plugins/${pathArg}*`);
            }
            catch (err) {
                await c.reply(`❌ Gagal membuat plugin: ${err.message || err}`);
            }
        });
        // 6. DPLUG (Delete Plugin)
        ctx.command('dplug', async (c) => {
            if (!(await checkOwner(c)))
                return;
            const name = c.args[0];
            if (!name) {
                await c.reply('⚠️ Harap masukkan nama plugin yang ingin dihapus. Contoh: /dplug test');
                return;
            }
            const allPlugins = getAllPlugins();
            const target = allPlugins.find(p => p.name.toLowerCase() === name.toLowerCase());
            if (!target) {
                await c.reply(`❌ Plugin "${name}" tidak ditemukan.`);
                return;
            }
            try {
                unlinkSync(target.fullPath);
                await c.reply(`🗑️ Plugin *${target.name}* (${target.relativePath}) berhasil dihapus.`);
            }
            catch (err) {
                await c.reply(`❌ Gagal menghapus plugin: ${err.message || err}`);
            }
        });
    }
});
