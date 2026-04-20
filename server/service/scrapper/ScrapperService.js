import {getRows, isRowOfCurrentTime} from "../../utils/index.js";
import {RedisParent} from "../parent/RedisParent.js";
import {IntervalTimeConstants} from "../../constants/index.js";

/**
 * @implements Startable
 */
class ScrapperService extends RedisParent {
    #currentRows;
    #ttlSeconds = Math.floor(IntervalTimeConstants.SCRAPPER_INTERVAL_TIMEOUT_IN_MILLIS / 1_000);
    #activeIndex;
    #isInitiated = false;
    #tomorrowRows;

    async init() {
        if (this.#isInitiated) return;

        await this.#revalidateRows();

        this.#activeIndex = this.#findActiveIndex();
        this.#isInitiated = true;
    }

    async #revalidateRows() {
        await this._deleteRedisKey(this._scrapper_service_rows_key);
        await this._deleteRedisKey(this._queue_service_involved_queues_key);
        await this._deleteRedisKey(this._queue_service_tomorrow_involved_queues_key);

        const { browser, rows, tomorrowRows } = await getRows();
        this.#currentRows = rows;
        this.#tomorrowRows = tomorrowRows;
        this.#activeIndex = this.#findActiveIndex();
        await browser.close();
        await this._setRedisValue(this._scrapper_service_rows_key, this.#currentRows, this.#ttlSeconds)

        if (this.#tomorrowRows) {
            await this._setRedisValue(this._scrapper_service_tomorrow_rows_key, this.#tomorrowRows, this.#ttlSeconds);
        }
    }

    #findActiveIndex() {
        return this.#currentRows.findIndex(row => {
            return isRowOfCurrentTime(row.time);
        })
    }

    /**
     *
     * @returns {Promise<Rows[]>}
     */
    async getCurrentRows() {
        const rows = await this._getRedisValue(this._scrapper_service_rows_key);

        if (rows) {
            this.#currentRows = JSON.parse(rows);
            return JSON.parse(rows);
        }

        await this.#revalidateRows();

        return this.#currentRows;
    }

    /**
     *
     * @returns {Promise<Rows[]>}
     */
    async getCurrentRowsFromActiveIndex() {
        const rows = await this.getCurrentRows();
        return rows.slice(this.#activeIndex);
    }

    async getTomorrowCurrentRows() {
        return this.#tomorrowRows;
    }

    async getActiveIndex() {
        return this.#activeIndex;
    }

    async getNextActiveIndex() {
        const currentRowsTotalIndexes = this.#currentRows.length - 1;
        const candidateIndex = this.#activeIndex + 1;

        return currentRowsTotalIndexes < candidateIndex ? 0 : candidateIndex;
    }
}

let scrapper;

/**
 *
 * @returns {ScrapperService}
 */
export function getScrapper() {
    if (!scrapper) {
        scrapper = new ScrapperService();
    }
    return scrapper;
}