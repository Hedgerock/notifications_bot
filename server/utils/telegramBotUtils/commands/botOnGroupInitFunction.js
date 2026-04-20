import {groupService} from "../../../service/group/GroupService.js";
import {userService} from "../../../service/index.js";
import {AppCoreConstants} from "../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {TelegramMessage, TelegramCallbackQuery} msg
 * @returns {Promise<void>}
 */
export async function botOnGroupInitFunction(msg) {
    const userId = msg.from.id;
    const chatId = msg.chat.id;
    const title = msg.chat.title;

    const group = await groupService.getGroupById(chatId);

    if (group) {
        await AppCoreConstants.TELEGRAM_BOT.sendMessage(userId, "Данная группа уже была привязана");
        return;
    }

    try {
        const user = await userService.getUserById(userId);
        const time = await user.getTime();

        const currentGroup = await groupService.createGroup({
            time_until_notification_id: time.id,
            group_id: chatId,
            group_name: title,
            user_id: userId
        })

        if (currentGroup) {
            await AppCoreConstants.TELEGRAM_BOT.sendMessage(userId, `Группа ${title} была успешно добавлена к рассылке`)
        }
    } catch (e) {
        console.error(e);
        await AppCoreConstants.TELEGRAM_BOT.sendMessage(userId,`Произошла ошибка сохранения группы ${title}`)
    }
}