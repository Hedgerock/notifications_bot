import {botValidateCurrentSession} from "../botValidateCurrentSession.js";
import {botGetSubscriptionKeyboard} from "../keyBoards/index.js";
import {sessionService} from "../../../service/index.js";
import {AppCoreConstants} from "../../../constants/AppCoreConstantsClass.js";

export async function botOnSubscriptionFunction(msg) {
    const userId = msg.from.id;
    await botValidateCurrentSession(userId);

    const message =
        await AppCoreConstants.TELEGRAM_BOT.sendMessage(userId, "Информация о вашей подписке", await botGetSubscriptionKeyboard(userId))

    await sessionService.updateSession(userId, message)
}