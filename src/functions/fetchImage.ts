import { search } from 'booru';
import { Images } from './database';

export default async function fetchImage(override: boolean) {
    let urlcache = null;
    let tag = "solo";

    if (override == true) tag = "";

    let searchsites = ["kc", "kn", "yd", "db"];
    let site = searchsites[Math.floor(Math.random() * searchsites.length)];

    await search(`${site}`, [`${tag}`], { limit: 1, random: true })
        .then(async posts => {
            for (let post of posts) {
                urlcache = `${post.fileUrl}`;

                let bannedexts = ["zip", "mp4", "webm"]; // Deny these extensions (we do not support them) 
                let ext: any = urlcache.split('.').pop();
                if (bannedexts.includes(ext)) return fetchImage(false);

                const result = await Images.findOne({ where: { url: urlcache } });
                if (result) {
                    console.log(`Skipping ${urlcache}. The image has already been reviewed.`);
                    return fetchImage(false);
                };
                continue;
            }
        })
    return urlcache;
}