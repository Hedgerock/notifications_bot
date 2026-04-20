import {
    NAVIGATION_KEY_GROUP_OPERATIONS,
    NAVIGATION_KEY_USER_OPERATIONS
} from "../../../../../dictionary/index.js";
import {getQueue, userService} from "../../../../../service/index.js";
import {groupService} from "../../../../../service/group/GroupService.js";

export /**
 *
 * @param {string} currentId
 * @param {string} navigationKey
 * @param {UserSelection} userSelection
 * @returns {Promise<void>}
 */
async function setupQueueKeyboard(currentId, navigationKey, userSelection) {
    /**
     * @type {QueueInstance[]}
     */
    let currentQueues;
    const queueService = getQueue();
    switch (navigationKey) {
        case NAVIGATION_KEY_USER_OPERATIONS:
            currentQueues = (await userService.getUserQueues(currentId)).queues;
            break
        case NAVIGATION_KEY_GROUP_OPERATIONS:
            currentQueues = await groupService.getGroupQueues(currentId);
            break
        default:
            throw new Error(`Navigation key ${navigationKey} not found`)
    }

    currentQueues.forEach(q => {
        const code = q.code;
        userSelection[code] = true;
    })

    await queueService.setUserSelection(currentId, userSelection);
}