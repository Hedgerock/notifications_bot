import {
    CASE_MUTE_OPTION,
    CASE_UNMUTE_OPTION,
    NAVIGATION_KEY_GROUP_OPERATIONS,
    NAVIGATION_KEY_USER_OPERATIONS,
    UTILITY_DELIMITER_FOR_DATA,
    UTILITY_WITH_BACK_BUTTON
} from "../../../../dictionary/index.js";
import {userService} from "../../../../service/index.js";
import {groupService} from "../../../../service/group/GroupService.js";
import {botGetSubscriptionKeyboard} from "../../keyBoards/index.js";
import {BOT} from "../../../../config/index.js";
import {AppCoreConstants} from "../../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {TelegramMessage | TelegramCallbackQuery} query
 * @param {string} data
 * @returns {Promise<void>}
 */
export async function caseMuteUnmuteSelectionFunction(query, data) {
    let isMuted;

    const [currentMutedSelection, currentId, navigationKey, hasBackButtonValue] =
        data.split(UTILITY_DELIMITER_FOR_DATA);

    const mutedSelection = `${currentMutedSelection}${UTILITY_DELIMITER_FOR_DATA}`;

    switch (mutedSelection) {
        case CASE_MUTE_OPTION:
            isMuted = true;
            break;
        case CASE_UNMUTE_OPTION:
            isMuted = false;
            break;
        default:
            throw new Error(`Invalid muted status ${mutedSelection}`);
    }

    switch (navigationKey) {
        case NAVIGATION_KEY_USER_OPERATIONS:
            const userInfo = await userService.getSubscribedStatusById(currentId);
            await userService.updateSubscribedStatus(currentId, {
                ...userInfo,
                mutedStatus: isMuted
            });
            break;
        case NAVIGATION_KEY_GROUP_OPERATIONS:
            const groupInfo = await groupService.getSubscribedStatusById(currentId);
            await groupService.updateSubscribedStatusById(currentId, {
                ...groupInfo,
                mutedStatus: isMuted
            });
            break;
        default:
            throw new Error(`Navigation key ${navigationKey} not found`)
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