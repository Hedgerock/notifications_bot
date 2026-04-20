import {Sequelize} from "sequelize";

let sequelize;

export const SEQUELIZE = () => {

    if (!sequelize) {
        sequelize = new Sequelize(
            process.env.PG_DATABASE,
            process.env.PG_USER,
            process.env.PG_PASSWORD,
            {
                host: process.env.PG_HOST,
                dialect: "postgres"
            }
        )
    }

    return sequelize
}

export const CLOSE_DB = async () => {
    if (sequelize) {
        try {
            await sequelize.connectionManager.close();
        } catch (e) {
            console.log("connectionManager close failed", e);
        }

        try {
            await sequelize.close();
        } catch (e) {
            console.log("sequelize close failed", e);
        }

        sequelize = null;
    }
};