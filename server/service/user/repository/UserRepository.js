import {Aliases} from "../../../db/constants/index.js";
import {AppCoreConstants} from "../../../constants/AppCoreConstantsClass.js";

class UserRepository {

    /**
     *
     * @param {Object} data
     * @returns {Promise<UserInstance>}
     */
    async createUser(data) {
        return AppCoreConstants.ORM_ENTITIES.User.create(data);
    }

    /**
     * @param {string} userId
     * @returns {Promise<UserInstance|null>}
     */
    async getUserById(userId) {
        return /**@type{UserInstance | null} */AppCoreConstants.ORM_ENTITIES.User.findOne({
            where: {
                social_media_id: userId
            },
        })
    }

    /**
     *
     * @param {number} offset
     * @param {number} limit
     * @returns {Promise<UserInstance[]>}
     */
    async getUsers(offset, limit) {
        return /**@type{UserInstance[]} */ AppCoreConstants.ORM_ENTITIES.User.findAll({
            offset,
            limit,
            include: [
                {
                    model: AppCoreConstants.ORM_ENTITIES.Queue,
                    as: Aliases.users_Queue_alias,
                },
                {
                    model: AppCoreConstants.ORM_ENTITIES.TimeBeforeNotification,
                    as: Aliases.users_TimeBeforeNotification_alias,
                },
                {
                    model: AppCoreConstants.ORM_ENTITIES.Group,
                    as: Aliases.users_Group_alias,
                    required: false,
                    where: {
                        is_subscriber: true
                    },
                    include: [
                        {
                            model: AppCoreConstants.ORM_ENTITIES.Queue,
                            as: Aliases.groups_Queue_alias
                        },
                        {
                            model: AppCoreConstants.ORM_ENTITIES.TimeBeforeNotification,
                            as: Aliases.groups_TimeBeforeNotification_alias
                        }
                    ]
                }
            ],
            where: {
                is_subscriber: true
            }
        });
    }

    /**
     *
     * @param { Object } user
     * @param { Object } options
     * @returns {Promise<UserInstance>}
     */
    async build(user, options = { isNewRecord: false })  {
        return /** @type {UserInstance}*/ AppCoreConstants.ORM_ENTITIES.User.build(user, options);
    }

    /**
     *
     * @param {Object} users
     * @param {{isNewRecord: boolean}} options
     * @returns {Promise<UserInstance[]>}
     */
    async bulkBuildUser(users, options =  {isNewRecord: false}) {
        return /** @type {UserInstance[]}*/ AppCoreConstants.ORM_ENTITIES.User.bulkBuild(users, {...options, include: [
                { model: AppCoreConstants.ORM_ENTITIES.Group, as: Aliases.users_Group_alias, include: [
                        { model: AppCoreConstants.ORM_ENTITIES.Queue, as: Aliases.groups_Queue_alias },
                        { model: AppCoreConstants.ORM_ENTITIES.TimeBeforeNotification, as: Aliases.groups_TimeBeforeNotification_alias }
                    ]
                },
                { model: AppCoreConstants.ORM_ENTITIES.Queue, as: Aliases.users_Queue_alias },
                { model: AppCoreConstants.ORM_ENTITIES.TimeBeforeNotification, as: Aliases.users_TimeBeforeNotification_alias }
            ]
        })
    }

    /**
     *
     * @param {string} userId
     * @param {UserFields} data
     * @returns {Promise<UserInstance>}
     */
    async updateUser(userId, data) {

        const [_, affectedRows] = await AppCoreConstants.ORM_ENTITIES.User.update(
            {...data},
            {
                where: {
                    social_media_id: userId
                },
                returning: true
            }
        )

        return /** @type {UserInstance}*/ affectedRows[0];
    }

    async hardDelete(userId) {
        return AppCoreConstants.ORM_ENTITIES.User.destroy({ where: { social_media_id: userId } })
    }

}

export const userRepository = new UserRepository();