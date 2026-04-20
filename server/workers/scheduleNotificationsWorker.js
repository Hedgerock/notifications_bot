import {notificationService, getQueue} from "../service/index.js";
import {minutesUntil} from "../utils/index.js";
import {getCurrentContentForSpecificQueues} from "../utils/telegramBotUtils/commands/utils/index.js";
import {IntervalTimeConstants, NotificationConstants} from "../constants/index.js";
import {initSchedules, invalidateGlobalNotificationCounter} from "./utils/index.js";

export async function scheduleNotificationsWorker() {
    const queueService = getQueue();
    const queues = queueService.getQueues();
    const { times } = await getCurrentContentForSpecificQueues(queues, {
        isResponseRequired: false,
        messageType: "info",
        isTomorrowContent: false
    });

    const keys = Object.keys(times);

    if (!keys.length) {
        console.log("Очереди на отключения не предусмотрены")
        return;
    }

    for (const key of keys) {
        const timeArr = times[key];

        if (timeArr.length) {

            for (const currentTime of timeArr) {
                const diff = minutesUntil(new Date(), currentTime.time);

                if (diff >= 0 && diff <= NotificationConstants.MAX_VALUE_OF_TIME_NOTIFICATION_IN_MINUTES) {
                    try {
                        const counter = await notificationService.getCounterForWork();

                        if (counter < NotificationConstants.MAX_SCHEDULE_ATTEMPTS) {
                            await notificationService.incrementCounterForWork();
                            console.log(`Счетчик увеличен ${counter + 1} / ${NotificationConstants.MAX_SCHEDULE_ATTEMPTS}`)
                        }

                        await initSchedules();
                    } catch (e) {
                        console.error("Не удалось отправить уведомления", e)
                    }

                    return;
                }
            }

        }

    }

    console.log(`Ближайшие отключения активных очередей ${keys.join(" ")} отсутствуют`)
}

setInterval(invalidateGlobalNotificationCounter, IntervalTimeConstants.NOTIFICATION_PAUSE_TIME_IN_MILLIS)
