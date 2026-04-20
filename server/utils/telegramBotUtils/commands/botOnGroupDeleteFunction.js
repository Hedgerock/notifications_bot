import {groupService} from "../../../service/group/GroupService.js";
import {botValidateCurrentSession} from "../botValidateCurrentSession.js";
import {AppCoreConstants} from "../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {TelegramMessage} msg
 */
export async function botOnGroupDeleteFunction(msg) {
    const userId = msg.from.id;
    const chatId = msg.chat.id;
    const title = msg.chat.title;

    try {
        const group = await groupService.getGroupById(chatId);

        if (!group) {
            await AppCoreConstants.TELEGRAM_BOT.sendMessage(userId, `Группа не найдена`);
            return;
        }

        await groupService.deleteGroup(chatId, userId);
        await botValidateCurrentSession(userId);
        await AppCoreConstants.TELEGRAM_BOT.sendMessage(userId, `Группа ${title} была успешно отвязана от вашей рассылки`)
    } catch (e) {
        console.error(e);
        await AppCoreConstants.TELEGRAM_BOT.sendMessage(userId,`Произошла ошибка сохранения группы ${title}`)
    }
}