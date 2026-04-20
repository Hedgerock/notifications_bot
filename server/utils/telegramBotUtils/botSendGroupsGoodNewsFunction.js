import {groupService} from "../../service/group/GroupService.js";
import {getGoodMessage} from "../getGoodMessage.js";
import {AppCoreConstants} from "../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function botSendGroupsGoodNewsFunction(userId) {
    const groups = await groupService.getGroupsByUserId(userId);

    if (groups.length) {

        for (const group of groups) {
            const queues = await group.getGroupQueues();
            const message = getGoodMessage(queues);
            await AppCoreConstants.TELEGRAM_BOT.sendMessage(group.group_id, message)
                .catch(e => console.error(`Failed to send message to group ${group.group_name}`, e));
        }

    }
}