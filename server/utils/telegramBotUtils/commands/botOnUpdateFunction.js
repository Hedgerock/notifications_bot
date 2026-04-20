import {botValidateCurrentSession} from "../botValidateCurrentSession.js";
import {botGetQueuesKeyboard} from "../keyBoards/index.js";
import {sessionService} from "../../../service/index.js";
import {AppCoreConstants} from "../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {TelegramMessage | TelegramCallbackQuery} msg
 * @returns {Promise<void>}
 */
export async function botOnUpdateFunction(msg) {
    const userId = msg.from.id;

    await botValidateCurrentSession(userId);

    const message = await AppCoreConstants.TELEGRAM_BOT.sendMessage(
        userId,
        "Пожалуйста выберите очереди, за которыми вы хотите следить",
        await botGetQueuesKeyboard(userId)
    )

    await sessionService.updateSession(userId, message);
}