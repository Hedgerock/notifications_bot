import {BOT} from "../../../../config/index.js";
import {botGetQueuesKeyboard} from "../../keyBoards/index.js";
import {UTILITY_DELIMITER_FOR_DATA, UTILITY_WITH_BACK_BUTTON} from "../../../../dictionary/index.js";
import {getQueue} from "../../../../service/index.js";
import {AppCoreConstants} from "../../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {TelegramCallbackQuery} query
 * @param {string} data
 * @param {QueueInstance[]} rawQueues
 * @param {boolean} boolForChange
 * @returns {Promise<void>}
 */
export async function caseUpdateAllFunction(query, data, rawQueues, boolForChange) {
    const [_, currentId, navigationKey, withBackButton] = data.split(UTILITY_DELIMITER_FOR_DATA);
    const queueService = getQueue();
    const userSelection = await queueService.getUserSelection(currentId);

    rawQueues.forEach(el => {
        const code = el.code;
        if (userSelection[code] !== boolForChange) {
            userSelection[code] = boolForChange;
        }
    })

    await queueService.setUserSelection(currentId, userSelection);

    const keyboardReplyMarkup = (await botGetQueuesKeyboard(currentId, {
        navigationKey, hasBackButton: withBackButton === UTILITY_WITH_BACK_BUTTON, fromSelection: true
    })).reply_markup

    await AppCoreConstants.TELEGRAM_BOT.editMessageReplyMarkup(keyboardReplyMarkup, {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id
    })
}