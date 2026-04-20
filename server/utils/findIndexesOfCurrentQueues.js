import {LightStatus} from "../constants/index.js";

/**
 *
 * @param tempRows
 * @param {Array<string>} queuesCodes
 * @param {string} currentValue
 * @returns { number[][] }
 */
export function findIndexesOfCurrentQueues(tempRows, queuesCodes, currentValue) {
    let stop = false;

    /**
     *
     * @type {number[][]}
     */
    const startIndex = [];

    for (let i = 0; i < tempRows.length; i++) {
        const isNotEnable = tempRows[i].values.some(cur => {
            const [_, __, status] = cur.className.split(" ");
            return cur.content === currentValue && status !== LightStatus.ENABLE.selector;
        })

        if (isNotEnable) {

            if (i === tempRows.length - 1) {
                startIndex.push([i, i]);
                break;
            }

            for (let j = i + 1; j < tempRows.length; j++) {
                if (j === tempRows.length - 1) {
                    startIndex.push([i, j]);
                    stop = true;
                    break;
                }

                const isEnable = tempRows[j].values.some(cur => {
                    const [_, __, status] = cur.className.split(" ");
                    return cur.content === currentValue && status === LightStatus.ENABLE.selector;
                })

                if (isEnable) {
                    startIndex.push([i, --j]);
                    i = j;
                    break;
                }
            }

            if (stop) {
                break;
            }
        }
    }

    return startIndex;
}