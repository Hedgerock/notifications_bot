import {getQueue} from "../../../../service/index.js";
import {
    NAVIGATION_KEY_GROUP_OPERATIONS,
    NAVIGATION_KEY_USER_OPERATIONS,
    UTILITY_DELIMITER_FOR_DATA
} from "../../../../dictionary/index.js";
import {caseAddGroupQueuesFunction, caseAddUsersQueueFunction} from "./subcases/index.js";

/**
 *
 * @param {TelegramCallbackQuery} query
 * @param {string} data
 * @param {QueueInstance[]} rawQueues
 * @returns {Promise<void>}
 */
export async function caseSuccessSelection(query, data, rawQueues) {
    const [_, currentId, navigationKey] = data.split(UTILITY_DELIMITER_FOR_DATA);
    const queueService = getQueue();
    const userSelection = await queueService.getUserSelection(currentId);

    const queues = rawQueues.filter(val => {
        return userSelection[val.code];
    })

    switch (navigationKey) {
        case NAVIGATION_KEY_USER_OPERATIONS:
            await caseAddUsersQueueFunction(query, currentId, queues);
            break;
        case NAVIGATION_KEY_GROUP_OPERATIONS:
            await caseAddGroupQueuesFunction(query, currentId, queues);
            break;
        default:
            throw new Error(`Navigation key ${navigationKey} not found`)
    }

    await queueService.removeUserSelection(currentId);
}