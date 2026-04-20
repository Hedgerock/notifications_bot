import {caseActiveQueuesFunction, caseAppStateFunction} from "./cases/index.js";
import {AppCoreConstants} from "../constants/AppCoreConstantsClass.js";

export function startNotificationWorker() {
    AppCoreConstants.NOTIFICATIONS.process(
        /**
         *
         * @param {import("bull").Job<NotificationFields>} job
         * @returns {Promise<void>}
         */
        async (job) => {
            const {notificationsAbout} = job.data;

            //Антиспам
            await new Promise(res => setTimeout(res, Math.random() * 1500 + 500));

            switch (notificationsAbout) {
                case "activeQueues":
                    await caseActiveQueuesFunction(job);
                    break;
                case "appState":
                    await caseAppStateFunction(job);
                    break;
                default:
                    throw new Error(`Уведомление для ${notificationsAbout} не найдено`)
            }
        });

    AppCoreConstants.NOTIFICATIONS.on("completed", job => console.log("Job completed:", job.id));
    AppCoreConstants.NOTIFICATIONS.on("failed", (job, err) => console.error("Job failed:", job.id, err));
}
