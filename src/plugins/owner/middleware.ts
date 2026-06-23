import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

// Global state untuk mode public/self
export let publicMode = true;

export function setPublicMode(value: boolean) {
  publicMode = value;
}

export const middlewarePlugin: Plugin = {
  name: 'general-middleware',
  setup(client: Client) {
    client.use(async (ctx, next) => {
      // Cek apakah pengirim adalah owner
      const isOwner = await ctx.citation.authors();
      
      // Jika mode self dan pengirim bukan owner, abaikan perintah
      if (!publicMode && !isOwner) {
        return; // Hentikan middleware chain
      }

      try {
        await client.presence.typing(ctx.message().key.remoteJid!, 1000);
      } catch (err) {
        // Ignored presence errors
      }
      await next();
    });
  }
};
