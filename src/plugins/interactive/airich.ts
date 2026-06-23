import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const airichPlugin: Plugin = {
  name: 'airich',
  setup(client: Client) {
    const POSTER = 'https://placehold.co/600x800/png';
    const SHOT = 'https://placehold.co/512x512/png';
    const CLIP = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4';

    client.command('airich', async (ctx) => {
      const type = (ctx.args[0] || '').toLowerCase();

      try {
        if (type === 'briefing') {
          const briefingMd = [
            '*Tech Brief — Senin pagi* ☕',
            '',
            'Rangkuman harian dari [zaileys](https://github.com/zeative/zaileys).',
            'Sumber data dipantau otomatis. [](https://github.com/zeative/zaileys)',
            '',
            'Rumus hari ini: [E = mc^2|160|44]<https://latex.codecogs.com/png.image?E%20%3D%20mc%5E2>',
            '',
            '```typescript',
            "import { Client } from 'zaileys'",
            '',
            'const client = new Client()',
            '',
            "client.on('text', async (msg) => {",
            '  await client.send(msg.senderId).buttons(',
            "    [{ id: 'yes', text: 'Ya' }, { id: 'no', text: 'Tidak' }],",
            "    { text: 'Lanjut order?' },",
            '  )',
            '})',
            '```',
            '',
            '| Repo | Stars | Δ 24h |',
            '|---|---|---|',
            '| zaileys | 12.4k | +318 |',
            '| baileys | 15.1k | +92 |',
            '| venom | 6.2k | +11 |',
          ].join('\n');

          await client.send(ctx.message().key.remoteJid!).text(briefingMd, {
            rich: true,
            title: '📰 zaileys Daily',
            footer: '💡 Dibuat dengan zaileys — github.com/zeative/zaileys',
            sources: [['https://avatars.githubusercontent.com/u/9919?s=64', 'https://github.com/zeative/zaileys', 'zaileys on GitHub']],
          });

        } else if (type === 'gallery') {
          const galeriMd = [
            '*Galeri rilis v4* — geser untuk lihat tangkapan layar & klip.',
            '',
            `![shot](${POSTER})`,
            `![shot](${SHOT})`,
            '',
            ':::video',
            `${CLIP} | 10`,
            ':::',
            '',
            ':::tip',
            'Ketuk gambar untuk pratinjau penuh',
            ':::',
            '',
            ':::suggest',
            'Lihat changelog | Cara upgrade | Bandingkan v3 vs v4',
            ':::',
          ].join('\n');

          await client.send(ctx.message().key.remoteJid!).text(galeriMd, {
            rich: true,
            title: '🖼️ zaileys v4',
            footer: '#zaileys',
          });

        } else if (type === 'social') {
          const sosialMd = [
            'Lagi ramai dibahas komunitas 👇',
            '',
            ':::reels',
            `- user: zeative | title: Demo nativeFlow buttons | url: ${CLIP} | thumb: ${SHOT} | views: 12400 | likes: 980 | verified: true`,
            `- user: zeative | title: AIRich rich response | url: ${CLIP} | thumb: ${POSTER} | views: 8800 | likes: 740 | verified: true`,
            ':::',
            '',
            ':::post',
            `- user: zeative | title: zaileys v4 is out | caption: Buttons, carousel, AIRich — semua built-in. | thumb: ${SHOT} | likes: 1500 | comments: 132 | verified: true | source: GITHUB`,
            ':::',
            '',
            ':::suggest',
            'Tonton lagi | Bagikan',
            ':::',
          ].join('\n');

          await client.send(ctx.message().key.remoteJid!).text(sosialMd, {
            rich: true,
            title: '🔥 Trending',
          });

        } else if (type === 'store') {
          const tokoMd = [
            'Merch komunitas zaileys 🛍️',
            '',
            ':::product',
            `- title: Sticker Pack | price: Rp35.000 | sale: Rp25.000 | brand: zaileys | image: ${SHOT} | url: https://github.com/zeative/zaileys`,
            `- title: Hoodie Dev | price: Rp320.000 | sale: Rp275.000 | brand: zaileys | image: ${POSTER} | url: https://github.com/zeative/zaileys`,
            `- title: Mug Coder | price: Rp90.000 | sale: Rp69.000 | brand: zaileys | image: ${SHOT} | url: https://github.com/zeative/zaileys`,
            ':::',
            '',
            ':::suggest',
            'Lihat semua produk | Checkout',
            ':::',
          ].join('\n');

          await client.send(ctx.message().key.remoteJid!).text(tokoMd, {
            rich: true,
            title: '🛍️ zaileys Store',
          });

        } else {
          await ctx.reply(
            '⚠️ Silakan pilih tipe AIRich:\n' +
            '• */airich briefing* - Tech Briefing Layout\n' +
            '• */airich gallery* - Screen Gallery & Video Player\n' +
            '• */airich social* - Reels & Posts Layout\n' +
            '• */airich store* - Product Catalog Layout'
          );
        }
      } catch (err: any) {
        await ctx.reply(`❌ Gagal mengirim AIRich: ${err.message || err}`);
      }
    });
  }
};
