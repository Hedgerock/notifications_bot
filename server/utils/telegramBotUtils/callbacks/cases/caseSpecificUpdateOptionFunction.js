import {NAVIGATION_KEY_GROUP_OPERATIONS, UTILITY_DELIMITER_FOR_DATA} from "../../../../dictionary/index.js";
import {caseUpdateCurrentGroupQueuesFunction} from "./subcases/index.js";

/**
 *
 * @param {TelegramCallbackQuery} query
 * @param {string} data
 * @returns {Promise<void>}
 */
export async function caseSpecificUpdateOptionFunction(query, data) {
    const [_, key, title, groupId] = data.split(UTILITY_DELIMITER_FOR_DATA);

    switch (key) {
        case NAVIGATION_KEY_GROUP_OPERATIONS:
            await caseUpdateCurrentGroupQueuesFunction(query, title, groupId)
            break;

        default:
            throw new Error(`Key ${key} not found`)
    }
}