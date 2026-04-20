import {NAVIGATION_KEY_GROUP_OPERATIONS, UTILITY_DELIMITER_FOR_DATA} from "../../../../dictionary/index.js";
import {botGetSubscriptionKeyboard} from "../../keyBoards/index.js";
import {BOT} from "../../../../config/index.js";
import {AppCoreConstants} from "../../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {TelegramMessage | TelegramCallbackQuery} query
 * @param {string} data
 * @returns {Promise<void>}
 */
export async function caseSpecificSubscriptionOption(query, data) {
    const [_, navigationKey, title, currentId] = data.split(UTILITY_DELIMITER_FOR_DATA)

    switch (navigationKey) {
        case NAVIGATION_KEY_GROUP_OPERATIONS:
            const keyboardMarkup = (await botGetSubscriptionKeyboard(currentId, {
                navigationKey: NAVIGATION_KEY_GROUP_OPERATIONS,
                hasBackButton: true,
                fromSelection: false
            })).reply_markup

            const textMessage = `Выберите, будет ли присылаться уведомления группе ${title}`;

            await AppCoreConstants.TELEGRAM_BOT.editMessageText(
                textMessage, {
                    chat_id: query.message.chat.id,
                    message_id: query.message.message_id,
                    reply_markup: keyboardMarkup
                }
            )
            break;
        default:
            throw new Error(`Navigation key ${navigationKey} not found`)
    }

}