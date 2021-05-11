import { Client, TextChannel } from "discord.js";
import review from "../functions/review";

export default async function start(client: Client) {
    let guild = client.guilds.cache.get("793034391738777670");
    guild?.channels.cache.filter(ch => ch.name.startsWith("review-") && ch.name !== "review-log").forEach(ch => (ch as TextChannel).send("The bot has restarted! The last pending-review image sent in this channel is not reviewable!") && review(client, ch as TextChannel));
}