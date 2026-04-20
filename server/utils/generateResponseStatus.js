import {getDayInfo} from "./getDayInfo.js";
import {emojis, sourceMessage} from "../constants/index.js";

const DELIMITER_FOR_QUEUE_CONTENT = "\n    "
const DELIMITER_FOR_TOTAL_QUEUES= "\n\n   "
const SPACE = " ";

const CURRENT_EMOJI = emojis["light-icon"];

const SUB_RESPONSE_QUEUE_DELIMITER = `\n➖➖➖➖➖➖➖\n${CURRENT_EMOJI}`;
const RESPONSE_QUEUE_DELIMITER = `\n${CURRENT_EMOJI}`;


//TODO Будет использоваться дальше или будет удалена
/**
 *
 * @param {string[]} totalQueues
 * @param {{[p:string]: {time: string, value: string[]}[]}} times
 * @param {{ isTomorrowContent: boolean, messageType: MessageType }} options
 * @returns {string}
 */
export function generateResponseStatus(totalQueues, times, options = {
    isTomorrowContent: false,
    messageType: "info"
}) {
    const {isTomorrowContent} = options

    const arr = totalQueues.map((el, ind, arr) => {
        const length = times[el].length;
        const isFirst = ind === 0;
        const isLast = ind === arr.length - 1;

        const queueContent = times[el].map((val, curIndex) => {
            const index = curIndex + 1;
            const time = val.time;
            const values = val.value.join(DELIMITER_FOR_QUEUE_CONTENT);

            return `${index}. ${time}:${DELIMITER_FOR_QUEUE_CONTENT}${values}`;
        }).join(DELIMITER_FOR_TOTAL_QUEUES);

        const isValueSingle = isSingleValue(times[el]);
        const startContent = !isFirst && !isLast ? "" : SPACE;
        const oneOrManyValue = isValueSingle ? "" : "а";

        return `${startContent} ${el} - ${length} раз${oneOrManyValue}:${DELIMITER_FOR_TOTAL_QUEUES}${queueContent}`
    });

    const isValueSingle = isSingleValue(totalQueues);
    const endingSelection = isValueSingle ? "о" : "ы";
    const oneOrManyValue = isValueSingle ? "и" : "ей";
    const isOneOrManyOffs = isValueSingle ? "е" : "я";

    if (!isTomorrowContent) {

        return `На данный момент, предусмотрен${endingSelection} отключени${isOneOrManyOffs} света для` + " " +
            `очеред${oneOrManyValue}:${RESPONSE_QUEUE_DELIMITER}${arr.join(SUB_RESPONSE_QUEUE_DELIMITER)}\n${sourceMessage}`;
    }

    const {day, year, modifiedMonth, modifiedDate} = getDayInfo(isTomorrowContent);

    return `На ${day} ${modifiedDate}.${modifiedMonth}.${year} запланирован${endingSelection} отключени${isOneOrManyOffs} света для` + " " +
        `очеред${oneOrManyValue}:${RESPONSE_QUEUE_DELIMITER}${arr.join(SUB_RESPONSE_QUEUE_DELIMITER)}\n${sourceMessage}`;
}

function isSingleValue(content) {
    return content.length === 1;
}