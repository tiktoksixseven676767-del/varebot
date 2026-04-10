// Lista dei numeri autorizzati (oltre all'owner)
// Inserisci i numeri senza '+' e con il prefisso internazionale (es. '393331234567')
const numeriAutorizzati = [
  '393203848641', 
  '393760517466'
];

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  // 1. Controllo permessi (Owner o lista autorizzati)
  const isAuthorized = isOwner || numeriAutorizzati.some(num => m.sender.includes(num));
  
  if (!isAuthorized) {
    return m.reply('❌ Non hai i permessi per usare questo comando.');
  }

  // 2. Controllo argomenti (Menzione e Quantità)
  // Esempio: .spawna @utente 1000
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
  let amount = args[1] ? args[1] : args[0]; // Prende il numero degli UC

  if (!who) return m.reply(`📑 *Uso corretto:*\n${usedPrefix + command} @utente <quantità>`);
  if (!amount || isNaN(amount)) return m.reply('❌ Inserisci una quantità valida di UC.');

  // 3. Controllo limite caratteri (Massimo 999 cifre)
  if (amount.toString().length > 999) {
    return m.reply('🚫 La quantità è troppo grande! Massimo 999 cifre.');
  }

  // 4. Aggiunta dei soldi nel Database
  let user = global.db.data.users[who];
  if (!user) return m.reply('❌ Utente non trovato nel database.');

  // Usiamo 'limit' come variabile, dato che è quella degli UnityCoin
  let previousAmount = user.limit || 0;
  user.limit = (Number(user.limit) || 0) + Number(amount);

  // 5. Messaggio di conferma
  const caption = `ㅤㅤ⋆｡˚『 ╭ \`SPAWN UC\` ╯ 』˚｡⋆\n╭\n│ 『 💸 』 \`Destinatario:\` @${who.split('@')[0]}\n│ 『 💰 』 \`Quantità:\` *+${amount} UC*\n│ 『 👛 』 \`Nuovo Saldo:\` *${user.limit}*\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;

  return conn.reply(m.chat, caption, m, { mentions: [who] });
};

handler.help = ['spawna @utente <quantità>'];
handler.tags = ['owner'];
handler.command = ['spawna', 'spawn'];
handler.rowner = false; // Gestiamo il permesso manualmente sopra per includere la lista

export default handler;
