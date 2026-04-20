import {sessionService} from "../../../../service/index.js";
import {AppCoreConstants} from "../../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function caseCloseOptionFunction(userId) {
    const { messageId, chatId } = (await sessionService.getSession(userId)).identifiers
    await AppCoreConstants.TELEGRAM_BOT.deleteMessage(chatId, messageId);
    await sessionService.endSession(userId)
}