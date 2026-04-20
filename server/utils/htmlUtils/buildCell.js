import {colors, LightStatus} from "../../constants/index.js";

/**
 *
 * @param {ValueCell} cell
 * @param {number} cellInd
 * @param {boolean} isCurrentTime
 * @returns {string}
 */
export function buildCell(cell, cellInd, isCurrentTime) {
    const tdCellClassName = `table-row-box__cell ${isCurrentTime ? "table-row-box__cell_current" : ""}`;
    const [_, __, value] = cell.className.split(" ")

    const statusKeys = Object.values(LightStatus).find(val => {
        return val.selector === value;
    });

    const color = statusKeys.color;

    return (
        `<td 
            id="cell-${cellInd}" 
            style="background: ${color}" 
            class="${tdCellClassName}"
        >
            ${cell.content}
        </td>`
    );
}