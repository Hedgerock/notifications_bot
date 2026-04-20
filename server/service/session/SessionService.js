import {RedisParent} from "../parent/RedisParent.js";
import {format} from "../../utils/index.js";
import {defaultSessionSetup} from "../../constants/index.js";

class SessionService extends RedisParent {

    /**
     *
     * @param { string } userId
     * @param { TelegramMessage | TelegramCallbackQuery } message
     * @returns {Promise<Session>}
     */
    async updateSession(userId, message) {
        const key = this.getSessionKey(userId);

        const session = JSON.parse(await this._getRedisValue(key)) || {...defaultSessionSetup}

        session.lastMessage = message;
        session.identifiers = {
            chatId: message.chat.id,
            messageId: message.message_id
        };
        session.lastActivity = Date.now();

        await this._setRedisValueWithoutTTl(key, session);
        return session;
    }

    /**
     *
     * @param {string|number} content
     * @returns {string}
     */
    getSessionKey(content) {
        return format(this._session_service_session_key, content);
    }

    /**
     *
     * @param {string} userId
     * @returns {Promise<Session>}
     */
    async getSession(userId) {
        const key = format(this._session_service_session_key, userId);
        return JSON.parse(await this._getRedisValue(key));
    }

    /**
     *
     * @param {string} userId
     * @returns {Promise<void>}
     */
    async endSession(userId) {
        const key = this.getSessionKey(userId);
        const session = await this._isRedisKeyExists(key);

        if (!session) return;

        await this._deleteRedisKey(key);
    }
}

export const sessionService = new SessionService();