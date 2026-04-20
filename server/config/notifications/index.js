import Queue from "bull";

let bull;

export const NOTIFY_QUEUE = () => {
    if (!bull) {
        /** @type {import("bull").Queue} */
        bull = new Queue("notify", process.env.REDIS_URL, {
            limiter: {
                max: parseInt(process.env.QUEUE_LIMIT_MAX, 10),
                duration: parseInt(process.env.QUEUE_LIMIT_DURATION, 10)
            }
        });
    }

    return bull
}