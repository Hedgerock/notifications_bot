import {UTILITY_DELIMITER_FOR_DATA, UTILITY_EMPTY_VALUE} from "../dictionary/index.js";
import {emojis} from "../constants/index.js";
import {chunkArray} from "./chunkArray.js";

/**
 *
 * @param {string} queue_codes
 * @returns {string}
 */
export function modifiedQueueCodes(queue_codes) {
    return queue_codes.split(UTILITY_EMPTY_VALUE)
    .map(code => `${emojis["light-icon"]} ${code.split(UTILITY_DELIMITER_FOR_DATA).join(" | ")}`)
    .join("\n");
}

/**
 *
 * @param {string} queue_codes
 */
export function modifiedMultipleCodes (queue_codes) {
    const obj = {};

    const arr = queue_codes.split(UTILITY_EMPTY_VALUE);

    for (const values of arr) {
        const [code, ...times] = values.split(UTILITY_DELIMITER_FOR_DATA);

        if (times.length <= 2) {
            obj[code] = `${emojis["light-icon"]} ${code} | ${times.join(" | ")}`;
            continue
        }

        const chunks = chunkArray(times, 2);

        for (const chunk of chunks) {
            if (obj[code]) {
                obj[code] += `${emojis["light-icon"]} ${code} | ${chunk.join(" | ")}\n`;
            } else {
                obj[code] = `${emojis["light-icon"]} ${code} | ${chunk.join(" | ")}\n`;
            }
        }

    }

    return Object.values(obj).join("\n")
}