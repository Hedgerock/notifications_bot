import {BOT} from "../../../../../config/index.js";
import {botGetQueuesKeyboard} from "../../../keyBoards/index.js";
import {NAVIGATION_KEY_GROUP_OPERATIONS} from "../../../../../dictionary/index.js";
import {AppCoreConstants} from "../../../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {TelegramCallbackQuery} query
 * @param {string} title
 * @param {string} groupId
 * @returns {Promise<void>}
 */
export async function caseUpdateCurrentGroupQueuesFunction(query, title, groupId) {

    const keyboardMarkup = (await botGetQueuesKeyboard(groupId, {
        navigationKey: NAVIGATION_KEY_GROUP_OPERATIONS,
        hasBackButton: true,
        fromSelection: false
    })).reply_markup

    const textMessage = `Пожалуйста выберите очереди, за которыми будет следить группа ${title}`;

    await AppCoreConstants.TELEGRAM_BOT.editMessageText(
        textMessage, {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id,
            reply_markup: keyboardMarkup
        }
    )

}