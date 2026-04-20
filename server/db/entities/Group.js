import {Schemas} from "../schemas/index.js";
import {DataTypes} from "sequelize";
import {MAX_GROUPS_PER_USER} from "../constants/index.js";

export const defineGroupEntity = (orm) => {
    const Group = orm.define("Group", {
        group_id: {
            type: DataTypes.BIGINT,
            unique: true,
            allowNull: false,
        },
        group_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        is_subscriber: {
            type: DataTypes.BOOLEAN,
            default: true
        },
        is_muted: {
            type: DataTypes.BOOLEAN,
            default: false,
        },
        time_until_notification_id: {
            type: DataTypes.SMALLINT,
            allowNull: false
        }
    }, {
        schema: Schemas.MESSENGER_SCHEMA,
        tableName: "groups",
        timestamps: false,
        indexes: [
            { fields: ["user_id"] }
        ]
    })

    Group.addHook("beforeCreate", async(group) => {
        const totalGroups = await Group.count({
            where: {
                user_id: group.user_id
            }
        })

        if (totalGroups >= MAX_GROUPS_PER_USER) {
            throw new Error("Превышен лимит групп на пользователя")
        }
    })

    Group.addHook("beforeUpdate", async (group) => {
        const candidateUser = await UserInstance.findOne({
            where: { social_media_id: group.user_id }
        });

        if (!candidateUser) {
            throw new Error(`User with social_media_id ${group.user_id} not found`);
        }
    });

    return Group;
}
