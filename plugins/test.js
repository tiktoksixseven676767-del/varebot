let handler = async (m, { conn, usedPrefix, command }) => {
    // 1. Definiamo il messaggio principale
    let text = `Ciao @${m.sender.split('@')[0]}! 👋\n\nQuesto è un comando di prova per imparare a usare i bottoni. Scegli un'opzione qui sotto:`;

    // 2. Creiamo i bottoni (Struttura Interactive Message)
    const buttons = [
        {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
                display_text: "🎁 Ricevi un regalo",
                id: `${usedPrefix}spawna 100` // Esegue il comando che abbiamo creato prima!
            })
        },
        {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
                display_text: "⏰ Che ore sono?",
                id: `${usedPrefix}ora` // Un comando che restituisce l'ora
            })
        },
        {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
                display_text: "🌐 Apri Google",
                url: "https://www.google.com"
            })
        }
    ];

    // 3. Inviamo il messaggio con i bottoni
    await conn.sendMessage(m.chat, {
        text: text,
        footer: "Corso rapido Bottoni ✧ varebot",
        buttons: buttons,
        headerType: 1,
        mentions: [m.sender]
    }, { quoted: m });
};

// 4. Definiamo il comando aggiuntivo per l'ora (giusto per farlo funzionare)
if (global.db.data) {
    // Questo è un trucco per far funzionare il bottone dell'ora nello stesso file se vuoi
}

handler.help = ['test'];
handler.tags = ['prove'];
handler.command = /^(test|prova)$/i;

export default handler;
