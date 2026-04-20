import {userService} from "../service/index.js";
import {botOnStartFunction} from "../utils/telegramBotUtils/commands/index.js";
import {botDeleteMessage} from "../utils/telegramBotUtils/index.js";
import {AppCoreConstants} from "../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {(msg: TelegramMessage) => Promise<void>} handler
 * @returns {(msg: TelegramMessage) => Promise<void>}
 */
export function withUserCheck(handler) {

    return async(msg) => {
        const userId = msg.from.id;

        const user = await userService.getUserById(userId);

        if (!user) {
            await botOnStartFunction(msg);
            return;
        }

        await AppCoreConstants.TELEGRAM_BOT.sendChatAction(userId, "typing");

        await botDeleteMessage(msg);

        await handler(msg);
    }
}