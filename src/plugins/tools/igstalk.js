import { definePlugin } from 'zaileys';
import { config } from '../../types.js';
export default definePlugin({
    name: 'igstalk',
    setup(ctx) {
        ctx.command('igs', async (c) => {
            const username = c.args[0];
            if (!username) {
                await c.reply('⚠️ Silakan masukkan username Instagram target.\nContoh: */igstalk abcde_2803*');
                return;
            }
            try {
                const apiUrl = `https://api.zpi.web.id/v1/social-media:instagram-scraper/profile/${encodeURIComponent(username)}`;
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'x-api-key': config.zpi,
                    },
                });
                if (!response.ok) {
                    throw new Error(`API HTTP error status: ${response.status}`);
                }
                const resJson = await response.json();
                if (!resJson || !resJson.data) {
                    await c.reply(`❌ Profil @${username} tidak ditemukan atau API sedang error.`);
                    return;
                }
                const profile = resJson.data;
                const fullName = profile.fullName || '-';
                const biography = profile.biography || '-';
                const category = profile.category || '-';
                const externalUrl = profile.externalUrl || '-';
                const followerCount = profile.followerCount || 0;
                const followingCount = profile.followingCount || 0;
                const postCount = profile.postCount || 0;
                const reelsCount = profile.reelsCount || 0;
                const isVerified = profile.isVerified ? '✓ Verified' : '';
                const isPrivate = profile.isPrivate ? 'Ya 🔒' : 'Tidak 🔓';
                const isBusinessAccount = profile.isBusinessAccount ? 'Ya 🏢' : 'Tidak';
                const isProfessionalAccount = profile.isProfessionalAccount ? 'Ya 💻' : 'Tidak';
                const avatar = profile.avatar;
                const bioLinks = profile.bioLinks || [];
                let linkText = '';
                if (bioLinks.length > 0) {
                    linkText = '\n\n🔗 *BIO LINKS:*';
                    for (const link of bioLinks) {
                        linkText += `\n• ${link.title || 'Link'}: ${link.url}`;
                    }
                }
                const caption = `👤 *INSTAGRAM PROFILE STALKER*

» *Username:* @${profile.username} ${isVerified ? '🔹' : ''}
» *Nama:* ${fullName}
» *Kategori:* ${category}
» *Bio:* ${biography}
» *Link Bio:* ${externalUrl}

📊 *STATISTIK*
» *Pengikut (Followers):* ${followerCount.toLocaleString('id-ID')}
» *Mengikuti (Following):* ${followingCount.toLocaleString('id-ID')}
» *Postingan:* ${postCount}
» *Reels:* ${reelsCount}

🔒 *STATUS*
» *Akun Privat:* ${isPrivate}
» *Akun Bisnis:* ${isBusinessAccount}
» *Akun Profesional:* ${isProfessionalAccount}${linkText}
`;
                const remoteJid = c.message().key.remoteJid;
                let imageBuffer = null;
                if (avatar) {
                    try {
                        const imgRes = await fetch(avatar);
                        if (imgRes.ok) {
                            imageBuffer = Buffer.from(await imgRes.arrayBuffer());
                        }
                    }
                    catch (e) {
                        console.error('Failed to fetch avatar image:', e);
                    }
                }
                if (imageBuffer) {
                    await ctx.client.send(remoteJid).image(imageBuffer, { caption });
                }
                else {
                    await c.reply(caption);
                }
            }
            catch (err) {
                console.error('❌ Error IG Stalk API:', err);
                await c.reply(`❌ Terjadi kesalahan saat memanggil API: ${err.message || err}`);
            }
        });
    },
});
