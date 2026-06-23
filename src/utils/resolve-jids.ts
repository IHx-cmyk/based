import { Client, resolveUsername } from 'zaileys';

// Helper robust untuk mendapatkan JID dari mention, reply, atau argumen (no HP / username / LID)
export async function resolveJids(ctx: any, client: Client): Promise<string[]> {
  const jids: string[] = [];
  
  // Helper untuk membersihkan dan menstandarkan format JID
  function normalizeJid(jidStr: string): string {
    const clean = jidStr.trim();
    if (!clean.includes('@')) {
      // Jika 32 karakter hex, ini adalah LID hash (misal: AC404A91E51A8D751DEF5057CC96D05C)
      if (/^[0-9a-fA-F]{32}$/.test(clean)) {
        return clean.toLowerCase() + '@lid';
      }
      // Jika berupa angka saja, asumsikan JID pengguna reguler
      if (/^\d+$/.test(clean)) {
        return clean + '@s.whatsapp.net';
      }
    }
    return clean;
  }
  
  // 1. Ambil dari mentions
  if (ctx.mentions && ctx.mentions.length > 0) {
    for (const j of ctx.mentions) {
      if (j) {
        jids.push(normalizeJid(j));
      }
    }
  }
  
  // 2. Ambil dari reply pesan (quoted message)
  const quoted = await ctx.replied();
  if (quoted && quoted.senderId) {
    jids.push(normalizeJid(quoted.senderId));
  }
  
  // 3. Ambil dari argumen teks (jika mentions dan reply kosong)
  if (jids.length === 0 && ctx.args && ctx.args.length > 0) {
    for (const arg of ctx.args) {
      const cleanArg = arg.replace(/^@/, '').trim();
      if (!cleanArg) continue;
      
      const normalized = normalizeJid(cleanArg);
      if (normalized.includes('@')) {
        jids.push(normalized);
      } else {
        // Jika tidak bisa dinormalisasi langsung, coba resolve username via Zaileys
        try {
          if (client.socket) {
            const resolved = await resolveUsername(
              client.socket as any,
              cleanArg,
              (client as any).usernameCache
            );
            if (resolved) {
              jids.push(resolved);
            }
          }
        } catch (e) {
          // Abaikan error resolving username
        }
      }
    }
  }
  
  // Filter unik agar tidak duplikat dan valid
  return [...new Set(jids)].filter(j => j.includes('@'));
}
