import {DataTypes} from "sequelize";
import {Schemas} from "../schemas/index.js";

export const defineGroupQueue = (orm) => {
    const Queue = orm.define("GroupQueue", {
        selected_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

    }, {
        schema: Schemas.LOCATIONS_SCHEMA,
        tableName: "group_queues",
        timestamps: false,
        indexes: [
            { fields: ["group_id"] },
            { fields: ["queue_id"] }
        ]
    });

    return Queue;
}