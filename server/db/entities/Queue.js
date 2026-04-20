import {DataTypes, Model} from "sequelize";
import {Schemas} from "../schemas/index.js";
import {AppCoreConstants} from "../../constants/AppCoreConstantsClass.js";

/**
 * @extends {Model<QueueInstance>}
 */
export const defineQueueEntity = (orm) => {
    const Queue = AppCoreConstants.ORM.define("Queue", {
        code: {
            type: DataTypes.STRING(10),
            unique: true,
            allowNull: false
        },
        description: DataTypes.TEXT,
        city_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 5
            }
        }
    }, {
        schema: Schemas.LOCATIONS_SCHEMA,
        tableName: "queues",
        timestamps: false
    })

    return Queue;
}