const { Images } = require('./database');

export default async function createImage(urlcache: any, user_id: any, rating: string) {
    return await Images.create({
        url: urlcache,
        rating: `${rating}`,
        user: `${user_id}`,
    });
}