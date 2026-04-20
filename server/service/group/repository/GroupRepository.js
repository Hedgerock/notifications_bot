import {AppCoreConstants} from "../../../constants/AppCoreConstantsClass.js";

class GroupRepository {

    /**
     *
     * @param {GroupFields} data
     * @returns {Promise<GroupInstance>}
     */
    async createGroup(data) {
        return AppCoreConstants.ORM_ENTITIES.Group.create(data);
    }

    /**
     *
     * @param {string} groupId
     * @returns {Promise<GroupInstance>}
     */
    async getGroup(groupId) {
        return /** @type {GroupInstance} */ AppCoreConstants.ORM_ENTITIES.Group.findOne({
            where: {
                group_id: groupId
            }
        })
    }

    /**
     *
     * @param {string} userId
     * @returns {Promise<GroupInstance[]>}
     */
    async getGroups(userId) {
        return /** @type {GroupInstance[]} */ AppCoreConstants.ORM_ENTITIES.Group.findAll({
            where: {
                user_id: userId,
            }
        })
    }

    /**
     *
     * @param {string} groupId
     * @param {GroupFields} data
     * @returns {Promise<GroupInstance>}
     */
    async updateGroup(groupId, data) {
        const [_, affectedRows] = await AppCoreConstants.ORM_ENTITIES.Group.update(
            {...data},
            {
                where: {
                    group_id: groupId
                },
                returning: true
            }
        )

        return /** @type {GroupInstance} */ affectedRows[0];
    }

    /**
     *
     * @param {Object} group
     * @param {Object} options
     * @returns {Promise<GroupInstance>}
     */
    async build(group, options = { isNewRecord: false })  {
        return /** @type {GroupInstance} */ AppCoreConstants.ORM_ENTITIES.Group.build(group, options);
    }

    /**
     *
     * @param {Object} group
     * @param {Object} options
     * @returns {Promise<GroupInstance[]>}
     */
    async bulkBuild(group, options = { isNewRecord: false })  {
        return /** @type {GroupInstance[]} */ AppCoreConstants.ORM_ENTITIES.Group.bulkBuild(group, options);
    }

    /**
     *
     * @param {string} groupId
     * @returns {Promise<void>}
     */
    async deleteGroup(groupId) {
        await AppCoreConstants.ORM_ENTITIES.Group.destroy({
            where: {
                group_id: groupId
            }
        });
    }
}

export const groupRepository = new GroupRepository();