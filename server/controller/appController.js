import {
    clients,
    IntervalTimeConstants,
    JwtExpirationTimes,
    ResponseStatus,
    UserRoles
} from "../constants/index.js";
import jwt from "jsonwebtoken";
import {sessionCleanerWorker} from "../workers/index.js";
import {getHtmlService} from "../service/index.js";
import {initFinalHtml} from "../utils/htmlUtils/index.js";
import {appStatusNotificationWorker} from "../workers/appStatusNotificationWorker.js";
import {AppCoreConstants} from "../constants/AppCoreConstantsClass.js";

/**
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @returns {ExpressResponse}
 */
export function login(req, res) {
    const {username, password} = /** @type {AuthFields} */ req.body;

    const isAdmin =
        username === AppCoreConstants.ADMIN_USER &&
        password === AppCoreConstants.ADMIN_PASSWORD;

    if (isAdmin) {
        /**
         * @type {JwtTokenFields}
         */
        const jwtContent = {
            role: UserRoles.ADMIN
        }

        /**
         *
         * @type {JwtPropertyFields}
         */
        const jwtProperties = {
            expiresIn: JwtExpirationTimes["1_HOUR"]
        }

        const token = jwt.sign(jwtContent, AppCoreConstants.JWT_SECRET, jwtProperties)

        return res.json({ token })
    }

    res.status(ResponseStatus.UNAUTHORIZED).json({ message: "Неверный логин или пароль" })
}

/**
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @returns {Promise<ExpressResponse>}
 */
export async function shutdown(req, res) {
    try {
        await sessionCleanerWorker({
            isShutdownOption: true
        })
        await appStatusNotificationWorker("off")

        await AppCoreConstants.NOTIFICATIONS.whenCurrentJobsFinished();
        await AppCoreConstants.REDIS.quit();
        await AppCoreConstants.NOTIFICATIONS.close();

        res.json({
            message: "Произошла инициализация отключения системы. Все активные сессии инвалидированы"
        })
    } catch (e) {
        res.status(ResponseStatus.INTERNAL_ERROR).json({
            message: "Произошла ошибка при остановки сервера",
            error: e.message
        })
    }
}

/**
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @returns {Promise<ExpressResponse>}
 */
export async function turnUp(req, res) {
    setTimeout(() => {

    }, IntervalTimeConstants.TIME_BEFORE_TURN_UP_IN_MILLIS)

    try {
        await appStatusNotificationWorker("on");
        res.json({
            message: "Произошел процесс включения сервера"
        })
    } catch (e) {
        res.status(ResponseStatus.INTERNAL_ERROR).json({
            message: "Произошла ошибка при запуске сервера",
            error: e.message
        })
    }
}

/**
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @returns {Promise<ExpressResponse>}
 */
export async function mainRootFunction(req, res) {
    try {
        const htmlService = getHtmlService();
        const tableHtml = await htmlService.getHtmlContent();
        res.send(initFinalHtml(tableHtml));
    } catch (e) {
        console.error(e);
        res.status(ResponseStatus.INTERNAL_ERROR).send("Ошибка при получении данных")
    }
}

/**
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @returns {ExpressResponse}
 */
export function eventsRootFunction(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    clients.push(res);
    req.on("close", () => {
        const idx = clients.indexOf(res);

        if (idx !== -1) {
            clients.splice(idx, 1);
        }
    })
}