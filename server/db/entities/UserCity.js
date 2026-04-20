import {Schemas} from "../schemas/index.js";
import {DataTypes} from "sequelize";

export const defineUserCityEntity = (orm) => {
    const UserCity = orm.define("UserCity", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        city_name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    }, {
        schema: Schemas.LOCATIONS_SCHEMA,
        tableName: "users_cities",
        timestamps: false
    })

    return UserCity
}