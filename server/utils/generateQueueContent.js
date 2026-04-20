import {emojis, LightStatus} from "../constants/index.js";

/**
 *
 * @param {number[][]} queueArr
 * @param {string} code
 * @param {Rows[]} rows
 * @returns {{time: string, value: string[]}[]}
 */
export function generateQueueContent(queueArr, code, rows) {
    /**
     *
     * @type {{time: string, value: string[]}[]}
     */
    const arr = [];

    for (let i = 0; i < queueArr.length; i++) {
        const [start, end] = queueArr[i];

        const currentValues = rows
            .slice(start, end + 1)
            .map(val => ({ ...val, values: val.values.filter(el => el.content === code) }))
            .filter(val => val.values.length);

        if (currentValues.length) {
            const currentTime =
                `${currentValues[0].time.split("-")[0]}-` +
                `${currentValues[currentValues.length - 1].time.split("-").slice(-1)[0]}`

            const currentValue = currentValues.map(el => {
                const time = el.time;
                const content = el.values.map(cur => {
                    const [_, __, status] = cur.className.split(" ");

                    const currentStatus = Object.values(LightStatus).find(el => el.selector === status);
                    return currentStatus.emoji;
                }).join("");

                return `${content} ${time}`
            })

            arr.push({
                time: currentTime,
                value: currentValue
            })
        }
    }

    return arr;
}