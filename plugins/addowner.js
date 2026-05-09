let handler = async (m, { conn, text, usedPrefix, command }) => {
    let isCreator = false
    try {
        const sender = m.sender.split('@')[0]
        isCreator = global.sam
            .map(entry => Array.isArray(entry) ? entry[0] : entry)
            .map(v => v.toString())
            .includes(sender)
    } catch (e) {
        console.error('Errore verifica creatore:', e)
    }

    if (!isCreator) return m.reply('*⚠️ Solo il creatore del bot può aggiungere nuovi owner*')
    if (!text && !m.quoted) return m.reply(`*⚠️ Tagga un utente o scrivi il numero da rendere owner*\n\n*Esempio:*\n${usedPrefix + command} @user\n${usedPrefix + command} 39333xxxxxxx`)

    let who
    if (m.isGroup) {
        who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    } else {
        who = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    }

    if (!who || who.length < 10) return m.reply('*⚠️ Numero non valido o utente non trovato*')

    const targetNumber = who.split('@')[0]
    const targetName = await conn.getName(who).catch(() => targetNumber)

    // Controllo se è già owner
    if (global.owner.map(([number]) => number).includes(targetNumber)) {
        return m.reply('*⚠️ Questo utente è già nella lista degli owner*')
    }

    try {
        // 1. Aggiunta alla variabile globale in memoria
        global.owner.push([targetNumber, targetName, true])

        const fs = await import('fs')
        const path = await import('path')
        const configPath = path.join(process.cwd(), 'config.js')

        // 2. Lettura e aggiornamento del file config.js
        let configContent = await fs.promises.readFile(configPath, 'utf8')
        
        // Cerchiamo l'inizio dell'array global.owner nel file
        const ownerRegex = /global\.owner\s*=\s*\[/
        if (ownerRegex.test(configContent)) {
            const newLine = `\n  ['${targetNumber}', '${targetName}', true],`
            configContent = configContent.replace(ownerRegex, `global.owner = [${newLine}`)
            await fs.promises.writeFile(configPath, configContent, 'utf8')
        }

        // 3. Aggiornamento privilegi nel database
        if (global.db.data.users[who]) {
            global.db.data.users[who].role = 'owner'
            global.db.data.users[who].premium = true
            global.db.data.users[who].premiumTime = Infinity // O una data molto lontana
        }

        await m.reply(`*✅ @${targetNumber} è ora un Owner*\n\n*Privilegi assegnati:*\n• Comandi Owner sbloccati\n• Premium illimitato\n• Badge amministratore\n\n*✓ Config.js aggiornato con successo*`, null, {
            mentions: [who]
        })

    } catch (e) {
        console.error('Errore mettiowner:', e)
        m.reply('*❌ Errore durante la modifica del file di configurazione*')
    }
}

handler.help = ['mettiowner @user']
handler.tags = ['creatore']
handler.command = /^(mettiowner|addowner|setowner)$/i
handler.creatorebot = true
handler.owner = true 

export default handler
