import {botValidateCurrentSession} from "../botValidateCurrentSession.js";
import {userService} from "../../../service/index.js";
import {botOnUpdateFunction} from "./botOnUpdateFunction.js";
import {getCurrentContentForSpecificQueues} from "./utils/index.js";
import {botSendMessageToGroups} from "../botSendMessageToGroups.js";
import {AppCoreConstants} from "../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {TelegramCallbackQuery | TelegramMessage} msg
 * @return {Promise<void>}
 */
export async function botOnTomorrowStatusFunction(msg) {
    const userId = msg.from.id;
    await botValidateCurrentSession(userId);
    const {queues: userQueues} = await userService.getUserQueues(userId);

    if (!userQueues?.length) {
        await botOnUpdateFunction(msg);
        return
    }

    try {
        const {response} = await getCurrentContentForSpecificQueues(userQueues, {
            isTomorrowContent: true,
            messageType: "info",
            isResponseRequired: true
        });
        await AppCoreConstants.TELEGRAM_BOT.sendMessage(userId, response)

        await botSendMessageToGroups(userId, {
            isTomorrowContent: true,
            messageType: "info"
        })
    } catch (e) {
        await AppCoreConstants.TELEGRAM_BOT.sendMessage(userId, e.message);
    }
}