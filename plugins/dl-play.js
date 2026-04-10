import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import ytSearch from 'yt-search'

const execPromise = promisify(exec)
const tmpDir = path.join(process.cwd(), 'temp')
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

const A = [ 'bestaudio[ext=m4a]/bestaudio', '251', '140', 'bestaudio' ]
const V = [ '134+140', '135+140', '136+140' ]

async function runYtDlp(args) { 
    const ytdlpCommands = ['yt-dlp', 'python3 -m yt_dlp', 'python -m yt_dlp'];
    for (const cmd of ytdlpCommands) {
        try {
            const { stdout } = await execPromise(`${cmd} ${args.join(' ')}`, { maxBuffer: 50 * 1024 * 1024, shell: true });
            return { stdout };
        } catch (error) { continue; }
    }
    throw new Error('YT_DLP_NOT_FOUND');
}

async function download(url, outputPath, format, extractAudio = false) {
    const args = [
        `"${url}"`, '-f', format, '-o', `"${outputPath}"`,
        '--no-warnings', '--no-playlist', '--user-agent', '"Mozilla/5.0"',
    ];
    if (extractAudio) {
        args.push('-x', '--audio-format', 'mp3', '--audio-quality', '0');
    } else {
        args.push('--merge-output-format', 'mp4');
    }
    await runYtDlp(args);
}

let handler = async (m, { conn, command, text, usedPrefix }) => {
    const prefix = usedPrefix || '.';

    // Se l'utente clicca un bottone, leggiamo l'ID come testo del comando
    if (!text && m.quoted && m.quoted.buttonId) text = m.quoted.buttonId;
    
    // Rimuoviamo il comando se presente nel testo (es. ".playaudio url" -> "url")
    if (text) text = text.replace(new RegExp(`^${prefix}(playaudio|playvideo|play)\\s+`, 'i'), '');

    if (!text) return conn.reply(m.chat, `*Usa:* ${prefix + command} <nome/url>`, m);

    await conn.sendPresenceUpdate('composing', m.chat);
    const isUrl = text.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/);

    try {
        if (isUrl || command === 'playaudio' || command === 'playvideo') {
            const url = isUrl ? isUrl[0] : text;
            await downloadMedia(m, conn, command, url);
            return;
        }

        const search = await ytSearch(text);
        if (!search.videos.length) throw new Error('Nessun risultato trovato.');
        const results = search.videos.slice(0, 5);

        const cards = results.map((v, i) => ({
            image: { url: v.thumbnail },
            title: `${i + 1}. ${v.title.substring(0, 50)}`,
            body: `👤 ${v.author.name}\n⏱️ ${v.duration.timestamp}`,
            footer: 'vare ✧ bot',
            buttons: [
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🎵 Audio",
                        id: `${prefix}playaudio ${v.url}`
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🎥 Video",
                        id: `${prefix}playvideo ${v.url}`
                    })
                }
            ]
        }));

        await conn.sendMessage(m.chat, { text: `🔍 Risultati per: *${text}*`, cards }, { quoted: m });

    } catch (e) {
        m.reply('❌ Errore: ' + e.message);
    }
}

async function downloadMedia(m, conn, command, url) {
    const isVideo = command === 'playvideo';
    const fileName = `dl_${Date.now()}`;
    const tmpFile = path.join(tmpDir, fileName);
    const formats = isVideo ? V : A;
    
    try {
        await m.reply(`⏳ Scaricando ${isVideo ? 'il video' : "l'audio"}...`);
        
        let success = false;
        for (const f of formats) {
            try {
                await download(url, tmpFile, f, !isVideo);
                
                // yt-dlp aggiunge .mp3 o .mp4 a seconda del comando
                const actualFile = isVideo ? `${tmpFile}.mp4` : `${tmpFile}.mp3`;
                
                if (fs.existsSync(actualFile)) {
                    const buffer = fs.readFileSync(actualFile);
                    if (isVideo) {
                        await conn.sendMessage(m.chat, { video: buffer, mimetype: 'video/mp4', caption: '> vare ✧ bot' }, { quoted: m });
                    } else {
                        await conn.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mpeg' }, { quoted: m });
                    }
                    fs.unlinkSync(actualFile);
                    success = true;
                    break;
                }
            } catch (e) { continue; }
        }
        if (!success) throw new Error('Impossibile scaricare il media.');
    } catch (e) {
        m.reply('❌ Errore: ' + e.message);
    }
}

handler.command = ['play', 'playaudio', 'playvideo'];
export default handler;
