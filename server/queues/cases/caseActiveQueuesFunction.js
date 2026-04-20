import {notificationService} from "../../service/index.js";
import {getIdForMessage, getTextContent} from "../utils/index.js";
import {AppCoreConstants} from "../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {import("bull").Job<NotificationFields>} job
 * @returns {Promise<void>}
 */
export async function caseActiveQueuesFunction(job) {
    const {notification_for, redis_key, time_before_notify} =
        /** @type {QueueNotificationFields} */ job.data.currentFields
    const isKeyExists = await notificationService.isNotificationSent(notification_for, job.data)

    if (!isKeyExists) {
        const idForMessage = getIdForMessage(job.data.currentFields);
        const textContent = getTextContent(job.data.currentFields);

        await AppCoreConstants.TELEGRAM_BOT.sendMessage(
            idForMessage,
            textContent,
            { parse_mode: "HTML" }
        );

        await notificationService.saveNotification(redis_key, time_before_notify);
    }
}