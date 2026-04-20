/**
 *
 * @param {Date} date
 * @param {string} timeStr - format hh:mm-hh:mm
 * @returns {number}
 */
export function minutesUntil(date, timeStr) {
    const dateMinutes = date.getHours() * 60 + date.getMinutes();

    const [hh, mm] = timeStr.split("-")[0].split(":").map(Number);
    const strMinutes = hh * 60 + mm;

    return strMinutes - dateMinutes;
}