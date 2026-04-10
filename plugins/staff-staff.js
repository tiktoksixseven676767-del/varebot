let handler = async (m, { conn, command, usedPrefix }) => {
    let staff = `
ㅤㅤ⋆｡˚『 ╭ \`STAFF VAREBOT\` ╯ 』˚｡⋆\n╭\n│
│ 『 🤖 』 \`Bot:\` *${global.nomebot}*
│ 『 🍥 』 \`Versione:\` *${global.versione}*
│
│⭒─ׄ─『 👑 \`Sviluppatore\` 』 ─ׄ─⭒
│
│ • \`Nome:\` *MAZZU*
│ • \`Ruolo:\` *Creatore / dev*
│ • \`Contatto:\` @3391952345
│
│⭒─ׄ─『 🛡️ \`Moderatori\` 』 ─ׄ─⭒
│
│ • \`Nome:\` *felix*
│ • \`Ruolo:\` *Moderatore*
│ • \`Contatto:\` @393760517466
│
│
│─ׄ─『 📌 \`Info Utili\` 』 ─ׄ─⭒
│
│ • \`GitHub:\` *github.com/realvare*
│ • \`Supporto:\` @393476686131
│ • \`Telegram:\` *t.me/realvare*
│ • *instagram.com/samakavare*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;
    await conn.reply(
        m.chat, 
        staff.trim(), 
        m, 
        { 
            ...global.fake,
            contextInfo: {
                ...global.fake,
                mentionedJid: ['393476686131@s.whatsapp.net', '67078163216@s.whatsapp.net', '393511082922@s.whatsapp.net'],
                externalAdReply: {
                    renderLargerThumbnail: true,
                    title: 'STAFF - UFFICIALE',
                    body: 'Supporto e Moderazione',
                    mediaType: 1,
                    sourceUrl: 'varebot',
                    thumbnailUrl: 'https://i.ibb.co/rfXDzMNQ/aizenginnigga.jpg'
                }
            }
        }
    );

    await conn.sendMessage(m.chat, {
        contacts: {
            contacts: [
                {
                    vcard: `BEGIN:VCARD
VERSION:3.0
FN:Sam aka Vare
ORG:VareBot - Creatore
TEL;type=CELL;type=VOICE;waid=393476686131:+393476686131
END:VCARD`
                },
                {
                    vcard: `BEGIN:VCARD
VERSION:3.0
FN:Felix
ORG:VareBot - Moderatore
TEL;type=CELL;type=VOICE;waid=67078163216:+67078163216
END:VCARD`
                },
                {
                    vcard: `BEGIN:VCARD
VERSION:3.0
FN:Gio
ORG:VareBot - Moderatore
TEL;type=CELL;type=VOICE;waid=393511082922:+393511082922
END:VCARD`
                }
            ]
        }
    }, { quoted: m });

    m.react('🉐');
};

handler.help = ['staff'];
handler.tags = ['main'];
handler.command = ['staff', 'moderatori', 'collaboratori'];

export default handler;