import { MessageEmbed } from "discord.js";

export default async function buildErrorMessage(err: string) {
    let embed = new MessageEmbed()
    .setAuthor("Error", "https://blog.sqlauthority.com/wp-content/uploads/2016/01/erroricon1.png")
    .setDescription(`${err}`)
    .setColor("#d71f34")
    .setFooter(`© Copyright Checksum`)
    .setTimestamp();
    return embed;
}