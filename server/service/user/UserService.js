import {RedisParent} from "../parent/RedisParent.js";
import {format} from "../../utils/index.js";
import {WithUserInvalidation} from "../middleware/index.js";
import {userRepository} from "./repository/UserRepository.js";
import {NotificationConstants} from "../../constants/index.js";

/**
 * @extends RedisParent
 * @mixes WithUserInvalidation
 */
class UserService extends WithUserInvalidation(RedisParent) {
    #ttlSeconds = 300;
    #ttlAllUsers = 180;

    /**
     *
     * @param {string} userId
     * @returns {Promise<{ status: boolean, timeId: number, mutedStatus: boolean }>}
     */
    async getSubscribedStatusById(userId) {
        const key = format(this._user_service_subscriber_key, userId);

        const subscriber = await this._getRedisValue(key);

        if (subscriber) {
            const content = JSON.parse(subscriber);

            return {timeId: content.timeId, status: content.status === "1", mutedStatus: content.mutedStatus === "1"} ;
        }

        const currentSubscriber = await this.getUserById(userId);
        const isSubscriber = currentSubscriber.is_subscriber ? "1" : "0";
        const isMuted = currentSubscriber.is_muted ? "1" : "0";

        await this._setRedisValue(key, {
            status: isSubscriber,
            timeId: currentSubscriber.time_until_notification_id,
            isMuted: isMuted
        }, this.#ttlSeconds);

        return {
            status: currentSubscriber.is_subscriber,
            timeId: currentSubscriber.time_until_notification_id,
            mutedStatus: currentSubscriber.is_muted
        };
    }

    /**
     *
     * @param {string} userId
     * @param {{ [status]: boolean, [timeId]: number, [mutedStatus]: boolean }} contentForUpdate
     * @returns {Promise<void>}
     */
    async updateSubscribedStatus(userId, contentForUpdate) {
        const key = format(this._user_service_subscriber_key, userId);

        const value = await this._getRedisValue(key);

        if (value) {
            const curSub = JSON.parse(value);
            await this._setRedisValue(key,
                {...curSub,
                    status: contentForUpdate.status ? "1" : "0",
                    timeId: contentForUpdate.timeId,
                    mutedStatus: contentForUpdate.mutedStatus ? "1" : "0"
                },
                this.#ttlSeconds);
        }
    }

    async removeSubscribedStatus(userId) {
        const key = format(this._user_service_subscriber_key, userId);
        await this._deleteRedisKey(key);
    }

    /**
     *
     * @param {string} userId
     * @returns {string}
     */
    #getRedisKeyForQueue(userId) {
        return format(this._user_service_current_user_queues_key, userId)
    }

    /**
     *
     * @param {string} userId
     * @returns {string}
     */
    #getRedisKeyForUser(userId) {
        return format(this._user_service_current_user_key, userId);
    }

    /**
     * @param {Object<User>} user
     * @param {string} id
     */
    async #saveCurrentUserToRedis(id, user) {
        const key = this.#getRedisKeyForUser(id);
        await this._setRedisValue(key, user.toJSON());
    }

    /**
     *
     * @param {Object} data
     * @returns {Promise<UserInstance>}
     */
    async createUser(data) {
        const { social_media_id } = data;
        const user = await userRepository.createUser(data);
        await this.#saveCurrentUserToRedis(social_media_id, user);

        return user;
    }

    /**
     *
     * @param {string} userId
     * @returns {Promise<UserInstance|null>}
     */
    async getUserById(userId) {
        const key = this.#getRedisKeyForUser(userId);

        const user = await this._getRedisValue(key);

        if (user) {
            const plainUser = JSON.parse(user);
            return userRepository.build(plainUser);
        }

        const currentUser =
            await userRepository.getUserById(userId);

        if (currentUser) {
            await this.#saveCurrentUserToRedis(userId, currentUser);
            return currentUser;
        }

        return null;
    }

    /**
     *
     * @param {string} userId
     * @param {number} ttlSeconds
     * @returns {Promise<{user: User, queues: QueueInstance[]}>} {user, queues}
     */
    async getUserQueues(userId, ttlSeconds = this.#ttlSeconds) {
        const key = this.#getRedisKeyForQueue(userId);
        const value = await this._getRedisValue(key)

        if (value) {
            return JSON.parse(value);
        }

        const user = await this.getUserById(userId);
        const queues = await user?.getQueues();

        if (queues?.length) {
            await this._setRedisValue(key, { user, queues }, ttlSeconds)
        }

        return { user, queues };
    }

    /**
     * @param {string} userId
     * @param {Queue|Queue[]|QueueInstance[]} queues
     * @returns {Promise<void>}
     */
    async addUsersQueues(userId, queues) {
        const user = await this.getUserById(userId);
        await user.setQueues(queues);

        const key = this.#getRedisKeyForQueue(userId);
        await this._deleteRedisKey(key);
    }

    /**
     *
     * @return {Promise<UserInstance[]>}
     */
    async getAllSubscribedUsers(offset=0, limit=NotificationConstants.USER_BATCH_SIZE) {
        const key = format(this._user_service_all_users_with_offset_and_limit_key, offset, limit);

        const cachedUsers = await this._getRedisValue(key);

        if (cachedUsers) {
            return userRepository.bulkBuildUser(JSON.parse(cachedUsers));
        }

        const users = await userRepository.getUsers(offset, limit);

        await this._setRedisValue(
            key,
            users.map(user => user.toJSON()),
            this.#ttlAllUsers
        )

        return users;
    }

    /**
     *
     * @param {string} userId
     * @param {UserFields} data
     * @returns {Promise<UserInstance>}
     */
    async updateUser(userId, data) {
        const user = await userRepository.updateUser(userId, data);

        const redisKey = this.#getRedisKeyForUser(userId);

        await this._deleteRedisKey(redisKey);
        await this._invalidateUsers();

        await this.#saveCurrentUserToRedis(userId, user);
        return user;
    }

}

export const userService = new UserService();