import {DataTypes} from "sequelize";
import {Schemas} from "../schemas/index.js";
import {AppCoreConstants} from "../../constants/AppCoreConstantsClass.js";

export const defineUserQueue = (orm) => {
    const UserQueue = orm.define("UserQueue", {
        selected_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

    }, {
        schema: Schemas.LOCATIONS_SCHEMA,
        tableName: "user_queues",
        timestamps: false,
        indexes: [
            { fields: ["user_id"] },
            { fields: ["queue_id"] }
        ]
    });

    return UserQueue;
}