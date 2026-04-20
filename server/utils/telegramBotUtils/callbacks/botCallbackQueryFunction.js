import {getQueue} from "../../../service/index.js";
import {
    CASE_BACK_PREVIOUS_POSITION_OPTION,
    CASE_CLOSE_OPTION,
    CASE_CURRENT_QUEUE_SELECTION_OPTION,
    CASE_GROUP_SELECTION_OPTION,
    CASE_MUTE_OPTION,
    CASE_NOOP_STATUS_OPTION,
    CASE_REMOVE_ALL_STATUS_OPTION,
    CASE_SELECT_ALL_STATUS_OPTION,
    CASE_SEND_GROUP_STATUS_OPTION,
    CASE_SPECIFIC_SUBSCRIPTION_OPTION,
    CASE_SPECIFIC_TIME_UPDATE_OPTION,
    CASE_SPECIFIC_UPDATE_OPTION,
    CASE_SUBSCRIBED_OPTION,
    CASE_SUBSCRIPTION_DECISION_OPTION,
    CASE_SUCCESS_STATUS_RESPONSE_OPTION,
    CASE_UNMUTE_OPTION,
    CASE_UNSUBSCRIBED_OPTION
} from "../../../dictionary/index.js";
import {
    caseCloseOptionFunction,
    caseCurrentGroupOptionsFunction,
    caseMuteUnmuteSelectionFunction,
    caseQueueSelectionFunction,
    caseSendGroupStatusFunction,
    caseSpecificUpdateOptionFunction,
    caseSubscribedStatusFunction,
    caseSubscriptionDecisionFunction,
    caseSuccessSelection,
    caseTimeUpdateStatusFunction,
    caseUpdateAllFunction
} from "./cases/index.js";
import {caseBackPreviousPositionFunction} from "./cases/caseBackPreviousPositionFunction.js";
import {caseSpecificSubscriptionOption} from "./cases/caseSpecificSubscriptionOption.js";
import {AppCoreConstants} from "../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {TelegramCallbackQuery} query
 * @returns {Promise<void>}
 */
export async function botCallBackQueryFunction(query) {
    const userId = query.from.id;
    const data = query.data;
    const queueService = getQueue();
    const rawQueues = queueService.getQueues();

    switch (true) {
        case data.startsWith(CASE_SELECT_ALL_STATUS_OPTION):
        case data.startsWith(CASE_REMOVE_ALL_STATUS_OPTION):
            const currentBool = data.startsWith(CASE_SELECT_ALL_STATUS_OPTION);
            await caseUpdateAllFunction(query, data, rawQueues, currentBool);
            break;
        case data === CASE_NOOP_STATUS_OPTION:
            break;
        case data.startsWith(CASE_SUCCESS_STATUS_RESPONSE_OPTION):
            await caseSuccessSelection(query, data, rawQueues);
            break;
        case data.startsWith(CASE_SUBSCRIBED_OPTION):
        case data.startsWith(CASE_UNSUBSCRIBED_OPTION):
            await caseSubscribedStatusFunction(query, data);
            break;
        case data.startsWith(CASE_MUTE_OPTION):
        case data.startsWith(CASE_UNMUTE_OPTION):
            await caseMuteUnmuteSelectionFunction(query, data);
            break;
        case data.startsWith(CASE_SUBSCRIPTION_DECISION_OPTION):
            await caseSubscriptionDecisionFunction(query, data);
            break;
        case data.startsWith(CASE_GROUP_SELECTION_OPTION):
            await caseCurrentGroupOptionsFunction(query, data, userId);
            break;
        case data.startsWith(CASE_CURRENT_QUEUE_SELECTION_OPTION):
            await caseQueueSelectionFunction(query, data);
            break;
        case data.startsWith(CASE_BACK_PREVIOUS_POSITION_OPTION):
            await caseBackPreviousPositionFunction(query, data, userId);
            break;
        case data.startsWith(CASE_SPECIFIC_UPDATE_OPTION):
            await caseSpecificUpdateOptionFunction(query, data);
            break;
        case data === CASE_CLOSE_OPTION:
            await caseCloseOptionFunction(userId);
            break;
        case data.startsWith(CASE_SPECIFIC_SUBSCRIPTION_OPTION):
            await caseSpecificSubscriptionOption(query, data);
            break;
        case data.startsWith(CASE_SPECIFIC_TIME_UPDATE_OPTION):
            await caseTimeUpdateStatusFunction(query, data);
            break;
        case data.startsWith(CASE_SEND_GROUP_STATUS_OPTION):
            await caseSendGroupStatusFunction(query, data);
            break;
        default:
            throw new Error(`Case not found ${data}`)
    }

    await AppCoreConstants.TELEGRAM_BOT.answerCallbackQuery(query.id);
}