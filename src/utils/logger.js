// ANSI Escape Codes for Styling
export const RESET = '\x1b[0m';
export const BOLD = '\x1b[1m';
export const CYAN = '\x1b[36m';
export const MAGENTA = '\x1b[35m';
export const YELLOW = '\x1b[33m';
export const GREEN = '\x1b[32m';
export const GRAY = '\x1b[90m';
export const WHITE = '\x1b[37m';
export function stripAnsi(str) {
    return str.replace(/\x1b\[[0-9;]*m/g, '');
}
export function getStringWidth(str) {
    const cleanStr = stripAnsi(str);
    let width = 0;
    for (let i = 0; i < cleanStr.length; i++) {
        const code = cleanStr.charCodeAt(i);
        // Check for high surrogate pair
        if (code >= 0xD800 && code <= 0xDBFF) {
            width += 1;
        }
        else if ((code >= 0x4E00 && code <= 0x9FFF) || // CJK Unified Ideographs
            (code >= 0x3400 && code <= 0x4DBF) || // CJK Extension A
            (code >= 0xAC00 && code <= 0xD7AF) || // Hangul Syllables
            (code >= 0xF900 && code <= 0xFAFF) || // CJK Compatibility Ideographs
            (code >= 0xFF00 && code <= 0xFFEF) // Halfwidth and Fullwidth Forms
        ) {
            width += 2;
        }
        else {
            width += 1;
        }
    }
    return width;
}
export function wrapText(text, width) {
    const lines = [];
    const rawLines = text.split('\n');
    for (const rawLine of rawLines) {
        let currentLine = '';
        let currentWidth = 0;
        const words = rawLine.split(' ');
        for (const word of words) {
            const wordWidth = getStringWidth(word);
            const spaceWidth = currentLine ? 1 : 0;
            if (currentWidth + spaceWidth + wordWidth <= width) {
                currentLine += (currentLine ? ' ' : '') + word;
                currentWidth += spaceWidth + wordWidth;
            }
            else {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = '';
                    currentWidth = 0;
                }
                // Character wrap if word is longer than box width
                let tempWord = '';
                let tempWidth = 0;
                for (let i = 0; i < word.length; i++) {
                    const char = word[i];
                    const charWidth = getStringWidth(char);
                    if (tempWidth + charWidth <= width) {
                        tempWord += char;
                        tempWidth += charWidth;
                    }
                    else {
                        lines.push(tempWord);
                        tempWord = char;
                        tempWidth = charWidth;
                    }
                }
                currentLine = tempWord;
                currentWidth = tempWidth;
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }
    }
    return lines;
}
// Logger Pesan Masuk Global (Box Format)
export async function logIncomingMessage(ctx, msgType) {
    try {
        const time = new Date(ctx.timestamp).toLocaleTimeString('id-ID');
        const isGroup = ctx.isGroup;
        // Resolve group name if in group
        let groupName = 'Tidak Diketahui';
        if (isGroup) {
            try {
                groupName = (await ctx.roomName()) || 'Tidak Diketahui';
            }
            catch {
                groupName = 'Tidak Diketahui';
            }
        }
        const sender = ctx.senderName
            ? `${ctx.senderName} (${ctx.senderId.split('@')[0]})`
            : ctx.senderId.split('@')[0];
        const typeMap = {
            text: 'Teks',
            image: 'Gambar 🖼️',
            video: 'Video 🎥',
            audio: 'Audio 🎵',
            document: 'Dokumen 📄',
            sticker: 'Stiker 🏷️',
        };
        const typeStr = typeMap[msgType] || msgType;
        // Determine dynamic box width based on terminal size, capped between 50 and 70
        const termWidth = process.stdout.columns || 80;
        const boxWidth = Math.max(50, Math.min(termWidth - 4, 70));
        // Safe truncation limits
        const maxSenderLen = boxWidth - 20;
        const displaySender = sender.length > maxSenderLen
            ? sender.slice(0, maxSenderLen - 3) + '...'
            : sender;
        const maxGroupLen = boxWidth - 20;
        const displayGroupName = groupName.length > maxGroupLen
            ? groupName.slice(0, maxGroupLen - 3) + '...'
            : groupName;
        // Format metadata info lines
        const infoLines = [
            isGroup ? `  ${GRAY}👥 Grup     :${RESET} ${BOLD}${MAGENTA}${displayGroupName}${RESET}` : null,
            `  ${GRAY}👤 Pengirim :${RESET} ${BOLD}${YELLOW}${displaySender}${RESET}`,
            `  ${GRAY}🕒 Waktu    :${RESET} ${GREEN}${time}${RESET}`,
            `  ${GRAY}📂 Tipe     :${RESET} ${CYAN}${typeStr}${RESET}`
        ].filter(Boolean);
        // Format message content body
        const bodyLines = [];
        if (ctx.text && ctx.text.trim()) {
            const wrapped = wrapText(ctx.text.trim(), boxWidth - 6);
            bodyLines.push(...wrapped.map(line => `  ${line}`));
        }
        else if (msgType !== 'text') {
            bodyLines.push(`  ${GRAY}[Tidak ada caption/teks]${RESET}`);
        }
        // Format centered title
        const titleClean = ` 📩 PESAN MASUK (${isGroup ? '👥 GRUP' : '👤 PRIBADI'}) `;
        const titleWidth = getStringWidth(titleClean);
        const titlePadLeft = Math.max(0, Math.floor((boxWidth - 4 - titleWidth) / 2));
        const titlePadRight = Math.max(0, boxWidth - 4 - titleWidth - titlePadLeft);
        const paddedTitle = ' '.repeat(titlePadLeft) + `${BOLD}${WHITE}${titleClean}${RESET}` + ' '.repeat(titlePadRight);
        const borderTop = `${CYAN}╭${'─'.repeat(boxWidth - 2)}╮${RESET}`;
        const borderMid = `${CYAN}├${'─'.repeat(boxWidth - 2)}┤${RESET}`;
        const borderBottom = `${CYAN}╰${'─'.repeat(boxWidth - 2)}╯${RESET}`;
        const printBoxLine = (content) => {
            const contentWidth = getStringWidth(content);
            const padding = ' '.repeat(Math.max(0, boxWidth - 4 - contentWidth));
            console.log(`${CYAN}│${RESET} ${content}${padding} ${CYAN}│${RESET}`);
        };
        console.log('\n' + borderTop);
        console.log(`${CYAN}│${RESET} ${paddedTitle} ${CYAN}│${RESET}`);
        console.log(borderMid);
        for (const line of infoLines) {
            printBoxLine(line);
        }
        if (bodyLines.length > 0) {
            console.log(borderMid);
            for (const line of bodyLines) {
                printBoxLine(line);
            }
        }
        console.log(borderBottom + '\n');
    }
    catch (err) {
        console.error('⚠️ Gagal menampilkan log pesan masuk:', err);
    }
}
