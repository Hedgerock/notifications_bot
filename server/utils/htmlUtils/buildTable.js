import {isRowOfCurrentTime} from "../isRowOfCurrentTime.js";
import {buildCell} from "./buildCell.js";
import {getQueue} from "../../service/index.js";

export function buildTable(rows) {
    const queueService = getQueue();
    const colSpanLength = queueService.getQueues().length;

    let html = `
        <table border='1'>
            <thead>
                <tr class="table-head">
                    <th>Время</th>
                    <th colspan='${colSpanLength}'>Очереди</th>
                </tr>
            </thead>
    `;

    for (const row of rows) {
        const isCurrentTime = isRowOfCurrentTime(row.time);
        let rowInd = 0;
        let cellInd = 0;

        const trClassName = "table-row-box";
        const tdClassName = `table-row-box__time ${isCurrentTime ? "table-row-box__time_current" : ""}`

        html += `<tr id="row-${isCurrentTime ? "selected": rowInd}" class="${trClassName}">`;
        html += `<td class="${tdClassName}">${row.time}</td>`;

        for (const cell of row.values) {
            html += buildCell(cell, cellInd, isCurrentTime);
            cellInd++;
        }

        html += "</tr>";
        rowInd++;
    }

    html += `</table>`;
    return html;
}