import {DataTypes} from "sequelize";
import {Schemas} from "../schemas/index.js";
import {AppCoreConstants} from "../../constants/AppCoreConstantsClass.js";

export const defineMessengerEntity = (orm) => {
    const Messenger = orm.define("Messenger", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        messenger_name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    }, {
        schema: Schemas.MESSENGER_SCHEMA,
        tableName: "messengers",
        timestamps: false,
    })

    return Messenger;
}
