import {
    defineGroupEntity,
    defineGroupQueue, defineMessengerEntity,
    defineQueueEntity, defineTimeBeforeNotificationEntity, defineUserCityEntity,
    defineUserEntity,
    defineUserQueue
} from "../db/entities/index.js";
import {Aliases, ForeignSourceAndOtherKeys, OccursActions} from "../db/constants/index.js";


class EntitiesClass {

    constructor(orm) {
        this._users = defineUserEntity(orm);
        this._groups = defineGroupEntity(orm);
        this._groupQueues = defineGroupQueue(orm);
        this._queue = defineQueueEntity(orm);
        this._userQueues = defineUserQueue(orm);
        this._userCity = defineUserCityEntity(orm);
        this._timeBeforeNotification = defineTimeBeforeNotificationEntity(orm);
        this._messenger = defineMessengerEntity(orm);

        this.#setUpConnections();
    }

    #setUpConnections() {
        //================================================== USER ======================================================
        this.User.belongsToMany(this.Queue, {
            through: this.UserQueue,
            foreignKey: ForeignSourceAndOtherKeys.users_Queue_foreignKey,
            otherKey: ForeignSourceAndOtherKeys.users_Queue_otherKey,
            as: Aliases.users_Queue_alias
        });

        this.User.belongsTo(this.UserCity, {
            foreignKey: ForeignSourceAndOtherKeys.users_UserCity_foreignKey,
            onDelete: OccursActions.cascade,
            onUpdate: OccursActions.cascade,
            as: Aliases.users_UserCity_alias
        })

        this.User.belongsTo(this.Messenger, {
            foreignKey: ForeignSourceAndOtherKeys.users_Messenger_foreignKey,
            onDelete: OccursActions.cascade,
            onUpdate: OccursActions.cascade,
            as: Aliases.users_Messenger_alias
        })

        this.User.hasMany(this.Group, {
            foreignKey: ForeignSourceAndOtherKeys.users_Group_foreignKey,
            sourceKey: ForeignSourceAndOtherKeys.users_Group_sourceKey,
            as: Aliases.users_Group_alias
        })

        this.User.belongsTo(this.TimeBeforeNotification, {
            foreignKey: ForeignSourceAndOtherKeys.users_TimeBeforeNotification_foreignKey,
            as: Aliases.users_TimeBeforeNotification_alias
        })
        //================================================== USER ======================================================
        //================================================== Queue =====================================================
        this.Queue.belongsToMany(this.User, {
            through: this.UserQueue,
            foreignKey: ForeignSourceAndOtherKeys.queues_User_foreignKey,
            otherKey: ForeignSourceAndOtherKeys.queues_User_otherKey,
            as: Aliases.queues_User_alias
        });

        this.Queue.belongsToMany(this.Group, {
            through: this.GroupQueue,
            foreignKey: ForeignSourceAndOtherKeys.queues_Group_foreignKey,
            otherKey: ForeignSourceAndOtherKeys.queues_Group_otherKey,
            as: Aliases.queues_Group_alias
        })

        this.Queue.belongsTo(this.UserCity, {
            foreignKey: ForeignSourceAndOtherKeys.queues_UserCity_foreignKey,
            onDelete: OccursActions.cascade,
            onUpdate: OccursActions.cascade,
            as: Aliases.queues_UserCity_alias
        })
        //================================================== Queue =====================================================
        //================================================== Group =====================================================
        this.Group.belongsToMany(this.Queue, {
            through: this.GroupQueue,
            foreignKey: ForeignSourceAndOtherKeys.groups_Queue_foreignKey,
            otherKey: ForeignSourceAndOtherKeys.groups_Queue_otherKey,
            as: Aliases.groups_Queue_alias,
        });

        this.Group.belongsTo(this.User, {
            foreignKey: ForeignSourceAndOtherKeys.groups_User_foreignKey,
            onDelete: OccursActions.cascade,
            onUpdate: OccursActions.cascade,
            as: Aliases.groups_User_alias,
        })

        this.Group.belongsTo(this.TimeBeforeNotification, {
            foreignKey: ForeignSourceAndOtherKeys.groups_TimeBeforeNotification_foreignKey,
            as: Aliases.groups_TimeBeforeNotification_alias,
        })
        //================================================== Group =====================================================
        //=========================================== TimeBeforeNotification ===========================================
        this.TimeBeforeNotification.hasMany(this.User, {
            foreignKey: ForeignSourceAndOtherKeys.time_before_notification_User_foreignKey,
            as: Aliases.time_before_notification_User_alias,
        })

        this.TimeBeforeNotification.hasMany(this.Group, {
            foreignKey: ForeignSourceAndOtherKeys.time_before_notification_Group_foreignKey,
            as: Aliases.time_before_notification_Group_alias,
        })
        //=========================================== TimeBeforeNotification ===========================================
    }

    /**
     *
     * @returns {import("sequelize").ModelStatic<import("sequelize").Model>}
      * @constructor
     */
    get User() {
        return this._users;
    }

    /**
     *
     * @returns {import("sequelize").ModelStatic<import("sequelize").Model>}
     * @constructor
     */
    get Group() {
        return this._groups;
    }

    /**
     *
     * @returns {import("sequelize").ModelStatic<import("sequelize").Model>}
     * @constructor
     */
    get GroupQueue() {
        return this._groupQueues;
    }

    /**
     *
     * @returns {import("sequelize").ModelStatic<import("sequelize").Model>}
     * @constructor
     */
    get Queue() {
        return this._queue;
    }

    /**
     *
     * @returns {import("sequelize").ModelStatic<import("sequelize").Model>}
     * @constructor
     */
    get UserQueue() {
        return this._userQueues;
    }

    /**
     *
     * @returns {import("sequelize").ModelStatic<import("sequelize").Model>}
     * @constructor
     */
    get UserCity() {
        return this._userCity;
    }

    /**
     *
     * @returns {import("sequelize").ModelStatic<import("sequelize").Model>}
     * @constructor
     */
    get Messenger() {
        return this._messenger;
    }

    /**
     *
     * @returns {import("sequelize").ModelStatic<import("sequelize").Model>}
     * @constructor
     */
    get TimeBeforeNotification() {
        return this._timeBeforeNotification;
    }
}

export default EntitiesClass