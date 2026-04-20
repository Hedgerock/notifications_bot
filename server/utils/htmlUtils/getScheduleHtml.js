import {buildTable} from "./buildTable.js";
import {getScrapper} from "../../service/index.js";

export async function getScheduleHtml() {
    const scrapperService = getScrapper();
    const rows = await scrapperService.getCurrentRows();
    return buildTable(rows);
}