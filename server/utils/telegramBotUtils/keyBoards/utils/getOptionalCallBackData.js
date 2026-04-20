import {CASE_NOOP_STATUS_OPTION} from "../../../../dictionary/index.js";

/**
 *
 * @param {boolean} condition
 * @param {string} option
 * @returns {string}
 */
export function getOptionalCallBackData(condition, option) {
    return condition ? option : CASE_NOOP_STATUS_OPTION
}