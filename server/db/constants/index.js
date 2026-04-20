export const MAX_GROUPS_PER_USER = 12;

export const Aliases = Object.freeze({
    users_UserCity_alias: "city",
    users_Group_alias: "groups",
    users_Messenger_alias: "messenger",
    users_TimeBeforeNotification_alias: "time",
    users_Queue_alias: "queues",

    queues_User_alias: "users",
    queues_Group_alias: "queueGroups",
    queues_UserCity_alias: "city",

    groups_EagerQueue_alias: "currentGroupQueues",
    groups_Queue_alias: "groupQueues",
    groups_User_alias: "user",
    groups_TimeBeforeNotification_alias: "time",

    time_before_notification_User_alias: "users",
    time_before_notification_Group_alias: "groups",
})

export const OccursActions = Object.freeze({
    cascade: "CASCADE",
    set_null: "SET NULL",
})

export const ForeignSourceAndOtherKeys = Object.freeze({
    users_Queue_foreignKey: "user_id",
    users_Queue_otherKey: "queue_id",
    users_UserCity_foreignKey: "city_id",
    users_Messenger_foreignKey: "messenger_id",
    users_Group_foreignKey: "user_id",
    users_Group_sourceKey: "social_media_id",
    users_TimeBeforeNotification_foreignKey: "time_until_notification_id",

    queues_User_foreignKey: "queue_id",
    queues_User_otherKey: "user_id",
    queues_Group_foreignKey: "queue_id",
    queues_Group_otherKey: "group_id",
    queues_UserCity_foreignKey: "city_id",

    groups_Queue_foreignKey: "group_id",
    groups_Queue_otherKey: "queue_id",
    groups_Queue_sourceKey: "group_id",
    groups_User_foreignKey: "user_id",
    groups_TimeBeforeNotification_foreignKey: "time_until_notification_id",

    time_before_notification_User_foreignKey: "time_until_notification_id",
    time_before_notification_Group_foreignKey: "time_until_notification_id",
})