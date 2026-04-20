import {getTime} from "./getTime.js";

/**
 *
 * @param {string} time
 * @returns {boolean}
 */
export function isRowOfCurrentTime(time) {
    if (!time) return false;

    const { now } = getTime();
    const curHours = now.getHours();
    const curMinutes = now.getMinutes();

    const [[startHours, startMinutes], [endHours, endMinutes]] =
        time.split("-").map(el => el.split(":").map(Number));

    const startTotal= startHours * 60 + startMinutes;
    const endTotal= endHours * 60 + endMinutes;
    const curTotal= curHours * 60 + curMinutes;

    return curTotal >= startTotal && curTotal < endTotal;
}
