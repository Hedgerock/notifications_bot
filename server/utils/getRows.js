import puppeteer from "puppeteer";
import {isRowOfCurrentTime} from "./isRowOfCurrentTime.js";
import {getQueue} from "../service/index.js";
import {ScrapperWebsiteConstants} from "../constants/index.js";

/**
 *
 * @returns {Promise<{rows: Rows[], browser: Browser, tomorrowRows: Rows[] | null}>}
 */
export async function getRows(){
    const browser = process.env.PUPPETEER_EXECUTABLE_PATH
        ? await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        : await puppeteer.launch({
            headless: true
        });

    const page = await browser.newPage();
    await page.goto(ScrapperWebsiteConstants.WEBSITE_URL, { waitUntil: "networkidle2" });
    await page.waitForSelector(ScrapperWebsiteConstants.SELECTOR_FOR_WAIT);

    const rows = await initRows(page);

    const buttons = await page.$$(ScrapperWebsiteConstants.BUTTON_FOR_TOMORROW_SCHEDULE)

    let tomorrowRows = null;

    if (buttons.length >= 2) {
        const tomorrowButton = buttons[1];
        await tomorrowButton.click();
        await page.waitForSelector(ScrapperWebsiteConstants.SELECTOR_FOR_WAIT);

        tomorrowRows = await initRows(page);
    }

    await page.close();

    return { rows, browser, tomorrowRows }
}

/**
 *
 * @param page
 * @returns {Promise<Rows[]>}
 */
export async function initRows(page) {
    const queueService = getQueue();
    const queues = queueService.getQueues().map(el => el.code);
    /**
     *
     * @type {RawRow[]}
     */
    const rowsRaw = await page.$$eval(ScrapperWebsiteConstants.SELECTOR_TO_WORK, (trs, queuesCollection) =>
            trs.map(tr => {
                const cells = Array.from(tr.querySelectorAll("td"))
                    .filter((el, index) =>
                        index === 0 || queuesCollection.includes(el.textContent.trim()))
                    .map(td => (
                        {
                            content: td.textContent.trim(),
                            className: td.className,
                        })
                    );

                const time = cells[0]?.content ?? null;
                const values = cells.slice(1).map(el =>
                    ({ content: el.content, className: el.className }))

                return { time, values };
            }),
        queues
    );


    return rowsRaw.map(row => {
        return {
            time: row.time,
            isCurrent: isRowOfCurrentTime(row.time),
            values: row.values
        }
    })
}