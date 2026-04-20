import {userService} from "../../../service/index.js";
import {botValidateCurrentSession} from "../botValidateCurrentSession.js";
import {botOnUpdateFunction} from "./botOnUpdateFunction.js";
import {botSendMessageToGroups} from "../botSendMessageToGroups.js";
import {getCurrentContentForSpecificQueues} from "./utils/index.js";
import {AppCoreConstants} from "../../../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {TelegramMessage | TelegramCallbackQuery} msg
 * @param {{withGroupNotification: boolean}} options
 * @returns {Promise<void>}
 */
export async function botOnStatusFunction(msg,
                                          options= { withGroupNotification: true }) {
    const {withGroupNotification} = options;
    const userId = msg.from.id;
    await botValidateCurrentSession(userId);
    const {queues: userQueues} = await userService.getUserQueues(userId);

    if (!userQueues?.length) {
        await botOnUpdateFunction(msg);
        return
    }

    const {response} = await getCurrentContentForSpecificQueues(userQueues, {
        isTomorrowContent: false,
        messageType: "info",
        isResponseRequired: true
    });

    await AppCoreConstants.TELEGRAM_BOT.sendMessage(userId, response, {
        parse_mode: "HTML"
    })

    if (withGroupNotification) {
        await botSendMessageToGroups(userId)
    }
}