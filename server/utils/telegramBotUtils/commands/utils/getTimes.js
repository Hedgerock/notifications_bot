import {prepareObjectToUse} from "../../../prepareObjectToUse.js";
import {generateQueueContent} from "../../../generateQueueContent.js";

/**
 * @param {string[]} actualQueuesKeys
 * @param {{[p: string]: number[][]}} startIndex
 * @param {Rows[]} actualSelectedRows
 * @returns {{[p:string]: {time: string, value: string[]}[]}}
 */
export function getTimes(startIndex, actualQueuesKeys, actualSelectedRows) {
    const times = prepareObjectToUse(actualQueuesKeys);

    actualQueuesKeys.forEach(code => {
        const queueArr = startIndex[code];

        if (!queueArr) {
            return;
        }

        const content = generateQueueContent(queueArr, code, actualSelectedRows);

        if (content.length) {
            times[code] = content;
        } else {
            delete times[code];
        }
    })

    //TODO return times | tempVals for tests;
    return times
}