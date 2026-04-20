import {notificationService, userService} from "../../service/index.js";
import {startTodoNotification} from "./startTodoNotification.js";
import {IntervalTimeConstants, NotificationConstants} from "../../constants/index.js";

export async function initSchedules() {
    const counterForWork = await notificationService.getCounterForWork();

    if (counterForWork >= NotificationConstants.MAX_SCHEDULE_ATTEMPTS) {
        const actualPauseValueInMinutes =
            Math.floor((IntervalTimeConstants.NOTIFICATION_PAUSE_TIME_IN_MILLIS / 1000) / 60);
        const logMessageAboutTotalNotificationAttemptExceed =
            `Лимит на количество созданий уведомлений ` +
            `достигнут ${counterForWork}/${NotificationConstants.MAX_SCHEDULE_ATTEMPTS}, ` +
            `установлена пауза на ${actualPauseValueInMinutes} минут`

        console.log(logMessageAboutTotalNotificationAttemptExceed);

        return;
    }

    let offset = 0;

    while (true) {
        const users = await userService.getAllSubscribedUsers(offset, NotificationConstants.USER_BATCH_SIZE);

        for (const user of users) {
            const userTimeBeforeNotify = user.time.time_value_minutes;
            const userQueues = await user.queues;

            if (!user.is_muted) {
                await startTodoNotification({
                    userId: user.social_media_id,
                    notificationFor: "user",
                    queues: userQueues,
                    timeBeforeNotify: userTimeBeforeNotify,
                })
            }

            const groups = await user.groups;

            if (groups.length) {
                for (const group of groups) {
                    const groupTimeBeforeNotify = group.time.time_value_minutes;
                    const groupQueues = group.groupQueues;

                    if (!group.is_muted) {
                        await startTodoNotification({
                            userId: user.social_media_id,
                            groupId: group.group_id,
                            notificationFor: "group",
                            queues: groupQueues ,
                            timeBeforeNotify: groupTimeBeforeNotify,
                        })
                    }
                }
            }
        }

        if (users.length < NotificationConstants.USER_BATCH_SIZE) {
            break;
        }

        offset += NotificationConstants.USER_BATCH_SIZE
    }
}