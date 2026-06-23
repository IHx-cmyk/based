import { Client } from 'zaileys';
import { Plugin } from '../../types.js';
import { readdirSync, statSync, existsSync, mkdirSync, writeFileSync, unlinkSync, renameSync, readFileSync } from 'fs';
import { join, extname, relative, dirname } from 'path';

interface PluginFile {
  name: string;
  relativePath: string;
  fullPath: string;
  isActive: boolean;
}

function getAllPlugins(): PluginFile[] {
  const pluginsDir = join(process.cwd(), 'src/plugins');
  const files: PluginFile[] = [];

  function walk(dir: string) {
    if (!existsSync(dir)) return;
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = extname(entry.name);
        const relPath = relative(pluginsDir, fullPath);
        
        if (ext === '.ts' || ext === '.js') {
          if (['index.ts', 'index.js', 'types.ts', 'types.js'].includes(entry.name)) continue;
          const name = entry.name.slice(0, -ext.length);
          files.push({
            name,
            relativePath: relPath,
            fullPath,
            isActive: true
          });
        } else if (entry.name.endsWith('.ts.disabled') || entry.name.endsWith('.js.disabled')) {
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

export const pluginManager: Plugin = {
  name: 'plugin-manager',
  setup(client: Client) {
    const checkOwner = async (ctx: any) => {
      const isOwner = await ctx.citation.authors();
      if (!isOwner) {
        await ctx.reply('⚠️ Perintah ini hanya bisa dijalankan oleh Owner bot.');
        return false;
      }
      return true;
    };

    // 1. AP (Active Plugins or Activate Plugin)
    client.command('ap', async (ctx) => {
      if (!(await checkOwner(ctx))) return;
      const name = ctx.args[0];
      const allPlugins = getAllPlugins();

      if (!name) {
        // List active plugins
        const active = allPlugins.filter(p => p.isActive);
        if (active.length === 0) {
          await ctx.reply('📭 Tidak ada plugin aktif.');
          return;
        }
        const listText = active.map((p, idx) => `${idx + 1}. 🔌 *${p.name}* (${p.relativePath})`).join('\n');
        await ctx.reply(`🔌 *DAFTAR PLUGIN AKTIF*\n\n${listText}`);
        return;
      }

      // Activate plugin
      const target = allPlugins.find(p => p.name.toLowerCase() === name.toLowerCase() && !p.isActive);
      if (!target) {
        await ctx.reply(`❌ Plugin non-aktif bernama "${name}" tidak ditemukan.`);
        return;
      }

      const newPath = target.fullPath.replace('.disabled', '');
      try {
        renameSync(target.fullPath, newPath);
        await ctx.reply(`✅ Plugin *${target.name}* berhasil diaktifkan.`);
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengaktifkan plugin: ${err.message || err}`);
      }
    });

    // 2. DP (Deactivate Plugin or Deactive Plugins)
    client.command('dp', async (ctx) => {
      if (!(await checkOwner(ctx))) return;
      const name = ctx.args[0];
      const allPlugins = getAllPlugins();

      if (!name) {
        // List deactivated plugins
        const inactive = allPlugins.filter(p => !p.isActive);
        if (inactive.length === 0) {
          await ctx.reply('📭 Tidak ada plugin non-aktif.');
          return;
        }
        const listText = inactive.map((p, idx) => `${idx + 1}. 💤 *${p.name}* (${p.relativePath})`).join('\n');
        await ctx.reply(`💤 *DAFTAR PLUGIN NON-AKTIF*\n\n${listText}`);
        return;
      }

      // Deactivate plugin
      const target = allPlugins.find(p => p.name.toLowerCase() === name.toLowerCase() && p.isActive);
      if (!target) {
        await ctx.reply(`❌ Plugin aktif bernama "${name}" tidak ditemukan.`);
        return;
      }

      const newPath = target.fullPath + '.disabled';
      try {
        renameSync(target.fullPath, newPath);
        await ctx.reply(`💤 Plugin *${target.name}* berhasil dinonaktifkan.`);
      } catch (err: any) {
        await ctx.reply(`❌ Gagal menonaktifkan plugin: ${err.message || err}`);
      }
    });

    // 3. GP / GET (Get Plugin Code)
    client.command('gp|get', async (ctx) => {
      if (!(await checkOwner(ctx))) return;
      const name = ctx.args[0];
      if (!name) {
        await ctx.reply('⚠️ Harap masukkan nama plugin. Contoh: /get sticker');
        return;
      }

      const allPlugins = getAllPlugins();
      const target = allPlugins.find(p => p.name.toLowerCase() === name.toLowerCase());
      if (!target) {
        await ctx.reply(`❌ Plugin "${name}" tidak ditemukan.`);
        return;
      }

      try {
        const code = readFileSync(target.fullPath, 'utf-8');

        await client.send(ctx.message().key.remoteJid!).text(
          `\`\`\`typescript\n${code}\n\`\`\``,
          {
            rich: true,
            title: `🔌 Plugin: ${target.name}`,
            footer: `Path: src/plugins/${target.relativePath} | Status: ${target.isActive ? 'Aktif' : 'Non-aktif'}`
          }
        );
      } catch (err: any) {
        await ctx.reply(`❌ Gagal membaca plugin: ${err.message || err}`);
      }
    });

    // 4. FP / FIND (Find Plugins)
    client.command('fp|find', async (ctx) => {
      if (!(await checkOwner(ctx))) return;
      const query = ctx.args[0];
      if (!query) {
        await ctx.reply('⚠️ Harap masukkan kata kunci pencarian. Contoh: /find stick');
        return;
      }

      const allPlugins = getAllPlugins();
      const matches = allPlugins.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
      
      if (matches.length === 0) {
        await ctx.reply(`🔍 Tidak ada plugin yang cocok dengan kata kunci "${query}".`);
        return;
      }

      const listText = matches.map((p, idx) => 
        `${idx + 1}. ${p.isActive ? '🔌' : '💤'} *${p.name}* (${p.relativePath}) [${p.isActive ? 'Aktif' : 'Non-aktif'}]`
      ).join('\n');
      
      await ctx.reply(`🔍 *HASIL PENCARIAN PLUGIN ("${query}")*\n\n${listText}`);
    });

    // 5. APLUG (Add Plugin from replied code message)
    client.command('aplug', async (ctx) => {
      if (!(await checkOwner(ctx))) return;
      const pathArg = ctx.args[0];
      if (!pathArg) {
        await ctx.reply('⚠️ Harap masukkan nama path plugin. Contoh: /aplug media/test.ts');
        return;
      }

      const quoted = await ctx.replied();
      if (!quoted) {
        await ctx.reply('⚠️ Silakan reply pesan yang berisi kode plugin.');
        return;
      }

      const code = quoted.text;
      if (!code) {
        await ctx.reply('❌ Pesan yang di-reply tidak berisi teks/kode.');
        return;
      }

      // Clean up code formatting (remove markdown code block wrappers if any)
      let cleanedCode = code.trim();
      if (cleanedCode.startsWith('```')) {
        const lines = cleanedCode.split('\n');
        if (lines[0].startsWith('```')) lines.shift();
        if (lines[lines.length - 1].startsWith('```')) lines.pop();
        cleanedCode = lines.join('\n');
      }

      const targetPath = join(process.cwd(), 'src/plugins', pathArg);

      try {
        const dir = dirname(targetPath);
        mkdirSync(dir, { recursive: true });
        writeFileSync(targetPath, cleanedCode, 'utf-8');
        await ctx.reply(`✅ Plugin berhasil dibuat di *src/plugins/${pathArg}*`);
      } catch (err: any) {
        await ctx.reply(`❌ Gagal membuat plugin: ${err.message || err}`);
      }
    });

    // 6. DPLUG (Delete Plugin)
    client.command('dplug', async (ctx) => {
      if (!(await checkOwner(ctx))) return;
      const name = ctx.args[0];
      if (!name) {
        await ctx.reply('⚠️ Harap masukkan nama plugin yang ingin dihapus. Contoh: /dplug test');
        return;
      }

      const allPlugins = getAllPlugins();
      const target = allPlugins.find(p => p.name.toLowerCase() === name.toLowerCase());
      if (!target) {
        await ctx.reply(`❌ Plugin "${name}" tidak ditemukan.`);
        return;
      }

      try {
        unlinkSync(target.fullPath);
        await ctx.reply(`🗑️ Plugin *${target.name}* (${target.relativePath}) berhasil dihapus.`);
      } catch (err: any) {
        await ctx.reply(`❌ Gagal menghapus plugin: ${err.message || err}`);
      }
    });
  }
};
