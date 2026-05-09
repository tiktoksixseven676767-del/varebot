let handler = async (m, { conn, usedPrefix, command }) => {
    // Definizione della cifra enorme
    let amount = 10000e390 
    
    // Accediamo al database dell'utente
    let user = global.db.data.users[m.sender]
    
    // Aggiungiamo i soldi alla variabile .euro
    user.euro += amount
    
    // Reazione per confermare l'azione
    await conn.sendMessage(m.chat, {
        react: {
            text: '💰',
            key: m.key
        }
    })

    m.reply(`
╭━━⊱「 『 💰 』 \`MONEY\` 」
│ 
│ ➸ *Hai ricevuto:* │ ➸ ∞ Euro 🪙
│ 
│ 『 👝 』 \`Nuovo Saldo:\` 
│ ➸ *Infinito*
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`)
}

handler.help = ['money']
handler.tags = ['xp']
handler.command = ['money'] 

// Se vuoi che solo il proprietario possa usarlo, decommenta la riga sotto:
handler.owner = true 

export default handler
