import {getGoodMessage} from "../../../getGoodMessage.js";
import {getTimes} from "./getTimes.js";
import {notificationService, getQueue} from "../../../../service/index.js";
import {buildResponseTable} from "../../../buildResponseTable.js";
import {modifiedMultipleCodes} from "../../../modifiedQueueCodes.js";
import {sourceMessage} from "../../../../constants/index.js";

/**
 *
 * @param {QueueInstance[]} targetQueues
 * @param {SpecificQeueuesOptions} options
 * @returns {Promise<GeneratedQueueContent | Omit<GeneratedQueueContent, "response">>}
**/
export async function getCurrentContentForSpecificQueues(
    targetQueues, options = {
        isTomorrowContent: false,
        messageType: "info",
        isResponseRequired: true
    }) {
    const queueService = getQueue();
    const {isTomorrowContent, isResponseRequired} = options
    const {startIndex, actualQueuesKeys, actualSelectedRows} =
        await queueService.getInvolvedQueues(isTomorrowContent);

    const times = getTimes(startIndex, actualQueuesKeys, actualSelectedRows);

    if (!isResponseRequired) {
        return {times, startIndex}
    }

    const actualQueues = targetQueues.filter(val => Object.keys(times).includes(val.code))

    let response;

    if (!actualQueues.length) {
        response = getGoodMessage(targetQueues);
    } else {
        const {codes, finalQueues} = notificationService.getAllQueuesForWorkAndCodes(actualQueues, times);
        const htmlQueues = buildResponseTable(finalQueues, 2, false);
        const queueCodes = modifiedMultipleCodes(codes);

        response = `На данный момент предусмотрены отключения света для очередей:` +
        `\n\n${queueCodes}\n\nбудут действовать следующие графики отключений:\n${htmlQueues}\n${sourceMessage}`;

        // response = generateResponseStatus(actualQueuesKeys, times, {
        //     isTomorrowContent: false,
        //     messageType: "info"
        // });
    }

    return { response, times, startIndex, actualQueuesKeys: Object.keys(times) }
}