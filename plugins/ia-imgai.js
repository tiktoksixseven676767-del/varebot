import axios from "axios";

async function generateImage(prompt) {
    try {
        let attempts = 0;
        while (attempts < 3) {
            try {
                const encodedPrompt = encodeURIComponent(
                    `${prompt}, professional photography, 8k uhd, highly detailed, photorealistic, sharp focus, masterpiece`
                );
                const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
                const response = await axios.get(imageUrl, {
                    responseType: 'arraybuffer',
                    timeout: 45000
                });

                return Buffer.from(response.data).toString('base64');
            } catch (error) {
                attempts++;
                if (attempts === 3) throw error;
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
    } catch (error) {
        console.error('Errore generazione:', error);
        throw new Error('Errore nella generazione dell\'immagine');
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`╭─『 🎨 *Generatore Immagini AI* 』
├ Usa: ${usedPrefix + command} <descrizione>
├ Esempio: ${usedPrefix + command} gatto persiano
│
├ *Limiti:*
├ • ✨ Tutti gli utenti: ∞ generazioni
╰───────────◈`);
    }

    try {
        await conn.sendPresenceUpdate('composing', m.chat);
        const startTime = Date.now();
        const enhancedPrompt = `${text}, masterpiece, professional photography, 8k uhd, highly detailed, photorealistic, sharp focus, dramatic lighting, artstation trending`;
        
        const imageBase64 = await Promise.race([
            generateImage(enhancedPrompt),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('⌛ Timeout: la generazione ha impiegato troppo tempo')), 45000)
            )
        ]);
        
        const endTime = Date.now();
        const timeElapsed = ((endTime - startTime) / 1000).toFixed(1);

        await conn.sendMessage(
            m.chat,
            {
                image: Buffer.from(imageBase64, 'base64'),
                caption: `╭─『 🎨 *Immagine Generata* 』
├ ✨ *Prompt:* ${text}
├ ⏱️ *Tempo:* ${timeElapsed}s
├ 💫 *Generazioni:* ∞ (Illimitate)
├ 👑 *Status:* Utente
╰───────────◈

◈ ━━ *vare ✧ bot* ━━ ◈`,
                fileName: 'generated_image.png'
            },
            { quoted: m }
        );
        await conn.sendPresenceUpdate('paused', m.chat);
    } catch (error) {
        console.error('Errore:', error);
        m.reply(`╭─『 ❌ *Errore Generazione* 』
├ • ${error.message}
├ • Riprova tra qualche minuto
╰──────────────────◈`);
    }
};

handler.help = ['imgai (testo)'];
handler.tags = ['strumenti', 'ia', 'iaimmagini'];
handler.command = ['imgai', 'immagina'];
handler.register = true;

export default handler;
