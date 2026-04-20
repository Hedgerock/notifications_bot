import {queueRepository} from "./repository/QueueRepository.js";
import {RedisParent} from "../parent/RedisParent.js";
import {findIndexesOfCurrentQueues, format, prepareObjectToUse} from "../../utils/index.js";
import {getScrapper} from "../scrapper/ScrapperService.js";

/**
 * @implements Startable
 */
class QueueService extends RedisParent {
    #ttlForQueuesInSeconds = 43_200;
    #ttlForUserSelectionInSeconds = 200;
    #queues = [];
    #isInitiated = false;

    async init() {
        if (this.#isInitiated) return;

        this.#queues = await this.#getAllQueues();
        await this.#saveToRedis();
        this.#isInitiated = true;
    }

    async #saveToRedis() {
        await this._setRedisValue(
            this._queue_service_all_queues_key,
            this.#queues.map(val => val.toJSON()),
            this.#ttlForQueuesInSeconds
        );
    }

    getQueuesSetUpSelection() {
        const setup = {};
        this.#queues.forEach(queue => setup[queue.code] = false);

        return setup;
    }

    async #getAllQueues() {
        const memoQueues =
            await this._getRedisValue(this._queue_service_all_queues_key);

        if (memoQueues) {
            const parsed = JSON.parse(memoQueues);
            return queueRepository.buildQueue(parsed);
        }

        const queues = await queueRepository.findAll();
        this.#queues = queues;
        await this.#saveToRedis();

        return queues;
    }

    /**
     *
     * @returns {QueueInstance[]}
     */
    getQueues() {
        return this.#queues;
    }

    /**
     * @param {boolean} isTomorrowContent
     * @returns {Promise<QueueContent>}
     */
    async getInvolvedQueues(isTomorrowContent = false) {
        const actualKey = isTomorrowContent
            ? this._queue_service_tomorrow_involved_queues_key
            : this._queue_service_involved_queues_key

        const scrapperService = getScrapper();

        const involvedValues = await this._getRedisValue(actualKey);

        if (involvedValues) {
            return JSON.parse(involvedValues);
        }

        const queues = this.getQueues();
        const queuesCodes = queues.map(el => el.code);


        let actualSelectedRows;

        if (isTomorrowContent) {
            actualSelectedRows = await scrapperService.getTomorrowCurrentRows();
        } else {
            actualSelectedRows = await scrapperService.getCurrentRowsFromActiveIndex();
        }

        if (!actualSelectedRows) {
            throw new Error("График на завтра еще не выставлен, попробуйте повторить позже")
        }

        const startIndex = prepareObjectToUse(queuesCodes);

        queuesCodes.forEach(currentValue => {
            const queueContent = findIndexesOfCurrentQueues(actualSelectedRows, queuesCodes, currentValue);

            if (queueContent.length) {
                startIndex[currentValue] = queueContent;
            } else {
                delete startIndex[currentValue];
            }

        })

        const actualQueuesKeys = Object.keys(startIndex);

        const content = { startIndex, actualQueuesKeys, actualSelectedRows };

        await this._setRedisValue(actualKey, content)

        return content
    }

    /**
     *
     * @param id
     * @returns {Promise<UserSelection>}
     */
    async getUserSelection(id) {
        const key = format(this._queue_service_user_selection_key, id);

        const userSelection = await this._getRedisValue(key);

        if (userSelection) {
            return JSON.parse(userSelection);
        }

        const currentUserSelection = this.getQueuesSetUpSelection();
        await this._setRedisValue(key, currentUserSelection, this.#ttlForUserSelectionInSeconds);
        return currentUserSelection;
    }

    /**
     *
     * @param {string} id
     * @param {UserSelection} value
     * @returns {Promise<void>}
     */
    async setUserSelection(id, value) {
        const key = format(this._queue_service_user_selection_key, id);
        await this._setRedisValue(key, value, this.#ttlForUserSelectionInSeconds)
    }

    /**
     *
     * @param {string} id
     * @returns {Promise<void>}
     */
    async removeUserSelection(id) {
        const key = format(this._queue_service_user_selection_key, id);

        if (await this._isRedisKeyExists(key)) {
            await this._deleteRedisKey(key);
        }

    }

}

let queue;

/**
 *
 * @returns {QueueService}
 */
export function getQueue() {
    if (!queue) {
        queue = new QueueService();
    }
    return queue;
}