import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const carouselPlugin: Plugin = {
  name: 'carousel',
  setup(client: Client) {
    client.command('carousel', async (ctx) => {
      await client.send(ctx.message().key.remoteJid!).carousel(
        [
          {
            title: 'Slide 1: Zaileys',
            subtitle: 'Simple & Type-safe',
            body: 'Membangun bot WhatsApp dengan sangat mudah menggunakan TypeScript/JavaScript.',
            footer: 'Halaman 1 dari 2',
            buttons: [
              { id: 'btn_sl1', text: 'Pilih Slide 1' }
            ]
          },
          {
            title: 'Slide 2: Fitur Kaya',
            subtitle: 'Interactive & Media',
            body: 'Mendukung tombol, daftar, carousel, media, stiker, dan mode markdown.',
            footer: 'Halaman 2 dari 2',
            buttons: [
              { id: 'btn_sl2', text: 'Pilih Slide 2' }
            ]
          }
        ],
        { text: 'Berikut adalah menu Carousel kami:' }
      );
    });
  }
};
