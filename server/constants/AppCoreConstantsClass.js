import path from "path";
import {BOT, NOTIFY_QUEUE, REDIS_CLIENT, SEQUELIZE} from "../config/index.js";
import {fileURLToPath} from "url";
import EntitiesClass from "./EntitiesClass.js";

/**
 * @implements Startable
 */
class AppConstantsClass {
    constructor(__dirname) {
        this.ROOT_DIR = path.join(__dirname, "../");

        this._redis = null;
        this._orm = null;
        this._bot = null;
        this._notifications = null;
    }

    async init() {
        if (process.env.NODE_ENV === "test") {
            this._redis = {
                get: async () => null,
                set: async () => {}
            };

            this._orm = {
                close: async () => {}
            };

            return this;
        }

        this._redis = await REDIS_CLIENT();
        this._orm = SEQUELIZE();
        this._notifications = NOTIFY_QUEUE();
        this._bot = BOT(true);
        this._ormEntities = new EntitiesClass(this._orm);
        return this;
    }

    get REDIS() {
        return this._redis;
    }

    get ORM() {
        return this._orm;
    }

    /**
     *
     * @returns {EntitiesClass}
     * @constructor
     */
    get ORM_ENTITIES() {
        return this._ormEntities
    }

    get TELEGRAM_BOT() {
        return this._bot;
    }

    /**
     *
     * @returns {import("bull").Queue}
     * @constructor
     */
    get NOTIFICATIONS() {
        return this._notifications;
    }

    /**
     * @type {number}
     * @final
     */
    SERVER_PORT_VALUE = process.env.SERVER_PORT || 3000;
    /**
     * @type {string}
     * @final
     */
    ADMIN_USER = process.env.ADMIN_USER;
    /**
     * @type {string}
     * @final
     */
    ADMIN_PASSWORD = process.env.ADMIN_PASS;
    /**
     *
     * @type {string}
     * @final
     */
    JWT_SECRET = process.env.JWT_SECRET;

}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppCoreConstants = new AppConstantsClass(__dirname);