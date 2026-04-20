import {buildTable} from "../../utils/htmlUtils/index.js";
import {getScrapper} from "../scrapper/ScrapperService.js";
import {RedisParent} from "../parent/RedisParent.js";

/**
 * @implements Startable
 */
class HtmlService extends RedisParent {
    #htmlContent;
    #rowsSnapshot;
    #ttlValue = 180;

    async init() {
        const scrapperService = getScrapper();
        const rows = await scrapperService.getCurrentRows();
        this.#rowsSnapshot = rows;
        this.#htmlContent = buildTable(rows);
        await this.#saveToRedis();
    }

    async #saveToRedis() {
        await this._setRedisValueWithoutParse(this._html_service_html_key, this.#htmlContent, this.#ttlValue)
    }

    /**
     *
     * @returns {Promise<string>}
     */
    async getHtmlContent() {
        const html = await this._getRedisValue(this._html_service_html_key);

        if (html) {
            this.#htmlContent = html;
            return this.#htmlContent;
        }

        await this.init();
        return this.#htmlContent;
    }

    /**
     *
     * @returns {Promise<{status: boolean, html: string}>}
     */
    async invalidateHtmlContent() {
        const scrapperService = getScrapper();
        const rows = await scrapperService.getCurrentRows();
        const isChanged = JSON.stringify(rows) !== JSON.stringify(this.#rowsSnapshot);

        if (isChanged) {
            this.#rowsSnapshot = rows;
            this.#htmlContent = buildTable(rows);
            await this.#saveToRedis();

            console.log("Data updated, HTML updated and saved in Redis")
        }

        return { status: isChanged, html: this.#htmlContent };
    }

}

let html;

/**
 *
 * @returns {HtmlService}
 */
export function getHtmlService() {
    if (!html) {
        html = new HtmlService();
    }
    return html;
}