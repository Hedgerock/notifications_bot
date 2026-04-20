import {emojis, sourceMessage} from "../constants/index.js";

/**
 *
 * @param {QueueInstance[]} queues
 */
export function getGoodMessage(queues) {
    const isSingleElement = queues.length === 1;
    const your = isSingleElement ? "ей" : "им"
    const curQueue = isSingleElement ? "и" : "ям"
    const ofCurQueues = queues.map(el => `${emojis["light-icon"]} ${el.code}`).join(`\n`);

    return `На данный момент ваш${your} очеред${curQueue}:\n${ofCurQueues}\nне предусмотрены отключения света\n\n${sourceMessage}`;
}