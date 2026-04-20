import {groupService} from "../../../../../service/group/GroupService.js";
import {AppCoreConstants} from "../../../../../constants/AppCoreConstantsClass.js";
import {botOnGroupOptionsFunction} from "../../../commands/index.js";


/**
 *
 * @param {TelegramCallbackQuery} query
 * @param {string} currentId
 * @param {QueueInstance[]} queues
 * @returns {Promise<void>}
 */
export async function caseAddGroupQueuesFunction(query, currentId, queues) {
    await groupService.updateGroupsQueues(currentId, queues);
    const group = await groupService.getGroupById(currentId);
    const userId = query.from.id;

    const message =
        `Очереди ${queues.map(el => el.code)} были успешно добавлены в группу ${group.group_name}`;

    await AppCoreConstants.TELEGRAM_BOT.sendMessage(userId, message);
    await botOnGroupOptionsFunction(query);
}