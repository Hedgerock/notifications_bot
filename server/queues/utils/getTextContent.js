import {buildResponseTable, modifiedQueueCodes} from "../../utils/index.js";
import {sourceMessage} from "../../constants/index.js";

/**
 * @param {NotificationFields} notificationFields
 * @returns {string}
 */
export function getTextContent(notificationFields) {
    const {queue_codes, time_before_notify, queues_data} = notificationFields;

    const queueCodes = modifiedQueueCodes(queue_codes);

    const isSingle = queue_codes.split(" ").length === 1;
    const content = buildResponseTable(queues_data);
    return (
        `Напоминание о том что через ~${time_before_notify} минут ` +
        `очеред${isSingle ? "ь" : "и"}:\n\n${queueCodes}\n\nперейд${isSingle ? "ет" : "ут"} ` +
        `в желтую зону и буд${isSingle ? "е" : "у"}т действовать следующи${isSingle ? "й" : "е"} ` +
        `график${isSingle ? "" : "и"}:\n${content}\n\n${sourceMessage}`
    )
}
