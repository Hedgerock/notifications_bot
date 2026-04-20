import {
    NAVIGATION_KEY_GROUP_OPERATIONS,
    NAVIGATION_KEY_USER_OPERATIONS,
    UTILITY_DELIMITER_FOR_DATA, UTILITY_WITH_BACK_BUTTON
} from "../../../../dictionary/index.js";
import {groupService} from "../../../../service/group/GroupService.js";
import {botGetSubscriptionKeyboard} from "../../keyBoards/index.js";
import {BOT} from "../../../../config/index.js";
import {userService} from "../../../../service/index.js";
import {AppCoreConstants} from "../../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {TelegramCallbackQuery} query
 * @param {string} data
 * @returns {Promise<void>}
 */
export async function caseTimeUpdateStatusFunction(query, data) {
    const [_, navigationKey, currentId, timeId, hasBackButtonValue] = data.split(UTILITY_DELIMITER_FOR_DATA);

    switch (navigationKey) {
        case NAVIGATION_KEY_GROUP_OPERATIONS:
            const groupContent = await groupService.getSubscribedStatusById(currentId);
            await groupService.updateSubscribedStatusById(currentId, {
                ...groupContent,
                timeId: Number(timeId)
            })
            break;
        case NAVIGATION_KEY_USER_OPERATIONS:
            const userContent = await userService.getSubscribedStatusById(currentId);
            await userService.updateSubscribedStatus(currentId, {
                ...userContent,
                timeId: Number(timeId)
            })
            break;
        default:
            throw new Error(`Navigation key ${navigationKey} not found`);
    }


    const keyboardReplyMarkup =
        (await botGetSubscriptionKeyboard(currentId, {
                fromSelection: true,
                hasBackButton: hasBackButtonValue === UTILITY_WITH_BACK_BUTTON,
                navigationKey
            }
        )).reply_markup

    await AppCoreConstants.TELEGRAM_BOT.editMessageReplyMarkup(keyboardReplyMarkup, {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id
    });
}