import {
    CASE_CLOSE_OPTION,
    CASE_NOOP_STATUS_OPTION,
    NAVIGATION_KEY_GROUP_OPERATIONS,
    NAVIGATION_KEY_USER_OPERATIONS,
    TEMPLATE_OF_CASE_SPECIFIC_TIME_UPDATE_OPTION,
    UTILITY_EMPTY_VALUE,
    UTILITY_WITH_BACK_BUTTON,
    UTILITY_WITHOUT_BACK_BUTTON
} from "../../../dictionary/index.js";
import {userService} from "../../../service/index.js";
import {getSubscriptionKeyboardContent, getTimePairs} from "./utils/botGetSubscriptionKeyboardUtils/index.js";
import {format} from "../../format.js";
import {emojis} from "../../../constants/index.js";
import {groupService} from "../../../service/group/GroupService.js";

/**
 *
 * @param {string} currentId
 * @param {KeyboardOptions} options
 * @returns {Promise<{reply_markup: {inline_keyboard}}>}
 */
export async function botGetSubscriptionKeyboard(currentId, options = {
    fromSelection: false,
    navigationKey: NAVIGATION_KEY_USER_OPERATIONS,
    hasBackButton: false
}) {
    const {fromSelection, navigationKey, hasBackButton} = options

    if (!fromSelection) {
        switch (navigationKey) {
            case NAVIGATION_KEY_USER_OPERATIONS:
                await userService.removeSubscribedStatus(currentId);
                break;
            case NAVIGATION_KEY_GROUP_OPERATIONS:
                await groupService.removeSubscribedStatus(currentId);
                break;
            default:
                throw new Error(`Navigation key ${navigationKey} not found`);
        }
    }

    const {
        backButtonText,
        actualBackButtonCallbackData,
        subscribedText,
        subscribedCallBackData,
        unsubscribedText,
        unsubscribedCallBackData,
        subscriptionDecisionCallbackData,
        timeId,
        mutedText,
        mutedCallBackData,
        unmutedText,
        unmutedCallBackData,
    } = await getSubscriptionKeyboardContent(currentId, options);

    const timePairs = await getTimePairs(timeId);

    return {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: backButtonText, callback_data: actualBackButtonCallbackData },
                    { text: UTILITY_EMPTY_VALUE, callback_data: CASE_NOOP_STATUS_OPTION },
                    { text: "Закрыть", callback_data: CASE_CLOSE_OPTION }
                ],
                [
                    {
                        text: subscribedText,
                        callback_data: subscribedCallBackData
                    },
                    {
                        text: unsubscribedText,
                        callback_data: unsubscribedCallBackData
                    },
                ],
                [
                    {
                        text: mutedText,
                        callback_data: mutedCallBackData,
                    },
                    {
                        text: unmutedText,
                        callback_data: unmutedCallBackData,
                    }
                ],
                ...timePairs.map(value => {
                    return value.map(time => {

                        const timeTextContent =
                            `${time.isCurrent ? emojis.selected : emojis.unselected} ${time.value} минут`;
                        const timeCallBackData =
                            timeId !== time.id
                                ? format(
                                    TEMPLATE_OF_CASE_SPECIFIC_TIME_UPDATE_OPTION,
                                    navigationKey,
                                    currentId,
                                    time.id,
                                    hasBackButton ? UTILITY_WITH_BACK_BUTTON : UTILITY_WITHOUT_BACK_BUTTON
                                )
                                : CASE_NOOP_STATUS_OPTION;

                        return {
                            text: timeTextContent,
                            callback_data: timeCallBackData
                        }
                    })
                }),
                [
                    {
                        text: "Подтвердить",
                        callback_data: subscriptionDecisionCallbackData
                    }
                ],
            ]
        }
    }
}