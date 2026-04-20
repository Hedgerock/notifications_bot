import {AppCoreConstants} from "../../constants/AppCoreConstantsClass.js";


export class RedisParent {
    #ttlSeconds = 180;

    /**
     *
     * @type {string}
     * @protected
     */
    _user_service_current_user_queues_key = `user:%s:queues`

    /**
     *
     * @type {string}
     * @protected
     */
    _user_service_current_user_key = `user:%s`;

    /**
     *
     * @type {string}
     * @protected
     */
    _notification_service_user_notification_key = "notified:%s:%s";

    /**
     *
     * @type {string}
     * @protected
     */
    _notification_service_counter_for_work_key = "counter_for_work_value";
    /**
     *
     * @type {string}
     * @protected
     */
    _notification_service_reset_scheduled_key = "reset_scheduled";
    /**
     *
     * @type {string}
     * @protected
     */
    _notification_service_user_group_notification_key = "notified:%s:%s:%s";
    /**
     *
     * @type {string}
     * @protected
     */
    _user_service_all_users_with_offset_and_limit_key = "all_users_offset_%s_%s"
    /**
     *
     * @type {string}
     * @protected
     */
    _user_service_subscriber_key = "subscriber:%s";
    /**
     *
     * @type {string}
     * @protected
     */
    _queue_service_all_queues_key = "queues:prev";
    /**
     *
     * @type {string}
     * @protected
     */
    _queue_service_user_selection_key = "user_selection:%s";
    /**
     *
     * @type {string}
     * @protected
     */
    _queue_service_involved_queues_key = "involved_queues"
    _queue_service_tomorrow_involved_queues_key = "involved_tommorow_queues";
    /**
     *
     * @type {string}
     * @protected
     */
    _session_service_session_key = "session:%s";
    /**
     *
     * @type {string}
     * @protected
     */
    _scrapper_service_rows_key = "rows:latest"
    /**
     *
     * @type {string}
     * @protected
     */
    _scrapper_service_tomorrow_rows_key = "tomorrow_rows:latest";
    /**
     *
     * @type {string}
     * @protected
     */
    _html_service_html_key = "html:latest";
    /**
     *
     * @type {string}
     * @protected
     */
    _group_service_group_key = "group:%s";
    /**
     *
     * @type {string}
     * @protected
     */
    _group_service_current_groups_key = "groups:queues:%s";
    /**
     *
     * @type {string}
     * @protected
     */
    _group_service_current_user_groups_key = "user:%s:groups"

    /**
     *
     * @type {string}
     * @protected
     */
    _time_service_time_times_key = "current_times";

    /**
     *
     * @type {string}
     * @protected
     */
    _time_service_current_time_key = "current_time_%s";

    /**
     *
     * @param {string} key
     * @returns {Promise<boolean>}
     * @protected
     */
    async _isRedisKeyExists(key) {
        const result = await AppCoreConstants.REDIS.exists(key);

        return result > 0;
    }

    /**
     *
     * @param {string} key
     * @param {any} value
     * @param {number} ttlSeconds
     * @returns {Promise<void>}
     * @protected
     */
    async _setRedisValue(key, value, ttlSeconds = this.#ttlSeconds) {
        await AppCoreConstants.REDIS.set(key, JSON.stringify(value), {EX: ttlSeconds})
    }

    /**
     *
     * @param {string} key
     * @param {any} value
     * @param {number} ttlSeconds
     * @returns {Promise<void>}
     * @protected
     */
    async _setRedisValueWithoutParse(key, value,  ttlSeconds = this.#ttlSeconds) {
        await AppCoreConstants.REDIS.set(key, value, {EX: ttlSeconds})
    }

    /**
     *
     * @param {string} key
     * @param {number} value
     * @param {number} ttlSeconds
     * @returns {Promise<void>}
     * @protected
     */
    async _incrRedisValue(key, value = 1, ttlSeconds = this.#ttlSeconds) {
        await AppCoreConstants.REDIS.incrBy(key, value);
        await AppCoreConstants.REDIS.expire(key, ttlSeconds);
    }

    /**
     *
     * @param {string} key
     * @param {any} value
     * @returns {Promise<void>}
     * @protected
     */
    async _setRedisValueWithoutTTl(key, value) {
        await AppCoreConstants.REDIS.set(key, JSON.stringify(value))
    }

    /**
     *
     * @param {string} keyTemplate
     * @returns {Promise<ReplyWithTypeMapping<CommandReply<{readonly NOT_KEYED_COMMAND: true, readonly IS_READ_ONLY: true, readonly parseCommand: (this:void, parser: import("../..").CommandParser, pattern: import("../RESP/types").RedisArgument) => void, readonly transformReply: () => import("../RESP/types").ArrayReply<import("../RESP/types").BlobStringReply<string>>}, 2 | 3>, TypeMapping>>}
     * @protected
     */
    async _getAllKeys(keyTemplate) {
        return AppCoreConstants.REDIS.keys(keyTemplate);
    }

    /**
     *
     * @param {string} key
     * @returns {Promise<*>}
     * @protected
     */
    async _getRedisValue(key) {
        return AppCoreConstants.REDIS.get(key);
    }

    /**
     *
     * @param {string} key
     * @returns {Promise<void>}
     * @protected
     */
    async _deleteRedisKey(key) {
        await AppCoreConstants.REDIS.del(key);
    }
}