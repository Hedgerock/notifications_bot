import {emojis} from "../../../../constants/index.js";

/**
 *
 * @param {boolean} condition
 * @param {string} text
 * @returns {string}
 */
export function getOptionalTextContent(condition, text) {
    return `${condition ? emojis.selected : emojis.unselected} ${text}`;
}