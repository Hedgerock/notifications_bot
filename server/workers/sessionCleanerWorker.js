import {sessionService} from "../service/index.js";
import {IntervalTimeConstants} from "../constants/index.js";
import {AppCoreConstants} from "../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {{ isShutdownOption: boolean }} options
 * @returns {Promise<void>}
 */
export async function sessionCleanerWorker(options = {isShutdownOption: false}) {
    const sessionKey = sessionService.getSessionKey("*");
    const {isShutdownOption} = options

    const sessions = AppCoreConstants.REDIS.scanIterator({
        MATCH: sessionKey
    })

    for await (const keys of sessions) {
        for (const key of keys) {
            const raw = await AppCoreConstants.REDIS.get(key);
            if (!raw) {
                continue;
            }

            const currentSession = JSON.parse(raw);
            const expired = isShutdownOption
                ? isShutdownOption
                : Date.now() - currentSession.lastActivity > IntervalTimeConstants.TTL_SESSION_IN_MILLIS;

            if (expired) {
                try {
                    const {chatId, messageId} = currentSession.identifiers;
                    await AppCoreConstants.TELEGRAM_BOT.deleteMessage(chatId, messageId);
                } catch (e) {
                    console.error("Произошла ошибка при удалении сообщения", e.message);
                }

                await AppCoreConstants.REDIS.del(key);
            }
        }
    }
}