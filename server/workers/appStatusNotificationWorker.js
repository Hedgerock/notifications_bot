import {notificationService, userService} from "../service/index.js";
import {NotificationConstants} from "../constants/index.js";

/**
 * @param{'on' | 'off'} informForStatus
 * @returns {Promise<void>}
 */
export async function appStatusNotificationWorker(informForStatus) {
    let offset = 0;

    while (true) {
        const users = await userService.getAllSubscribedUsers(offset, NotificationConstants.USER_BATCH_SIZE);

        for (const user of users) {

            let message;

            switch (informForStatus) {
                case "on":
                    message = "Бот был успешно включен, весь функционал готов к использованию"
                    break;
                case "off":
                    message = "На данный момент бот выключен, все активные сессии были закрыты автоматически"
                    break;
                default:
                    throw new Error(`Статус ${informForStatus} не найден`)
            }

            /**
             *
             * @type {AppStatusNotificationFields}
             */
            const appStatusFields = {
                message,
                user_id: user.social_media_id
            }

            await notificationService.addNewJob({
                notificationsAbout: "appState",
                currentFields: appStatusFields
            }, {
                delay: 0,
            })

        }

        if (users.length < NotificationConstants.USER_BATCH_SIZE) {
            break;
        }

        offset += NotificationConstants.USER_BATCH_SIZE
    }
}