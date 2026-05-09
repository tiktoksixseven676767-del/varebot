let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Ora il controllo è gestito da handler.owner = true alla fine del file.
    // Solo chi è già in global.owner può eseguire questo comando.

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

        // 2. Lettura e aggiornamento del file config.js per la persistenza
        if (fs.existsSync(configPath)) {
            let configContent = await fs.promises.readFile(configPath, 'utf8')
            const ownerRegex = /global\.owner\s*=\s*\[/
            
            if (ownerRegex.test(configContent)) {
                const newLine = `\n  ['${targetNumber}', '${targetName}', true],`
                configContent = configContent.replace(ownerRegex, `global.owner = [${newLine}`)
                await fs.promises.writeFile(configPath, configContent, 'utf8')
            }
        }

        // 3. Aggiornamento privilegi nel database
        if (global.db.data.users[who]) {
            global.db.data.users[who].role = 'owner'
            global.db.data.users[who].premium = true
            global.db.data.users[who].premiumTime = Infinity 
        }

        await m.reply(`*✅ @${targetNumber} è stato aggiunto agli Owner da @${m.sender.split('@')[0]}*\n\n*✓ Config.js aggiornato*`, null, {
            mentions: [who, m.sender]
        })

    } catch (e) {
        console.error('Errore mettiowner:', e)
        m.reply('*❌ Errore durante la modifica del file di configurazione, ma l\'utente è stato aggiunto temporaneamente.*')
    }
}

handler.help = ['mettiowner @user']
handler.tags = ['owner']
handler.command = /^(mettiowner|addowner|setowner)$/i

// IMPORTANTE: Queste righe permettono a qualsiasi owner di usare il comando
handler.owner = true 
handler.creatorebot = false // Non serve più che sia solo il creatore supremo

export default handler
