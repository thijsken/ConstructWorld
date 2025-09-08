require("dotenv").config(); // bovenaan
const express = require("express");
const { status } = require("minecraft-server-util");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const PORT = 3000;

// --- Minecraft server config ---
const MINECRAFT_HOST = "minecraft.deboernet.eu";
const MINECRAFT_PORT = 23022;

// --- Discord bot config ---
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // haal uit .env
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

let botStatus = { online: false, commands: 0 };
let discordMembers = [];

// --- Bot ready ---
bot.once("ready", async () => {
  console.log(`Bot ${bot.user.tag} is online`);
  botStatus.online = true;
  botStatus.commands = bot.application.commands.cache.size;

  // Fetch members van alle guilds waar bot in zit
  for (const guild of bot.guilds.cache.values()) {
    await guild.members.fetch();
    discordMembers = guild.members.cache.map(m => ({
      name: m.user.username,
      role: m.roles.highest.name,
      status: m.presence?.status || "offline",
      joined: m.joinedAt ? m.joinedAt.toISOString().split("T")[0] : "-"
    }));
  }
});

bot.login(BOT_TOKEN);

// --- Minecraft API endpoint ---
app.get("/api/server", async (req, res) => {
  try {
    const result = await status(MINECRAFT_HOST, MINECRAFT_PORT, { timeout: 5000 });
    res.json({
      online: true,
      players: result.players.online,
      maxPlayers: result.players.max,
      version: result.version.name,
      ip: `${MINECRAFT_HOST}:${MINECRAFT_PORT}`
    });
  } catch (err) {
    res.json({ online: false, players: 0, maxPlayers: 0, version: null, ip: `${MINECRAFT_HOST}:${MINECRAFT_PORT}` });
  }
});

// --- Bot API endpoint ---
app.get("/api/bot", (req, res) => {
  res.json(botStatus);
});

// --- Discord members endpoint ---
app.get("/api/discord", (req, res) => {
  res.json(discordMembers);
});

// --- Start server ---
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
