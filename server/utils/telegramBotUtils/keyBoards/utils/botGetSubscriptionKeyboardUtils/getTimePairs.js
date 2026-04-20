import {timeService} from "../../../../../service/index.js";
import {chunkArray} from "../../../../chunkArray.js";

/**
 * @param {number} timeId
 * @returns {Promise<{id: number, value: number, isCurrent: boolean}[][]>}
 */
export async function getTimePairs(timeId) {
    const times = await timeService.getTimes();

    /**
     *
     * @type {{id: number, value: number, isCurrent: boolean}[]}
     */
    const arr = [];

    times.forEach(t => {
        const isCurrent = t.id === timeId;
        const value = t.time_value_minutes;

        arr.push({ id: t.id, value, isCurrent })
    })

    return chunkArray(arr, 2);
}