/**
 *
 * @param {NotificationFields} notificationFields
 * @returns {string}
 */
export function getIdForMessage(notificationFields) {
    const {notification_for, user_id, group_id} = notificationFields;

    let idForMessage;

    switch (notification_for) {
        case "user":
            idForMessage = user_id;
            break;
        case "group":
            idForMessage = group_id;
            break;
        default:
            throw new Error(`${notification_for} doesn't have any id`)
    }

    return idForMessage;
}