import {userService} from "../../../../../service/index.js";
import {getOptionalTextContent} from "../getOptionalTextContent.js";
import {getOptionalCallBackData} from "../getOptionalCallBackData.js";
import {
    NAVIGATION_KEY_GROUP_OPERATIONS,
    NAVIGATION_KEY_USER_OPERATIONS, TEMPLATE_OF_CASE_MUTE_OPTION,
    TEMPLATE_OF_CASE_SUBSCRIBED_OPTION, TEMPLATE_OF_CASE_SUBSCRIPTION_DECISION_OPTION, TEMPLATE_OF_CASE_UNMUTE_OPTION,
    TEMPLATE_OF_CASE_UNSUBSCRIBED_OPTION, UTILITY_EMPTY_VALUE_WITH_TEXT,
    UTILITY_WITH_BACK_BUTTON,
    UTILITY_WITHOUT_BACK_BUTTON
} from "../../../../../dictionary/index.js";
import {setupBackButtonContent} from "../setupBackButtonContent.js";
import {format} from "../../../../format.js";
import {groupService} from "../../../../../service/group/GroupService.js";

/**
 *
 * @param {string} currentId
 * @param {KeyboardOptions} options
 * @returns {Promise<SubscriptionKeyboardContent>}
 */
export async function getSubscriptionKeyboardContent(currentId, options) {
    let isSubscriber;
    let timeId;
    let isMuted;
    const {navigationKey} = options;

    switch (navigationKey) {
        case NAVIGATION_KEY_USER_OPERATIONS:
            const {status: userStatus, timeId: userTimeId, mutedStatus: userMutedStatus} =
                await userService.getSubscribedStatusById(currentId);
            isSubscriber = userStatus;
            timeId = userTimeId;
            isMuted = userMutedStatus;
            break;
        case NAVIGATION_KEY_GROUP_OPERATIONS:
            const {status: groupStatus, timeId: groupTimeId, mutedStatus: groupMutedStatus} =
                await groupService.getSubscribedStatusById(currentId);
            isSubscriber = groupStatus;
            timeId = groupTimeId;
            isMuted = groupMutedStatus;
            break;
        default:
            throw new Error(`Navigation key ${navigationKey} not found`);
    }

    const subscribedText = getOptionalTextContent(isSubscriber, "Подписан на рассылку");
    const subscribedCallBackData = getOptionalCallBackData(
        !isSubscriber, getDefaultFormat(TEMPLATE_OF_CASE_SUBSCRIBED_OPTION, currentId, options)
    );

    const unsubscribedText = getOptionalTextContent(!isSubscriber, "Отписан от рассылки");
    const unsubscribedCallBackData = getOptionalCallBackData(isSubscriber,
        getDefaultFormat(TEMPLATE_OF_CASE_UNSUBSCRIBED_OPTION, currentId, options));

    const {backButtonText, actualBackButtonCallbackData} = setupBackButtonContent(currentId, options);
    const subscriptionDecisionCallbackData = format(
        TEMPLATE_OF_CASE_SUBSCRIPTION_DECISION_OPTION,
        currentId,
        navigationKey
    );

    const mutedText = getOptionalTextContent(isMuted, "Заглушен");
    const mutedCallBackData =
        getOptionalCallBackData(!isMuted, getDefaultFormat(TEMPLATE_OF_CASE_MUTE_OPTION, currentId, options))

    const unmutedText = getOptionalTextContent(!isMuted, "Не заглушен");
    const unmutedCallBackData =
        getOptionalCallBackData(isMuted, getDefaultFormat(TEMPLATE_OF_CASE_UNMUTE_OPTION, currentId, options))

    return {
        subscribedText,
        subscribedCallBackData,
        unsubscribedText,
        unsubscribedCallBackData,
        backButtonText,
        actualBackButtonCallbackData,
        subscriptionDecisionCallbackData,
        timeId,
        mutedText,
        mutedCallBackData,
        unmutedText,
        unmutedCallBackData,
    }
}

/**
 * @param {string} template
 * @param {string} currentId
 * @param {KeyboardOptions} options
 * @returns {string}
 */
function getDefaultFormat(template, currentId, options) {
    const {navigationKey, hasBackButton} = options;

    return format(
        template,
        currentId,
        navigationKey,
        hasBackButton ? UTILITY_WITH_BACK_BUTTON : UTILITY_WITHOUT_BACK_BUTTON
    )
}