import {sessionService, userService} from "../../../service/index.js";
import {botValidateCurrentSession} from "../botValidateCurrentSession.js";
import botDeleteMessage from "../botDeleteMessage.js";
import {botGetQueuesKeyboard} from "../keyBoards/index.js";
import {ENTITIES_TEMPLATE} from "../../../db/newInstanceTemplates/index.js";
import {AppCoreConstants} from "../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {TelegramMessage, TelegramCallbackQuery} msg
 * @returns {Promise<void>}
 */
export async function botOnStartFunction(msg) {
    const userId = msg.from.id;

    await botValidateCurrentSession(userId);
    await botDeleteMessage(msg);

    let user = await userService.getUserById(userId);

    if (!user) {
        user = await userService
            .createUser({
                ...ENTITIES_TEMPLATE.USER,
                social_media_id: userId,
                username: msg.from.username || "" ,
            })
    }

    const { queues } = await userService.getUserQueues(userId);

    if (!queues?.length) {

        const message = await AppCoreConstants.TELEGRAM_BOT.sendMessage(
            userId,
            "Выберите очереди за которыми хотели бы следить:",
            await botGetQueuesKeyboard(userId)
        );

        await sessionService.updateSession(userId, message);
        return;
    }

    const username = user.username;
    const queueValue = queues.length === 1 ? "ью" : "ями";
    const currentQueues = queues.map(q => q.code).join(" ");

    const message = await AppCoreConstants.TELEGRAM_BOT.sendMessage(userId,
        `На данный момент ${username} вы следите за очеред${queueValue} ${currentQueues}`);

    await sessionService.updateSession(userId, message);
    await botDeleteMessage(msg);
}