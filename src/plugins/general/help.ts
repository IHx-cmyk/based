import { Client } from 'zaileys';
import { Plugin } from '../../types.js';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function getRuntime(seconds: number) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}h ${h}j ${m}m ${s}d`;
}

export const helpPlugin: Plugin = {
  name: 'help',
  setup(client: Client) {
    async function sendHelp(targetJid: string, arg: string, quotedKey?: any) {
      const runtime = getRuntime(process.uptime());

      // Cari path background secara aman
      const imagePathCwd = path.join(process.cwd(), 'src/source/backgroud.png');
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const imagePathDir = path.join(__dirname, '../../source/backgroud.png');

      let selectedImagePath = '';
      if (existsSync(imagePathCwd)) {
        selectedImagePath = imagePathCwd;
      } else if (existsSync(imagePathDir)) {
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
        } else if (replyTarget.key) {
          replyTarget = {
            ...replyTarget,
            message: replyTarget.message || { conversation: 'Button Click' }
          };
        }
      }

      const replyIfTarget = (builder: any) => {
        return replyTarget ? builder.reply(replyTarget) : builder;
      };

      const sendCategoryMenu = async (title: string, content: string) => {
        try {
          await replyIfTarget(client.send(targetJid).buttons(
            [
              { id: 'opt_help', text: '🏠 Menu Utama' },
              { id: 'btn_menu_all', text: '📋 Semua Menu' }
            ],
            {
              title: title,
              text: content,
              image: selectedImagePath ? readFileSync(selectedImagePath) : undefined,
              footer: 'Tekan tombol di bawah untuk navigasi'
            }
          ));
        } catch (err) {
          console.error(`Failed to send category menu buttons for ${title}:`, err);
          await replyIfTarget(client.send(targetJid).text(content));
        }
      };

      if (arg === 'umum' || arg === 'general') {
        const subMenu = `*📂 MENU: UMUM*

🤖 *INFO SISTEM*
 ├ Based : Zaileys
 └ Uptime : ${runtime}

📋 *DAFTAR PERINTAH*
 🔹 /ping - Cek latensi bot
 🔹 /help - Bantuan menu utama`;
        await sendCategoryMenu('> Menu Umum', subMenu);
        return;
      }

      if (arg === 'mutasi' || arg === 'mutation' || arg === 'otomatisasi' || arg === 'automation') {
        // Arahkan kategori mutasi dan otomatisasi ke owner secara langsung
        const subMenu = `*⚙️ MENU: OWNER*

ℹ️ Kategori *mutasi* dan *otomatisasi* sekarang berada di menu *owner*.

 🔹 /presence <mode> - Atur status kehadiran
 🔹 /selfmode <mode> - Atur mode public/self
 🔹 /broadcast <pesan> - Kirim pesan massal
 🔹 /schedule <detik> <teks> - Jadwalkan pesan
 🔹 /delete - Hapus pesan bot
 🔹 /react <emoji> - Reaksi emoji ke pesan
 🔹 /edit <teks> - Edit pesan bot
 🔹 /push - Kirim pesan ke channel
 🔹 /ap <nama> - Aktifkan/List plugin aktif
 🔹 /dp <nama> - Nonaktifkan/List plugin mati
 🔹 /get <nama> - Dapatkan kode plugin
 🔹 /find <query> - Cari plugin
 🔹 /aplug <path> - Tambahkan plugin baru
 🔹 /dplug <nama> - Hapus plugin`;
        await sendCategoryMenu('> Menu Owner', subMenu);
        return;
      }

      if (arg === 'grup' || arg === 'group') {
        const subMenu = `*👥 MENU: GRUP*

 🔹 /groupinfo - Cek info detail grup
 🔹 /tagall <pesan> - Tag semua anggota
 🔹 /promote <tag> - Jadikan admin grup
 🔹 /demote <tag> - Turunkan dari admin
 🔹 /kick <tag> - Keluarkan anggota
 🔹 /add <nomor> - Tambahkan anggota baru`;
        await sendCategoryMenu('> Menu Grup', subMenu);
        return;
      }

      if (arg === 'interactive' || arg === 'interaktif') {
        const subMenu = `*✨ MENU: INTERAKTIF*

 🔹 /buttons - Contoh pesan tombol
 🔹 /list - Contoh pesan daftar list
 🔹 /carousel - Contoh pesan carousel
 🔹 /markdown - Format teks kaya
 🔹 /poll <tanya>|<opsi> - Buat voting poll
 🔹 /template - Pesan templat
 🔹 /bottomsheet - Menu lembar bawah
 🔹 /limitedoffer - Penawaran terbatas
 🔹 /reminder - Pengingat pesan
 🔹 /location - Kirim lokasi
 🔹 /airich - Integrasi AI kaya`;
        await sendCategoryMenu('> Menu Interaktif', subMenu);
        return;
      }

      if (arg === 'maker' || arg === 'pembuat') {
        const subMenu = `*🎨 MENU: MAKER*

 🔹 /sticker - Ubah gambar/video ke stiker (alias: /s)
 🔹 /qwa - Bikin gambar quote WA dari chat`;
        await sendCategoryMenu('> Menu Maker', subMenu);
        return;
      }

      if (arg === 'media') {
        const subMenu = `*🖼️ MENU: MEDIA*

 🔹 /image <url> - Kirim gambar dari URL
 🔹 /video <url> - Kirim video dari URL
 🔹 /audio <url> - Kirim audio dari URL
 🔹 /album - Kirim album foto/video`;
        await sendCategoryMenu('> Menu Media', subMenu);
        return;
      }

      if (arg === 'owner' || arg === 'pemilik') {
        const subMenu = `*⚙️ MENU: OWNER*

 🔹 /presence <mode> - Atur status kehadiran
 🔹 /selfmode <mode> - Atur mode public/self
 🔹 /broadcast <pesan> - Kirim pesan massal
 🔹 /schedule <detik> <teks> - Jadwalkan pesan
 🔹 /delete - Hapus pesan bot
 🔹 /react <emoji> - Reaksi emoji ke pesan
 🔹 /edit <teks> - Edit pesan bot
 🔹 /push - Kirim pesan ke channel (alias: /ch, /saluran)
 🔹 /ap <nama> - Aktifkan/List plugin aktif
 🔹 /dp <nama> - Nonaktifkan/List plugin mati
 🔹 /get <nama> - Dapatkan kode plugin
 🔹 /find <query> - Cari plugin
 🔹 /aplug <path> - Tambahkan plugin baru
 🔹 /dplug <nama> - Hapus plugin`;
        await sendCategoryMenu('> Menu Owner', subMenu);
        return;
      }

      if (arg === 'penyimpanan' || arg === 'storage') {
        const subMenu = `*💾 MENU: PENYIMPANAN*

 🔹 /history - Cek riwayat pesan`;
        await sendCategoryMenu('> Menu Penyimpanan', subMenu);
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
└──

┌── *2. GRUP (group)*
│ 🔹 /groupinfo
│ 🔹 /tagall <pesan>
│ 🔹 /promote <tag>
│ 🔹 /demote <tag>
│ 🔹 /kick <tag>
│ 🔹 /add <nomor>
└──

┌── *3. INTERAKTIF (interactive)*
│ 🔹 /buttons
│ 🔹 /list
│ 🔹 /carousel
│ 🔹 /markdown
│ 🔹 /poll <tanya>|<opsi>
│ 🔹 /template
│ 🔹 /bottomsheet
│ 🔹 /limitedoffer
│ 🔹 /reminder
│ 🔹 /location
│ 🔹 /airich
└──

┌── *4. MAKER (maker)*
│ 🔹 /sticker
│ 🔹 /qwa
└──

┌── *5. MEDIA (media)*
│ 🔹 /image <url>
│ 🔹 /video <url>
│ 🔹 /audio <url>
│ 🔹 /album
└──

┌── *6. OWNER (owner)*
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
│ 🔹 /get <nama>
│ 🔹 /find <query>
│ 🔹 /aplug <path>
│ 🔹 /dplug <nama>
└──

┌── *7. PENYIMPANAN (storage)*
│ 🔹 /history
└──`;
        
        let sentAll = false;
        try {
          await replyIfTarget(client.send(targetJid).buttons(
            [
              { id: 'opt_help', text: '🏠 Menu Utama' }
            ],
            {
              title: '> Semua Perintah',
              text: allMenu,
              image: selectedImagePath || undefined,
              footer: 'Tekan tombol di bawah untuk navigasi'
            }
          ));
          sentAll = true;
        } catch (err) {
          console.error('Failed to send all help buttons:', err);
        }

        if (!sentAll) {
          if (selectedImagePath) {
            try {
              await replyIfTarget(client.send(targetJid).image(selectedImagePath, { caption: allMenu }));
              sentAll = true;
            } catch (err) {
              console.error('Failed to send all help image:', err);
            }
          }
          if (!sentAll) {
            await replyIfTarget(client.send(targetJid).text(allMenu));
          }
        }
        return;
      }

      const mainText = `🌠  *System Info*
 ├ Based : Zaileys
 └ Uptime : ${runtime}

✢ Cmd: */help <category>*

*Category:*
- *general*
- *group*
- *interactive*
- *maker*
- *media*
- *owner*
- *storage*
- *all*`;

      let sentMain = false;
      try {
        // Kirim menu utama menggunakan buttons interaktif dengan bottom sheet
        await replyIfTarget(client.send(targetJid).buttons(
          [
            { id: 'btn_menu_umum', text: 'Umum (General)' },
            { id: 'btn_menu_grup', text: 'Grup (Group)' },
            { id: 'btn_menu_interaktif', text: 'Interaktif (Interactive)' },
            { id: 'btn_menu_maker', text: 'Maker' },
            { id: 'btn_menu_media', text: 'Media' },
            { id: 'btn_menu_owner', text: 'Owner (Pemilik)' },
            { id: 'btn_menu_penyimpanan', text: 'Penyimpanan (Storage)' },
            { id: 'btn_menu_all', text: 'Semua Menu (All)' }
          ],
          {
            title: '> Shnny Bot',
            text: mainText,
            image: selectedImagePath ? readFileSync(selectedImagePath) : undefined,
            footer: '¢ - Shn',
            bottomSheet: {
              listTitle: 'Pilih Kategori Menu',
              buttonTitle: '✉️ Menu',
              buttonsLimit: 2
            }
          }
        ));
        sentMain = true;
      } catch (err) {
        console.error('Failed to send buttons menu:', err);
      }

      if (!sentMain) {
        // Kirim teks biasa/gambar jika pengiriman tombol interaktif gagal
        let sentImageOnly = false;
        if (selectedImagePath) {
          try {
            await replyIfTarget(client.send(targetJid).image(selectedImagePath, { caption: `╔════════════════════╗\n      *SHNNY BOT*\n╚════════════════════╝\n` + mainText }));
            sentImageOnly = true;
          } catch (err) {
            console.error('Failed to send help image fallback:', err);
          }
        }
        if (!sentImageOnly) {
          await replyIfTarget(client.send(targetJid).text(`╔════════════════════╗\n      *SHNNY BOT*\n╚════════════════════╝\n` + mainText));
        }
      }
    }

    // Interseptor pesan masuk untuk mendeteksi klik menu kategori manual
    client.use(async (ctx, next) => {
      const text = (ctx.text || '').trim().toLowerCase();
      if (text === 'umum 🔹' || text === 'btn_menu_umum' || text === 'general') {
        ctx.command = 'help';
        ctx.args = ['general'];
      } else if (text === 'grup 👥' || text === 'btn_menu_grup' || text === 'group') {
        ctx.command = 'help';
        ctx.args = ['group'];
      } else if (text === 'interaktif 🔹' || text === 'btn_menu_interaktif' || text === 'interactive') {
        ctx.command = 'help';
        ctx.args = ['interactive'];
      } else if (text === 'maker 🔹' || text === 'btn_menu_maker' || text === 'maker') {
        ctx.command = 'help';
        ctx.args = ['maker'];
      } else if (text === 'media 🔹' || text === 'btn_menu_media' || text === 'media') {
        ctx.command = 'help';
        ctx.args = ['media'];
      } else if (text === 'owner 🔹' || text === 'btn_menu_owner' || text === 'owner') {
        ctx.command = 'help';
        ctx.args = ['owner'];
      } else if (text === 'penyimpanan 🔹' || text === 'btn_menu_penyimpanan' || text === 'storage') {
        ctx.command = 'help';
        ctx.args = ['storage'];
      } else if (text === 'semua menu 📋' || text === 'btn_menu_all') {
        ctx.command = 'help';
        ctx.args = ['all'];
      }
      await next();
    });

    client.command('help|menu', async (ctx) => {
      await ctx.react('♻️');
      await ctx.react('');
      await ctx.react('❇️');
      const arg = (ctx.args[0] || '').toLowerCase().trim();
      await sendHelp(ctx.message().key.remoteJid!, arg, ctx.message());
    });

    // Proses event klik tombol interaktif secara native
    client.on('button-click', async (ctx) => {
      const buttonId = ctx.buttonId;
      if (buttonId.startsWith('btn_menu_') || buttonId === 'opt_help') {
        let category = '';
        if (buttonId === 'btn_menu_all') category = 'all';
        else if (buttonId === 'btn_menu_umum') category = 'general';
        else if (buttonId === 'btn_menu_grup') category = 'group';
        else if (buttonId === 'btn_menu_interaktif') category = 'interactive';
        else if (buttonId === 'btn_menu_maker') category = 'maker';
        else if (buttonId === 'btn_menu_media') category = 'media';
        else if (buttonId === 'btn_menu_owner') category = 'owner';
        else if (buttonId === 'btn_menu_penyimpanan') category = 'storage';
        else if (buttonId === 'opt_help') category = '';
        else return;

        await sendHelp(ctx.key.remoteJid!, category, ctx.key);
      }
    });

    // Proses event pemilihan opsi list menu secara native
    client.on('list-select', async (ctx) => {
      const rowId = ctx.rowId;
      if (rowId.startsWith('btn_menu_') || rowId === 'opt_help') {
        let category = '';
        if (rowId === 'btn_menu_all') category = 'all';
        else if (rowId === 'btn_menu_umum') category = 'general';
        else if (rowId === 'btn_menu_grup') category = 'group';
        else if (rowId === 'btn_menu_interaktif') category = 'interactive';
        else if (rowId === 'btn_menu_maker') category = 'maker';
        else if (rowId === 'btn_menu_media') category = 'media';
        else if (rowId === 'btn_menu_owner') category = 'owner';
        else if (rowId === 'btn_menu_penyimpanan') category = 'storage';
        else if (rowId === 'opt_help') category = '';
        else return;

        await sendHelp(ctx.key.remoteJid!, category, ctx.key);
      }
    });
  }
};

