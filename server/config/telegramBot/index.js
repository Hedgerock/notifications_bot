import TelegramBot from "node-telegram-bot-api";

let bot;

/**
 *
 * @param {boolean} isNotATest
 * @constructor
 */
export const BOT = (isNotATest) => {
    if (!bot) {
        bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
                polling: isNotATest,
            }
        )
    }

    return bot;
};
