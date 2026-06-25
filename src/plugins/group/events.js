import { definePlugin } from 'zaileys';
export default definePlugin({
    name: 'group-events',
    setup(ctx) {
        // User join group
        ctx.on('group-join', async (payload) => {
            const { groupId, participants } = payload;
            for (const participant of participants) {
                const jid = participant.jid;
                const mentionText = `@${jid.split('@')[0]}`;
                const welcomeMessage = `👋 *Welcome to the group!*\n\n` +
                    `Selamat datang ${mentionText} di grup ini.\n` +
                    `Semoga betah dan silakan perkenalkan diri Anda ya!`;
                await ctx.client.send(groupId).text(welcomeMessage).mentions([jid]);
            }
        });
        // User leave group
        ctx.on('group-leave', async (payload) => {
            const { groupId, participants } = payload;
            for (const participant of participants) {
                const jid = participant.jid;
                const mentionText = `@${jid.split('@')[0]}`;
                const goodbyeMessage = `😢 *Goodbye!*\n\n` +
                    `Selamat jalan ${mentionText}.\n` +
                    `Terima kasih telah bersama kami di grup ini.`;
                await ctx.client.send(groupId).text(goodbyeMessage).mentions([jid]);
            }
        });
    }
});
