import {getCurrentContentForSpecificQueues} from "../../utils/telegramBotUtils/commands/utils/index.js";
import {notificationService} from "../../service/index.js";
import {format} from "../../utils/index.js";

/**
 * @param {NotificationParams} options
 * @returns {Promise<void>}
 */
export async function startTodoNotification(options = {...options}) {
    const {notificationFor, queues, userId, timeBeforeNotify} = options;

    const {times, actualQueuesKeys} = await getCurrentContentForSpecificQueues(queues);

    const activeQueues = queues.filter(el => actualQueuesKeys.includes(el.code));

    if (activeQueues.length) {

        const {finalQueues, codes} =
            notificationService.getQueuesForWorkAndCodes(activeQueues, times, timeBeforeNotify);

        if (finalQueues.length) {
            const rawRedisKey = notificationService.getRawNotificationKey(notificationFor);
            let redisKey;
            /**
             * @type {NotificationFields<QueueFields>}
             */
            let notificationFields = {
                notificationsAbout: "activeQueues",
                currentFields: /** @type{QueueFields} */ {
                    user_id: userId,
                    time_before_notify: timeBeforeNotify,
                    queues_data: finalQueues,
                    queue_codes: codes,
                    notification_for: notificationFor
                }
            };

            switch (notificationFor) {
                case "user":
                    redisKey = format(rawRedisKey,userId,codes);
                    notificationFields = {...notificationFields, currentFields: {
                        ...notificationFields.currentFields,
                        redis_key: redisKey
                    }};
                    break;
                case "group":
                    const {groupId} = options
                    redisKey = format(rawRedisKey,userId,groupId,codes);
                    notificationFields = {...notificationFields, currentFields: {
                        ...notificationFields.currentFields,
                        redis_key: redisKey,
                        group_id: groupId
                    }};
                    break;
                default:
                    throw new Error(`Уведомление для ${notificationFor} не найдено`)
            }

            const isSent =
                await notificationService.isNotificationSent(notificationFor, notificationFields)

            if (!isSent) {
                await notificationService.addNewJob(notificationFields, {delay: 0})
            }
        }
    }
}