import {RedisParent} from "../parent/RedisParent.js";
import {groupRepository} from "./repository/GroupRepository.js";
import {format} from "../../utils/index.js";
import {userService} from "../user/UserService.js";
import {WithUserInvalidation} from "../middleware/index.js";

/**
 * @extends RedisParent
 * @mixes WithUserInvalidation
 */
class GroupService extends WithUserInvalidation(RedisParent) {
    #ttlSeconds = 180

    /**
     *
     * @param {string} id
     * @param {GroupFields} value
     * @returns {Promise<void>}
     */
    async #saveToRedis(id, value) {
        await this._setRedisValue(
            format(this._group_service_group_key, id),
            value,
            this.#ttlSeconds
        )
    }

    /**
     * @param {GroupFields} data
     * @returns {Promise<GroupInstance>}
     */
    async createGroup(data) {
        const { group_id, user_id } = data;
        const group = await groupRepository.createGroup(data);
        await this.#initGroupQueues(group, user_id, group_id);
        const groupKey = format(this._group_service_current_user_groups_key, group_id);

        await this._setRedisValue(groupKey, group.toJSON(), this.#ttlSeconds);

        const userGroupsKey = format(this._group_service_current_user_groups_key, user_id);
        const existingGroups = await this._getRedisValue(userGroupsKey);
        const parsed = existingGroups ? JSON.parse(existingGroups) : [];
        const updated = [...parsed, group.toJSON()];

        await this._setRedisValue(userGroupsKey, updated, this.#ttlSeconds);
        await this._deleteRedisKey(format(this._user_service_current_user_key, user_id));
        await this._invalidateUsers();
        return group;
    }

    /**
     *
     * @param {GroupRelations | GroupInstance} currentGroup
     * @param {string} userId
     * @param {string} groupId
     * @returns {Promise<void>}
     */
    async #initGroupQueues(currentGroup, userId, groupId) {
        const userQueues = await (await userService.getUserById(userId)).getQueues();

        await currentGroup.addGroupQueues(userQueues);

        const key = format(this._group_service_current_groups_key, groupId);

        if (await this._isRedisKeyExists(key)) {
            await this._deleteRedisKey(key);
        }

        const groupsRedisKeyId = format(this._group_service_current_user_groups_key, groupId);

        if (await this._isRedisKeyExists(groupsRedisKeyId)) {
            await this._deleteRedisKey(groupsRedisKeyId);
            await this._invalidateUsers();
        }

    }

    /**
     *
     * @param {string} groupId
     * @param {GroupFields} data
     * @param {string} userId
     * @returns {Promise<void>}
     */
    async updateGroup(groupId, data, userId) {
        const key = format(this._group_service_group_key, groupId);
        const userKey = format(this._group_service_current_user_groups_key, userId);

        await this._deleteRedisKey(key);
        await this._deleteRedisKey(userKey);
        await this._invalidateUsers();

        const group = await groupRepository.updateGroup(groupId, data)

        await this._setRedisValue(key, group.toJSON());
    }

    /**
     *
     * @param {string} groupId
     * @returns {Promise<QueueInstance[]>}
     */
    async getGroupQueues(groupId) {
        const key = format(this._group_service_current_groups_key, groupId);
        const groups = await this._getRedisValue(key);

        if (groups) {
            return JSON.parse(groups);
        }

        const group = await this.getGroupById(groupId);
        const currentGroups = await group.getGroupQueues();

        if (currentGroups.length) {
            await this._setRedisValue(
                key,
                currentGroups.map(group => group.toJSON()),
                this.#ttlSeconds
            )
        }

        return currentGroups;
    }

    /**
     *
     * @param {string} groupId
     * @returns {Promise<GroupInstance>}
     */
    async getGroupById(groupId) {
        const cachedGroup = await this._getRedisValue(format(this._group_service_group_key, groupId));

        if (cachedGroup) {
            return groupRepository.build(JSON.parse(cachedGroup))
        }

        const group = await groupRepository.getGroup(groupId);

        if (!group) {
            return null
        }

        await this.#saveToRedis(groupId, group.toJSON());
        return group;
}

    /**
     *
     * @param {string} userId
     * @returns {Promise<GroupInstance[]>}
     */
    async getGroupsByUserId(userId) {
        const cachedGroups = await this._getRedisValue(format(this._group_service_current_user_groups_key, userId))

        if (cachedGroups) {
            return groupRepository.bulkBuild(JSON.parse(cachedGroups));
        }

        const groups = await groupRepository.getGroups(userId);
        await this._setRedisValue(
            format(this._group_service_current_user_groups_key, userId),
            groups.map(g => g.toJSON()),
            this.#ttlSeconds
        )

        return groups;
    }

    /**
     *
     * @param {string} groupId
     * @param {QueueInstance[]} queues
     * @returns {Promise<void>}
     */
    async updateGroupsQueues(groupId, queues) {
        const group = await this.getGroupById(groupId);
        await group.setGroupQueues(queues);

        const key = format(this._group_service_current_groups_key, groupId);

        await this._deleteRedisKey(key);
        await this._invalidateUsers();

    }

    /**
     *
     * @param {string} groupId
     * @returns {Promise<{groupName: string, status: boolean, timeId: number, mutedStatus: boolean}>}
     */
    async getSubscribedStatusById(groupId) {
        const key = format(this._user_service_subscriber_key, groupId);

        const subscriber = await this._getRedisValue(key);

        if (subscriber) {
            const curSubscriber = JSON.parse(subscriber);
            return { ...curSubscriber,
                status: curSubscriber.status === "1",
                mutedStatus: curSubscriber.mutedStatus === "1"
            };
        }

        const currentSubscriber = await this.getGroupById(groupId);
        const isSubscriber =
            {
                groupName: currentSubscriber.group_name,
                status: currentSubscriber.is_subscriber ? "1" : "0",
                timeId: currentSubscriber.time_until_notification_id,
                mutedStatus: currentSubscriber.is_muted ? "1" : "0",
            };

        await this._setRedisValue(key, isSubscriber, this.#ttlSeconds);

        return {...isSubscriber, status: isSubscriber.status === "1", mutedStatus: isSubscriber.mutedStatus === "1"};
    }

    /**
     *
     * @param {string} groupId
     * @param {{[status]: boolean, [timeId]: number, [groupName]: string, [mutedStatus]: boolean}} contentForUpdate
     * @returns {Promise<void>}
     */
    async updateSubscribedStatusById(groupId, contentForUpdate) {
        const key = format(this._user_service_subscriber_key, groupId);

        const value = await this._getRedisValue(key);

        if (value) {
            const curSub = JSON.parse(value);
            await this._setRedisValue(key,
                {...curSub,
                    status: contentForUpdate.status ? "1" : "0",
                    timeId: contentForUpdate.timeId,
                    mutedStatus: contentForUpdate.mutedStatus ? "1" : "0",
                },
                this.#ttlSeconds);
        }

    }

    /**
     *
     * @param {string} groupId
     * @return {Promise<void>}
     */
    async removeSubscribedStatus(groupId) {
        const key = format(this._user_service_subscriber_key, groupId);
        if (await this._isRedisKeyExists(key)) {
            await this._deleteRedisKey(key);
        }
    }

    /**
     *
     * @param {string} groupId
     * @param {string} userId
     * @returns {Promise<void>}
     */
    async deleteGroup(groupId, userId) {
        const groupsUserKey = format(this._group_service_current_user_groups_key, userId);
        const groupsKey = format(this._group_service_current_groups_key, groupId);
        const currentGroupKey = format(this._group_service_group_key, groupId);
        const userKey = format(this._user_service_current_user_key, userId)

        await this._deleteRedisKey(groupsUserKey);
        await this._deleteRedisKey(groupsKey);
        await this._deleteRedisKey(currentGroupKey);
        await this._deleteRedisKey(userKey);
        await this._invalidateUsers();


        await groupRepository.deleteGroup(groupId);
    }
}

export const groupService = new GroupService();