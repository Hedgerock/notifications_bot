import {getQueue} from "../../../../service/index.js";
import {BOT} from "../../../../config/index.js";
import {botGetQueuesKeyboard} from "../../keyBoards/index.js";
import {UTILITY_DELIMITER_FOR_DATA, UTILITY_WITH_BACK_BUTTON} from "../../../../dictionary/index.js";
import {AppCoreConstants} from "../../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param { string } data
 * @param {TelegramCallbackQuery } query
 * @returns {Promise<void>}
 */
export async function caseQueueSelectionFunction(query, data) {
    const [_, __, actualData, currentId, isBackButtonPresent, navigationKey ] =
        data.split(UTILITY_DELIMITER_FOR_DATA);
    const queueService = getQueue();

    const userSelection = await queueService.getUserSelection(currentId);

    userSelection[actualData] = !userSelection[actualData];

    await queueService.setUserSelection(currentId, userSelection);

    const keyBoardReplyMarkup = (await botGetQueuesKeyboard(currentId, {
        navigationKey,
        hasBackButton: isBackButtonPresent === UTILITY_WITH_BACK_BUTTON,
        fromSelection: true
    })).reply_markup

    await AppCoreConstants.TELEGRAM_BOT.editMessageReplyMarkup(keyBoardReplyMarkup, {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id
    })
}