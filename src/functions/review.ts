import { Client, MessageEmbed, TextChannel } from "discord.js";
import fetchImage from "./fetchImage";
import createImage from "./createImage";
import { Users } from "./database";
import generateEmbed from "./generateEmbed";
import buildErrorMessage from "./buildErrorMessage";

export default async function review(client: Client, channel: TextChannel) {
    let result = await fetchImage(false);
    if (result == null || result == undefined) {
        console.log("URL was blank, requesting another image with override function.");
        result = await fetchImage(true);
    }

    let embed = new MessageEmbed()
        .setAuthor("Image not loading? Click here!", client.user?.displayAvatarURL({ dynamic: true }), `${result}`)
        .addFields([{
            name: 'Rating',
            value: 'None',
            inline: true,
        }, {
            name: "Reviewer",
            value: `None`,
            inline: true,
        }])
        .setImage(`${result}`)
        .setColor("#0D98BA")
        .setFooter(`© Copyright Checksum`);

    await channel.send(embed).then(async (msg: any) => {
        await msg.react("✅");
        await msg.react("❌");
        await msg.react("⛔");
        await msg.react("❔");

        const filter = (reaction: any) => {
            return ["✅", "❌", "⛔", "❔"].includes(reaction.emoji.name);
        };

        msg.awaitReactions(filter, { max: 1 })
            .then(async (collected: { first: () => any; }) => {
                const reaction = collected.first();
                const user = reaction.users.cache.last();

                const dbuser = await Users.findOne({ where: { userid: `${user.id}` } });
                if (!dbuser) {
                    await Users.create({
                        userid: `${user.id}`,
                        count: 0,
                    });
                }

                switch (reaction.emoji.name) {
                    case "✅":
                        console.log(`The image ${result} was marked as SFW`)
                        try {
                            // equivalent to: INSERT INTO tags (url, rating, user) values (?, ?, ?);
                            const image = await createImage(result, user.id, "SFW");
                            await dbuser?.increment('count')
                            await msg.edit(await generateEmbed(client, "SFW", image, `${result}`, user));
                            await msg.reactions.removeAll();
                            return review(client, channel as TextChannel);
                        }
                        catch (e) {
                            if (e.name === 'SequelizeUniqueConstraintError') {
                                return review(client, channel as TextChannel);
                            }
                            return review(client, channel as TextChannel);
                        }
                    case "❌":
                        console.log(`The image ${result} was marked as NSFW`)
                        try {
                            // equivalent to: INSERT INTO tags (url, rating, user) values (?, ?, ?);
                            const image = await createImage(result, user.id, "NSFW");
                            await dbuser?.increment('count')
                            await msg.edit(await generateEmbed(client, "NSFW", image, `${result}`, user));
                            await msg.reactions.removeAll();
                            return review(client, channel as TextChannel);
                        }
                        catch (e) {
                            if (e.name === 'SequelizeUniqueConstraintError') {
                                return review(client, channel as TextChannel);
                            }
                            return review(client, channel as TextChannel);
                        }
                    case "⛔":
                        console.log(`The image ${result} was marked as LOLI`)
                        try {
                            // equivalent to: INSERT INTO tags (url, rating, user) values (?, ?, ?);
                            const image = await createImage(result, user.id, "LOLI");
                            await dbuser?.increment('count')
                            await msg.edit(await generateEmbed(client, "LOLI", image, `${result}`, user));
                            await msg.reactions.removeAll();
                            return review(client, channel as TextChannel);
                        }
                        catch (e) {
                            if (e.name === 'SequelizeUniqueConstraintError') {
                                return review(client, channel as TextChannel);
                            }
                            return review(client, channel as TextChannel);
                        }
                    case "❔":
                        console.log(`The image ${result} was marked as MISC`)
                        try {
                            // equivalent to: INSERT INTO tags (url, rating, user) values (?, ?, ?);
                            const image = await createImage(result, user.id, "MISC");
                            await dbuser?.increment('count');
                            await msg.edit(await generateEmbed(client, "MISC", image, `${result}`, user));
                            await msg.reactions.removeAll();
                            return review(client, channel as TextChannel);
                        }
                        catch (e) {
                            if (e.name === 'SequelizeUniqueConstraintError') {
                                msg.channel.send(buildErrorMessage(`SequelizeUniqueConstraintError`));
                                return review(client, channel as TextChannel);
                            }
                            return review(client, channel as TextChannel);
                        }
                    default:
                        msg.channel.send(buildErrorMessage(`Something has very gone wrong, a reaction was interpreted where it should not be possible.`));
                        process.exit(1);
                }
            });
    });
}