const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");
const ytdl = require("ytdl-core");

const TOKENLER = ["TOKEN1", "TOKEN2", "TOKEN3"]; // Kullanıcı tokenlerini buraya ekle
const SES_KANALI_ID = "1234567890"; // Ses kanalının ID'sini buraya gir
const YOUTUBE_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Çalınacak şarkının YouTube linki

async function createBot(token) {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
    });

    client.once("ready", async () => {
        console.log(`${client.user.tag} giriş yaptı!`);

        const channel = await client.channels.fetch(SES_KANALI_ID);
        if (channel && channel.isVoiceBased()) {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: false, // Kullanıcı tokeni olduğu için selfDeaf kapalı olmalı
            });

            console.log(`${client.user.tag} ses kanalına katıldı ve şarkı çalıyor.`);
            playMusic(connection);
        }
    });

    await client.login(token);
}

function playMusic(connection) {
    const player = createAudioPlayer();
    const stream = ytdl(YOUTUBE_URL, { filter: "audioonly", quality: "highestaudio" });
    const resource = createAudioResource(stream);

    player.play(resource);
    connection.subscribe(player);
}

async function startBots() {
    for (const token of TOKENLER) {
        createBot(token);
    }
}

startBots();
