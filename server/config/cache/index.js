import * as redis from "redis";

let client;

export const REDIS_CLIENT = async () => {
    if (!client) {
        client = redis.createClient({
            url: process.env.REDIS_URL
        });

        client.on("error", (e) => {
            console.error("Something went wrong in Redis", e);
        })

        await client.connect();
    }

    return client
}