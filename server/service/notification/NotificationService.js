import {format, minutesUntil} from "../../utils/index.js";
import {RedisParent} from "../parent/RedisParent.js";
import {UTILITY_DELIMITER_FOR_DATA, UTILITY_EMPTY_VALUE} from "../../dictionary/index.js";
import {emojis} from "../../constants/index.js";
import {AppCoreConstants} from "../../constants/AppCoreConstantsClass.js";


class NotificationService extends RedisParent {
    //TODO
    #ttlSeconds = 360;

    /**
     *
     * @param {'user' | 'group'} keyFor
     * @returns { string }
     */
    getRawNotificationKey(keyFor) {
        switch (keyFor) {
            case "user":
                return this._notification_service_user_notification_key;
            case "group":
                return this._notification_service_user_group_notification_key;
            default:
                throw new Error(`Key ${keyFor} not found`)
        }
    }

    /**
     * @template T
     * @param {NotificationFields<T>} data
     * @param {import("bull").JobOptions} [opts]
     * @returns {Promise<import("bull").Job<NotificationFields<T>>>}
     */
    async addNewJob(data, opts) {
        return AppCoreConstants.NOTIFICATIONS.add(data, opts);
    }

    /**
     * @param {'user' | 'group'} notificationFor
     * @param {NotificationFields} params
     * @returns {Promise<boolean>}
     */
    async isNotificationSent(notificationFor, params) {
        switch (notificationFor) {
            case "user":
                const {user_id: userCaseUserId, queue_codes: userCaseCodes} = params.currentFields;
                return this.#isUserNotificationExists(userCaseUserId, userCaseCodes);
            case "group":
                const {user_id: groupCaseUserId, queue_codes: groupCaseCodes, group_id} = params.currentFields;
                return this.#isGroupNotificationExists(groupCaseUserId, group_id, groupCaseCodes);
            default:
                throw new Error(`Notification for ${notificationFor} not found`)
        }

    }

    /**
     * @param {string} key
     * @param {number} ttlInMinutes
     * @returns {Promise<void>}
     */
    async saveNotification(key, ttlInMinutes) {
        await this._setRedisValueWithoutParse(key, Date.now(), ttlInMinutes * 60);
    }

    /**
     *
     * @param {string} userId
     * @param {string} codes
     * @returns {Promise<boolean>}
     */
    async #isUserNotificationExists(userId, codes) {
        const key = format(this.getRawNotificationKey("user"), userId, codes);
        return this._isRedisKeyExists(key);
    }

    /**
     *
     * @param {string} userId
     * @param { string } groupId
     * @param {string} codes
     * @returns {Promise<boolean>}
     */
    async #isGroupNotificationExists(userId, groupId, codes) {
        const key = format(this.getRawNotificationKey("group"), userId, groupId, codes);
        return this._isRedisKeyExists(key);
    }

    /**
     *
     * @param {QueueInstance[]} activeQueues
     * @param {times: {[p:string]: {time: string, value: string[]}[]}} times
     * @param {number} timeBeforeNotify
     * @returns {{finalQueues: {code: string, content: {time: string, value: string[]}}[], codes: string}}
     */
    getQueuesForWorkAndCodes(activeQueues, times, timeBeforeNotify) {
        /**
         *
         * @type {{code: string, content: {time: string, value: string[]}}[]}
         */
        const finalQueues = [];

        activeQueues.forEach(q => {
            const code = q.code;
            const currentQueue = times[code];

            const currentRow = currentQueue.find(r => {
                const diff = minutesUntil(new Date(), r.time);
                return diff <= timeBeforeNotify && diff > 0;
            })

            if (!currentRow) {
                return;
            }

            finalQueues.push({ code, content: currentRow })

        })
        const codes = this.#setUpCodes(finalQueues);
        return {finalQueues, codes};
    }

    /**
     *
     * @returns {Promise<number>}
     */
    async getCounterForWork() {
        const value = await this._getRedisValue(this._notification_service_counter_for_work_key);

        if (value) {
            return Number(value);
        }

        const currentValue = 0;

        await this._setRedisValueWithoutParse(this._notification_service_counter_for_work_key, currentValue, 900);

        return currentValue;
    }


    async incrementCounterForWork() {
        await this._incrRedisValue(this._notification_service_counter_for_work_key, 1, 900);
    }

    async resetCounterForWork() {
        await this._deleteRedisKey(this._notification_service_counter_for_work_key);
    }

    async getResetScheduledValue() {
        const value = await this._getRedisValue(this._notification_service_reset_scheduled_key);
        return value === "1";
    }

    async updateResetScheduledValue(status) {
        await this._setRedisValueWithoutParse(
            this._notification_service_reset_scheduled_key,
            status ? "1" : "0",
            900
        );
    }

    /**
     *
     * @param {{code: string, content: {time: string, value: string[]}}[]} finalQueues
     * @returns {string}
     */
    #setUpCodes(finalQueues) {
        return finalQueues.map(q =>
            `${q.code}${UTILITY_DELIMITER_FOR_DATA}${q.content.time.split(UTILITY_EMPTY_VALUE).join(UTILITY_DELIMITER_FOR_DATA)}`).join(UTILITY_EMPTY_VALUE);
    }

    /**
     *
     * @param {QueueInstance[]} activeQueues
     * @param {times: {[p:string]: {time: string, value: string[]}[]}} times
     * @returns {{finalQueues: {code: string, content: {time: string, value: string[]}}[], codes: string}}
     */
    getAllQueuesForWorkAndCodes(activeQueues, times) {
        /**
         *
         * @type {{code: string, content: {time: string, value: string[]}}[]}
         */
        const finalQueues = [];

        activeQueues.forEach(q => {
            const code = q.code;
            const currentQueue = times[code]

            /**
             *
             * @type {{code: string, content: {time: string, value: string[]}}}
             */
            const middle = {
                code: code,
                content: {
                    time: "",
                    value: []
                }
            };

            currentQueue.forEach(row => {
                const time = row.time;
                const currentValue = row.value;

                if (!middle.content.time.length) {
                    middle.content.time = time;
                } else {
                    middle.content.time += ` ${time}`
                }

                middle.content.value.push(`${emojis.time} ${time}`, ...currentValue);
            })

            finalQueues.push(middle)
        })

        const codes = this.#setUpCodes(finalQueues);
        return {finalQueues, codes};
    }
}

export const notificationService = new NotificationService();