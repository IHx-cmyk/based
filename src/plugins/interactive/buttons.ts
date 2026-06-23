import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const buttonsPlugin: Plugin = {
  name: 'buttons',
  setup(client: Client) {
    client.command('buttons', async (ctx) => {
      await client.send(ctx.message().key.remoteJid!).buttons(
        [
          { id: 'btn_yes', text: 'Yes 👍' },
          { id: 'btn_no', text: 'No 👎' },
          { type: 'url', text: 'Open Github 🌐', url: 'https://github.com/zeative/zaileys' },
          { type: 'copy', text: 'Salin Kode Kupon 📋', code: 'ZAILEYS-2026' }
        ],
        {
          title: 'Interactive Buttons Menu',
          text: 'Pilih salah satu tombol di bawah ini:',
          footer: 'Powered by Zaileys'
        }
      );
    });
  }
};
