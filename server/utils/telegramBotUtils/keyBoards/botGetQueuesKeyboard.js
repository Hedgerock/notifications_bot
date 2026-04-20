import {getQueue} from "../../../service/index.js";
import {
    CASE_CLOSE_OPTION,
    CASE_NOOP_STATUS_OPTION,
    NAVIGATION_KEY_USER_OPERATIONS,
    UTILITY_EMPTY_VALUE
} from "../../../dictionary/index.js";
import {chunkArray} from "../../chunkArray.js";
import {getQueueTextContent, setupCurrentOption, setupQueueKeyboard} from "./utils/botGetQueueKeyboardUtils/index.js";

/**
 *
 * @param {string} currentId
 * @param { KeyboardOptions } options
 * @returns {Promise<{reply_markup: {inline_keyboard}}>}
 */
export async function botGetQueuesKeyboard(
    currentId, options = {
        navigationKey: NAVIGATION_KEY_USER_OPERATIONS, hasBackButton: false, fromSelection: false}
) {
    const queueService = getQueue();
    const { navigationKey, fromSelection} = options;

    if (!fromSelection) {
        await queueService.removeUserSelection(currentId);
    }

    const rawQueues = queueService.getQueues();
    const userSelection = await queueService.getUserSelection(currentId);

    if (!fromSelection) {
        await setupQueueKeyboard(currentId, navigationKey, userSelection);
    }

    const {
        readyStatusText,
        readyCallBackData,
        selectedAllCallbackData,
        selectedAllCase,
        removeAllCase,
        removeAllCallbackData,
        backButtonText,
        actualBackButtonCallbackData
    } = getQueueTextContent(currentId, rawQueues, userSelection, options);

    const tupleQueues = chunkArray(rawQueues, 2);

    return {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: backButtonText,
                        callback_data: actualBackButtonCallbackData
                    },
                    { text: UTILITY_EMPTY_VALUE, callback_data: CASE_NOOP_STATUS_OPTION },
                    { text: "Закрыть", callback_data: CASE_CLOSE_OPTION },
                ],
                [
                    {
                        text: selectedAllCase,
                        callback_data: selectedAllCallbackData
                    },
                    {
                        text: removeAllCase,
                        callback_data: removeAllCallbackData
                    },
                ],
                ...tupleQueues.map(pair =>
                    pair.map(option => setupCurrentOption(option, userSelection, currentId, options))
                ),
                [
                    {
                        text: readyStatusText,
                        callback_data: readyCallBackData
                    }
                ]
            ]
        }
    }
}

