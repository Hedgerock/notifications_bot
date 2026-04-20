import {DAYS} from "../constants/index.js";
import {getTime} from "./getTime.js";

export function getDayInfo(isTomorrow = false) {
    const {now} = getTime();

    let currentNow = new Date(now);

    if (isTomorrow) {
        currentNow.setDate(now.getDate() + 1);
    }

    const day = DAYS[currentNow.getDay()];
    const date = currentNow.getDate();
    const modifiedDate = date <= 9 ? `0${date}` : date;
    const month = currentNow.getMonth() + 1;
    const modifiedMonth = month <= 9 ? `0${month}` : month;
    const year = currentNow.getFullYear();

    return {
        day, modifiedDate, modifiedMonth, year
    }
}