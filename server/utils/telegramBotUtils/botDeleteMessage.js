import {AppCoreConstants} from "../../constants/AppCoreConstantsClass.js";

async function botDeleteMessage(msg) {
    const chatId = msg?.chat?.id;
    const messageId = msg?.message_id;

    try {
        await AppCoreConstants.TELEGRAM_BOT.deleteMessage(chatId, messageId);
    } catch (e) {
        console.error("Сообщение для удаления не найдено");
    }
}

export default botDeleteMessage