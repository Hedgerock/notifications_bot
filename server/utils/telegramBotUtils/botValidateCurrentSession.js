import {sessionService} from "../../service/index.js";
import {AppCoreConstants} from "../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function botValidateCurrentSession(userId) {
    const oldSession = await sessionService.getSession(userId);

    if (oldSession) {
        if (oldSession.lastMessage) {
            await AppCoreConstants.TELEGRAM_BOT.deleteMessage(userId, oldSession.lastMessage.message_id).catch(e => {
                console.error("Сообщение не надйено", e.message);
            });

            // AppCoreConstants.TELEGRAM_BOT.sendMessage(userId, "Предыдущая сессия закрыта.");
        }
        await sessionService.endSession(userId);
    }
}