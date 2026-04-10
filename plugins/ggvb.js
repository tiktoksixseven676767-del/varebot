// Lista dei numeri autorizzati (oltre all'owner)
const numeriAutorizzati = [
  '393760517466', 
  '393203848641'
];

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  // 1. Controllo permessi (Owner o lista numeri specifici)
  const isAuthorized = isOwner || numeriAutorizzati.some(num => m.sender.includes(num));
  
  if (!isAuthorized) {
    return m.reply('❌ Non hai i permessi per generare ricchezza dal nulla.');
  }

  // 2. Controllo Quantità
  let amount = args[0]; 

  if (!amount || isNaN(amount)) {
    return m.reply(`📑 *Uso corretto:*\n${usedPrefix + command} <quantità>\n\nEsempio: ${usedPrefix + command} 1000000`);
  }

  // 3. Controllo limite caratteri (Massimo 999 cifre)
  if (amount.toString().length > 999) {
    return m.reply('🚫 Quantità esagerata! Massimo 999 caratteri.');
  }

  // 4. Accesso al Database dell'utente che scrive
  let user = global.db.data.users[m.sender];
  if (!user) return m.reply('❌ Errore: Profilo non trovato nel database.');

  // Aggiunta degli UC alla variabile 'limit'
  user.limit = (Number(user.limit) || 0) + Number(amount);

  // 5. Messaggio di successo (Stile grafico simile all'impiccato)
  const caption = `ㅤㅤ⋆｡˚『 ╭ \`SELF SPAWN\` ╯ 』˚｡⋆
╭
│ 『 👤 』 \`Utente:\` @${m.sender.split('@')[0]}
│ 『 💎 』 \`UC Generati:\` *+${amount}*
│ 『 👛 』 \`Nuovo Saldo:\` *${user.limit}*
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;

  return conn.reply(m.chat, caption, m, { mentions: [m.sender] });
};

handler.help = ['spawna <quantità>'];
handler.tags = ['owner'];
handler.command = /^(spawna|myspawn)$/i;

export default handler;
