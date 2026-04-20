import {groupService} from "../../service/group/GroupService.js";
import {getCurrentContentForSpecificQueues} from "./commands/utils/index.js";
import {AppCoreConstants} from "../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {string} userId
 * @param {{isTomorrowContent: boolean, messageType: MessageType}} options
 * @returns {Promise<void>}
 */
export async function botSendMessageToGroups(userId, options = {
    isTomorrowContent: false,
    messageType: "info"
}
) {
    const {isTomorrowContent, messageType} = options
    const groups = (await groupService.getGroupsByUserId(userId))
        .filter(g => g.is_subscriber)
        .filter(g => !g.is_muted);

    if (groups.length) {

        for (const group of groups) {
            const groupId = group.group_id;
            const queues = await groupService.getGroupQueues(groupId);
            const {response} = await getCurrentContentForSpecificQueues(queues, {
                isTomorrowContent,
                messageType,
                isResponseRequired: true
            });

            await AppCoreConstants.TELEGRAM_BOT.sendMessage(groupId, response, {
                parse_mode: "HTML"
            })
                .catch(e => console.error(`Не удалось отправить сообщение в группу ${group.group_name}`, e));
        }

    }
}