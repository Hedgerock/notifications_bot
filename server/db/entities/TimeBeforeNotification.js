import {Schemas} from "../schemas/index.js";
import {DataTypes} from "sequelize";
import {AppCoreConstants} from "../../constants/AppCoreConstantsClass.js";

export const defineTimeBeforeNotificationEntity = () => {
   const TimeBeforeNotification = AppCoreConstants.ORM.define("TimeBeforeNotification", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        time_value_minutes: {
            type: DataTypes.SMALLINT,
            allowNull: false
        }
    }, {
        schema: Schemas.TIME_SCHEMA,
        tableName: "time_before_notification",
        timestamps: false
    })

   return TimeBeforeNotification;
}