import {DataTypes, Model} from "sequelize";
import {Schemas} from "../schemas/index.js";

/**
 * @extends Model<User>
 */
export const defineUserEntity = (orm) => {
    const User = orm.define("User", {
        social_media_id: {
            type: DataTypes.BIGINT,
            unique: true,
            allowNull: false
        },
        username: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        language_code: DataTypes.STRING(10),
        messenger_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        city_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_bot: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_subscriber: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
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
        tableName: "users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        indexes: [
            { fields: ["messenger_id"] },
            { fields: ["city_id"] }
        ]
    })

    return User
}

