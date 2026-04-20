import {chunkArray} from "./chunkArray.js";
import {UTILITY_EMPTY_VALUE} from "../dictionary/index.js";
import {emojis, LightStatus} from "../constants/index.js";

const BLANK = "";
const MOVE_TO_NEXT_COLUMN = "\n";
const EMPTY_COLUMN_VALUE = "-";
const GAP = 2;

/**
 *
 * @param {{code: string, content: {time: string, value: string[]}}[]} arr
 * @param {number} chunkSize
 * @param {boolean} withTime
 * @returns {string}
 */
export function buildResponseTable(arr, chunkSize = 2, withTime = true) {
    const times = new Set();

    arr.forEach(({ content }) => {
        content.value.forEach(v => {
            const [_, time] = v.split(UTILITY_EMPTY_VALUE);
            times.add(time);
        });
    });

    const sortedTimes = Array.from(times).sort(sortTimes);
    const codes = arr.map(el => `${el.code} ${withTime ? el.content.time : ""}`);

    const globalWidth = GAP + Math.max(...arr.map(el => {
            const maxLen = Math.max(...el.content.value.map(v => v.length));
            return Math.max(maxLen, el.code.length);
        })
    );

    const chunks = chunkArray(codes, chunkSize);

    let output = BLANK;

    chunks.forEach(chunk => {
        output += chunk.map(c => c.padEnd(globalWidth)).join(UTILITY_EMPTY_VALUE) + MOVE_TO_NEXT_COLUMN;

        sortedTimes.forEach((time, index) => {
            const row = chunk.map(code => {
                const currentCode = code.split(UTILITY_EMPTY_VALUE)[0];
                const obj = arr.find(el => el.code === currentCode);
                const match = obj?.content.value.find(v => v.includes(time));
                const content = match ? match : EMPTY_COLUMN_VALUE;
                return content.padEnd(globalWidth);
            });

            const isTimeRow = row.some(cell => cell.trim().startsWith(emojis.time));
            if (isTimeRow && index > 1) {
                output += MOVE_TO_NEXT_COLUMN;
            }
            output += row.join(UTILITY_EMPTY_VALUE) + MOVE_TO_NEXT_COLUMN;
        });


        output += MOVE_TO_NEXT_COLUMN;
    });

    return `<pre>${output}</pre>`;
}

function sortTimes(a, b) {
    const priority = (s) => {
        if (s.startsWith(emojis.time)) return 0;
        if (s.startsWith(emojis["orange-circle"])) return 1;
        if (s.startsWith(emojis["red-circle"])) return 2;
        return 3;
    };

    const pa = priority(a);
    const pb = priority(b);

    if (pa !== pb) {
        return pa - pb;
    }

    const ta = getStartTime(a);
    const tb = getStartTime(b);
    return ta.localeCompare(tb);
}

function getStartTime(str) {
    const clean = str.replace(/[^\d:-]/g, "");
    return clean.split("-")[0];
}