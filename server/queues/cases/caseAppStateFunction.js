import {AppCoreConstants} from "../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {import("bull").Job<NotificationFields>} job
 * @returns {Promise<void>}
 */
export async function caseAppStateFunction(job) {
    const {user_id, message} = /** @type {AppStatusNotificationFields} */ job.data.currentFields
    await AppCoreConstants.TELEGRAM_BOT.sendMessage(
        user_id,
        message,
    );
}