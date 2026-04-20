import {botGetSubscriptionKeyboard} from "../../keyBoards/index.js";
import {
    CASE_SUBSCRIBED_OPTION,
    CASE_UNSUBSCRIBED_OPTION,
    NAVIGATION_KEY_GROUP_OPERATIONS,
    NAVIGATION_KEY_USER_OPERATIONS,
    UTILITY_DELIMITER_FOR_DATA,
    UTILITY_WITH_BACK_BUTTON
} from "../../../../dictionary/index.js";
import {userService} from "../../../../service/index.js";
import {groupService} from "../../../../service/group/GroupService.js";
import {AppCoreConstants} from "../../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param { TelegramCallbackQuery } query
 * @param { string } data
 * @returns {Promise<void>}
 */
export async function caseSubscribedStatusFunction(query, data) {
    let isSubscribed;

    const [subscriptionSelection, currentId, navigationKey, hasBackButtonValue] =
        data.split(UTILITY_DELIMITER_FOR_DATA);

    const subscriptionSelectionValue = `${subscriptionSelection}${UTILITY_DELIMITER_FOR_DATA}`;

    switch (subscriptionSelectionValue) {
        case CASE_SUBSCRIBED_OPTION:
            isSubscribed = true;
            break;
        case CASE_UNSUBSCRIBED_OPTION:
            isSubscribed = false;
            break;
        default:
            throw new Error(`Invalid subscription status ${subscriptionSelectionValue}`);
    }

    switch (navigationKey) {
        case NAVIGATION_KEY_USER_OPERATIONS:
            const userInfo = await userService.getSubscribedStatusById(currentId);
            await userService.updateSubscribedStatus(currentId, {
                ...userInfo,
                status: isSubscribed
            });
            break;
        case NAVIGATION_KEY_GROUP_OPERATIONS:
            const groupInfo = await groupService.getSubscribedStatusById(currentId);
            await groupService.updateSubscribedStatusById(currentId, {
                ...groupInfo,
                status: isSubscribed
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