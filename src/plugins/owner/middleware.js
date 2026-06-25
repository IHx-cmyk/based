import { definePlugin } from 'zaileys';
// Global state untuk mode public/self
export let publicMode = true;
export function setPublicMode(value) {
    publicMode = value;
}
export default definePlugin({
    name: 'general-middleware',
    setup(ctx) {
        ctx.use(async (c, next) => {
            // Cek apakah pengirim adalah owner
            const isOwner = await c.citation.authors();
            // Jika mode self dan pengirim bukan owner, abaikan perintah
            if (!publicMode && !isOwner) {
                return; // Hentikan middleware chain
            }
            try {
                await ctx.client.presence.typing(c.message().key.remoteJid, 1000);
            }
            catch (err) {
                // Ignored presence errors
            }
            await next();
        });
    }
});
