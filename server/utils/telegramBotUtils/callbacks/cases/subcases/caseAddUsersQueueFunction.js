import {getQueue, userService} from "../../../../../service/index.js";
import {format} from "../../../../format.js";
import {TEMPLATE_OF_CURRENT_SELECTION, UTILITY_DELIMITER} from "../../../../../dictionary/index.js";
import {AppCoreConstants} from "../../../../../constants/AppCoreConstantsClass.js";
import {caseCloseOptionFunction} from "../caseCloseOptionFunction.js";

/**
 *
 * @param { TelegramCallbackQuery } query
 * @param { string } currentId
 * @param { QueueInstance[] } queues
 * @returns {Promise<void>}
 */
export async function caseAddUsersQueueFunction(query, currentId, queues) {
    const queueService = getQueue();
    const userSelection = await queueService.getUserSelection(currentId);

    const chosen = Object.entries(userSelection)
        .filter(([key, val]) => val && userSelection[key])
        .map(([key]) => key)
        .join(UTILITY_DELIMITER)

    await userService.addUsersQueues(currentId, queues);
    await caseCloseOptionFunction(currentId);
    await AppCoreConstants.TELEGRAM_BOT.sendMessage(query.from.id, format(TEMPLATE_OF_CURRENT_SELECTION, chosen))

    //TODO Под вопросом
    /*await botOnStatusFunction(query);*/
}