import {groupService} from "../../../../service/group/GroupService.js";
import {BOT} from "../../../../config/index.js";
import {botGetCurrentGroupKeyboard} from "../../keyBoards/index.js";
import {UTILITY_DELIMITER_FOR_DATA} from "../../../../dictionary/index.js";
import {sessionService} from "../../../../service/index.js";
import {AppCoreConstants} from "../../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {TelegramCallbackQuery} query
 * @param {string} data
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function caseCurrentGroupOptionsFunction(query, data, userId) {
    const [_, groupId] = data.split(UTILITY_DELIMITER_FOR_DATA);

    const group = await groupService.getGroupById(groupId);

    if (group) {
        await initCurrentGroupContent(groupId, group.group_name, userId);
    }

}

/**
 *
 * @param {string} groupId
 * @param {string} title
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function initCurrentGroupContent(groupId, title, userId) {
    const keyboard = botGetCurrentGroupKeyboard(groupId, title);

    const { messageId, chatId } = (await sessionService.getSession(userId)).identifiers;

    const textMessage = `Вы находитесь в настройках группы ${title}`;

    const message = await AppCoreConstants.TELEGRAM_BOT.editMessageText(textMessage, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: keyboard.reply_markup
    }).catch(e => {
        console.error(`Сообщения для изменения не найдено ${chatId}, ${messageId}`, e)
    });

    await sessionService.updateSession(userId, message);
}