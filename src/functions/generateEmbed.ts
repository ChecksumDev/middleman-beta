import { Client, MessageEmbed, User } from "discord.js";

export default async function generateEmbed(client: Client, rating: String, dbimage: any, image: String, reviewer: User) {
    let embed = new MessageEmbed()
        .setAuthor("Middleman", client.user?.displayAvatarURL({ dynamic: true }), `${image}`)
        .setImage(`${image}`)
        .setFooter(`Image ID: ${dbimage.id}`)
        .setTimestamp();

    switch (rating) {
        case "SFW":
            embed.setColor("GREEN")
            embed.addField("Rating", "Safe for work.", true)
            break;

        case "NSFW":
            embed.setColor("RED")
            embed.addField("Rating", "Not safe for work.", true)
            break;

        case "LOLI":
            embed.setColor("PURPLE")
            embed.addField("Rating", "Loli.", true)
            break;

        case "MISC":
            embed.addField("Rating", "Miscellaneous.", true)
            break;

        default:
            embed.addField("Rating", "Malformed input.", true)
            break;
    }

    embed.addField("Reviewer", `${reviewer} (${reviewer.id})`, true)

    return embed;
}