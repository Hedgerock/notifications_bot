import {notificationService} from "../../service/index.js";
import {NotificationConstants} from "../../constants/index.js";

export async function invalidateGlobalNotificationCounter() {
    const resetScheduled = await notificationService.getResetScheduledValue();
    const counter = await notificationService.getCounterForWork();

    if (!resetScheduled && counter >= NotificationConstants.MAX_SCHEDULE_ATTEMPTS) {
        await notificationService.updateResetScheduledValue(true);
        await notificationService.resetCounterForWork();
        console.log('Счётчик очищен');
    }
}