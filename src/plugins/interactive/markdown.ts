import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const markdownPlugin: Plugin = {
  name: 'markdown',
  setup(client: Client) {
    client.command('markdown', async (ctx) => {
      const message = [
        '✨ *Rich Markdown Response* ✨',
        '',
        'Zaileys mendukung render teks kaya (rich text formatting) menggunakan format Markdown standar:',
        '',
        '*Teks Tebal (Bold)*',
        '_Teks Miring (Italic)_',
        '~Teks Coret (Strikethrough)~',
        '```ts',
        '// Kode block syntax highlighting',
        'const bot = new Client();',
        '```',
        '',
        ':::suggest',
        'Dukungan Tombol Cepat | Kunjungi Github',
        ':::'
      ].join('\n');

      await client.send(ctx.message().key.remoteJid!).text(message, {
        rich: true,
        title: '📰 Info Terkini',
        footer: 'Zaileys AI-Rich Format'
      });
    });
  }
};
