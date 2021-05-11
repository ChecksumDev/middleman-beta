import { Client } from "discord.js";
import config from "./config";
import { Images, Users, Apikeys } from "./functions/database";
import start from "./functions/start";
let client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] })

client.on("ready", async () => {
    // Sync databases
    await Images.sync();
    await Users.sync();
    await Apikeys.sync();

    // Start the bot's functions
    console.log(`Logged in as ${client.user?.tag}! o/`)
    start(client);
})

client.login(config.token);