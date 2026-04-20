import {format} from "../../utils/index.js";

/**
 * @template T
 * @param {Constructor<RedisParent>} Base
 */
export function WithUserInvalidation(Base) {
    return class extends Base {
        /**
         * @returns {Promise<void>}
         * @protected
         */
        async _invalidateUsers() {
            const userKeys =
                await this._getAllKeys(format(this._user_service_all_users_with_offset_and_limit_key, "*", "*"))

            for (const key of userKeys) {
                await this._deleteRedisKey(key);
            }
        }
    }
}