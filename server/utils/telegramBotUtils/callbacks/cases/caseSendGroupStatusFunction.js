import {
    UTILITY_DELIMITER_FOR_DATA,
    UTILITY_TODAY_CONTENT,
    UTILITY_TOMORROW_CONTENT
} from "../../../../dictionary/index.js";
import {groupService} from "../../../../service/group/GroupService.js";
import {getCurrentContentForSpecificQueues} from "../../commands/utils/index.js";
import {AppCoreConstants} from "../../../../constants/AppCoreConstantsClass.js";
import {caseCloseOptionFunction} from "./caseCloseOptionFunction.js";
import {botOnGroupOptionsFunction} from "../../commands/index.js";

/**
 *
 * @param {TelegramCallbackQuery} query
 * @param {string} data
 * @returns {Promise<void>}
 */
export async function caseSendGroupStatusFunction(query, data) {
    const [_, groupTitle, groupId, todayOrTomorrow] = data.split(UTILITY_DELIMITER_FOR_DATA);
    const userId = query.from.id;
    const queues = await groupService.getGroupQueues(groupId);
    let isTomorrowContent;

    switch (todayOrTomorrow) {
        case UTILITY_TOMORROW_CONTENT:
            isTomorrowContent = true;
            break
        case UTILITY_TODAY_CONTENT:
            isTomorrowContent = false;
            break;
        default:
            throw new Error(`Значение: ${isTomorrowContent} не найдено`)
    }

    let message;

    try {
        const {response} = await getCurrentContentForSpecificQueues(queues, {
            isTomorrowContent: isTomorrowContent,
            messageType: "info",
            isResponseRequired: true
        });

        await AppCoreConstants.TELEGRAM_BOT.sendMessage(groupId, response, {
            parse_mode: "HTML"
        })
        message = `Информация о статусе на ${isTomorrowContent ? "завтра" : "сегодня"} отключений для группы ${groupTitle} была успешно отправлена`
    } catch (e) {
        message = await AppCoreConstants.TELEGRAM_BOT.sendMessage(userId, e.message);
    } finally {
        await caseCloseOptionFunction(userId);
        await AppCoreConstants.TELEGRAM_BOT.sendMessage(userId, message);
        await botOnGroupOptionsFunction(query);
    }
}