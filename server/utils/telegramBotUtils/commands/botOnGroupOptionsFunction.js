import {groupService} from "../../../service/group/GroupService.js";
import {MAX_GROUPS_PER_USER} from "../../../db/constants/index.js";
import {botGetGroupsKeyboard} from "../keyBoards/index.js";
import {sessionService} from "../../../service/index.js";
import {botValidateCurrentSession} from "../botValidateCurrentSession.js";
import {AppCoreConstants} from "../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {TelegramCallbackQuery | TelegramMessage} msg
 * @param {Object} options
 * @param {boolean} options.isBackspaced
 * @returns {Promise<void>}
 */
export async function botOnGroupOptionsFunction(msg, options = { isBackspaced: false }) {
    const userId = msg.from.id;
    const { isBackspaced } = options;

    const groups = await groupService.getGroupsByUserId(userId);

    if (groups && groups.length) {
        let message;

        if (isBackspaced) {

            const { messageId, chatId } = (await sessionService.getSession(userId)).identifiers;
            const textMessage = `Группы которые были привязаны к вашей рассылке ${groups.length} из ${MAX_GROUPS_PER_USER}`;

            message = await AppCoreConstants.TELEGRAM_BOT.editMessageText(textMessage, {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: botGetGroupsKeyboard(groups).reply_markup
                },
            );
        } else {
            await botValidateCurrentSession(userId);

            message = await AppCoreConstants.TELEGRAM_BOT.sendMessage(
                userId,
                `Группы которые были привязаны к вашей рассылке ${groups.length} из ${MAX_GROUPS_PER_USER}`,
                botGetGroupsKeyboard(groups)
            );
        }

        await sessionService.updateSession(userId, message);
    } else {
        await AppCoreConstants.TELEGRAM_BOT.sendMessage(
            userId,
            `На данный момент у вас нет групп, максимальное к-ство групп ${MAX_GROUPS_PER_USER}`
        )
    }

}