import {
    NAVIGATION_KEY_GROUP_OPERATIONS,
    NAVIGATION_KEY_GROUPS,
    UTILITY_DELIMITER_FOR_DATA
} from "../../../../dictionary/index.js";
import {initCurrentGroupContent} from "./caseCurrentGroupOptionsFunction.js";
import {groupService} from "../../../../service/group/GroupService.js";
import {botOnGroupOptionsFunction} from "../../commands/index.js";

/**
 *
 * @param {TelegramCallbackQuery} query
 * @param {string} data
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function caseBackPreviousPositionFunction(query, data, userId) {
    const dataArr = data.split(UTILITY_DELIMITER_FOR_DATA);
    const [_, navigationKey] = dataArr;

    switch (navigationKey) {

        case NAVIGATION_KEY_GROUPS:
            await botOnGroupOptionsFunction(query, {
                isBackspaced: true
            });
            break

        case NAVIGATION_KEY_GROUP_OPERATIONS:
            const [_, __, groupId] = dataArr;
            const group = await groupService.getGroupById(groupId);
            await initCurrentGroupContent(groupId, group.group_name, userId);
            break

        default:
            throw new Error(`Navigation ${navigationKey} not found`)
    }

}