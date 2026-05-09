let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text && !m.quoted) return m.reply(`*⚠️ Tagga un utente o scrivi il numero da rendere owner*\n\n*Esempio:*\n${usedPrefix + command} @user`)

    let who
    if (m.isGroup) {
        who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    } else {
        who = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    }

    if (!who || who.length < 10) return m.reply('*⚠️ Numero non valido o utente non trovato*')

    const targetNumber = who.split('@')[0]
    
    // Soluzione al TypeError: usiamo un try/catch interno o controllo diretto
    let targetName
    try {
        targetName = await conn.getName(who)
    } catch (e) {
        targetName = targetNumber
    }
    if (!targetName) targetName = targetNumber

    if (global.owner.map(([number]) => number).includes(targetNumber)) {
        return m.reply('*⚠️ Questo utente è già nella lista degli owner*')
    }

    try {
        global.owner.push([targetNumber, targetName, true])

        const fs = await import('fs')
        const path = await import('path')
        const configPath = path.join(process.cwd(), 'config.js')

        if (fs.existsSync(configPath)) {
            let configContent = await fs.promises.readFile(configPath, 'utf8')
            const ownerRegex = /global\.owner\s*=\s*\[/
            
            if (ownerRegex.test(configContent)) {
                const newLine = `\n  ['${targetNumber}', '${targetName}', true],`
                configContent = configContent.replace(ownerRegex, `global.owner = [${newLine}`)
                await fs.promises.writeFile(configPath, configContent, 'utf8')
            }
        }

        if (global.db.data.users[who]) {
            global.db.data.users[who].role = 'owner'
            global.db.data.users[who].premium = true
            global.db.data.users[who].premiumTime = Infinity 
        }

        await m.reply(`*✅ @${targetNumber} è stato aggiunto agli Owner*\n\n*✓ Config.js aggiornato*`, null, {
            mentions: [who]
        })

    } catch (e) {
        console.error('Errore mettiowner:', e)
        m.reply('*❌ Errore durante il salvataggio su file, ma l\'utente è attivo in RAM.*')
    }
}

handler.help = ['mettiowner @user']
handler.tags = ['owner']
handler.command = /^(mettiowner|addowner|setowner)$/i
handler.owner = true 

export default handler
