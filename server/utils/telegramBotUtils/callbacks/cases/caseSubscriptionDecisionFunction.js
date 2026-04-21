import {timeService, userService} from "../../../../service/index.js";
import {
    NAVIGATION_KEY_GROUP_OPERATIONS,
    NAVIGATION_KEY_USER_OPERATIONS,
    UTILITY_DELIMITER_FOR_DATA
} from "../../../../dictionary/index.js";
import {groupService} from "../../../../service/group/GroupService.js";
import {AppCoreConstants} from "../../../../constants/AppCoreConstantsClass.js";
import {botOnGroupOptionsFunction} from "../../commands/index.js";
import {format} from "../../../format.js";
import {caseCloseOptionFunction} from "./caseCloseOptionFunction.js";

const TEMPLATE_RESPONSE = "Настройка %s успешно обновлена:\n" +
    "- Статус подписки: %s\n" +
    "- Статус мута: %s\n" +
    "- Время уведомления до следующего отключения: %s минут"

/**
 *
 * @param {TelegramCallbackQuery} query
 * @param {string} data
 * @returns {Promise<void>}
 */
export async function caseSubscriptionDecisionFunction(query, data) {
    const [_, currentId, navigationKey] = data.split(UTILITY_DELIMITER_FOR_DATA);

    switch (navigationKey) {
        case NAVIGATION_KEY_USER_OPERATIONS:
            const { timeId: userTimeId, status: userStatus, mutedStatus: userMutedStatus } =
                await userService.getSubscribedStatusById(currentId);

            const user = await userService.getUserById(currentId);

            const isNewUserData =
                user.is_muted !== userMutedStatus ||
                user.is_subscriber !== userStatus ||
                user.time_until_notification_id !== userTimeId


            if (isNewUserData) {
                await userService.updateUser(currentId, {
                    is_subscriber: userStatus,
                    time_until_notification_id: userTimeId,
                    is_muted: userMutedStatus,
                })
            }

            const userTime = await timeService.getTimeById(userTimeId);

            const textMessage = format(TEMPLATE_RESPONSE, "вашей учетной записи",
                `${userStatus ? "Подписан" : "Отписан"}`,
                `${userMutedStatus ? "Замучен" : "Размучен"}`,
                `${userTime.time_value_minutes}`
            )

            await caseCloseOptionFunction(currentId);
            await AppCoreConstants.TELEGRAM_BOT.sendMessage(currentId, textMessage);

            break;
        case NAVIGATION_KEY_GROUP_OPERATIONS:
            const { status: groupStatus, groupName, timeId: groupTimeId, mutedStatus: groupMutedStatus } =
                await groupService.getSubscribedStatusById(currentId);

            const group = await groupService.getGroupById(currentId);

            const isNewGroupData =
                group.is_muted !== groupMutedStatus ||
                group.is_subscriber !== groupStatus ||
                group.time_until_notification_id !== groupTimeId

            if (isNewGroupData) {
                await groupService.updateGroup(currentId, {
                    is_subscriber: groupStatus,
                    time_until_notification_id: groupTimeId,
                    is_muted: groupMutedStatus,
                }, query.from.id)
            }

            const groupTime = await timeService.getTimeById(groupTimeId);

            const message = format(TEMPLATE_RESPONSE, `группы ${groupName}`,
                `${groupStatus ? "Подписан" : "Отписан"}`,
                `${groupMutedStatus ? "Замучен" : "Размучен"}`,
                `${groupTime.time_value_minutes}`
            )
            await AppCoreConstants.TELEGRAM_BOT.sendMessage(query.from.id, message);
            await botOnGroupOptionsFunction(query)
            break;
        default:
            throw new Error(`Navigation key ${navigationKey} not found`);
    }

}