import express from "express";
import path from "path";
import {checkUpdates} from "./utils/index.js";
import {IntervalTimeConstants} from "./constants/index.js";
import {
    botOnGroupDeleteFunction,
    botOnGroupInitFunction,
    botOnGroupOptionsFunction,
    botOnStartFunction,
    botOnStatusFunction,
    botOnSubscriptionFunction,
    botOnTomorrowStatusFunction,
    botOnUpdateFunction
} from "./utils/telegramBotUtils/commands/index.js";
import {botCallBackQueryFunction} from "./utils/telegramBotUtils/callbacks/index.js";
import {withUserCheck} from "./middleware/index.js";
import {scheduleNotificationsWorker, sessionCleanerWorker} from "./workers/index.js";
import {startNotificationWorker} from "./queues/notifications.js";
import {appRouter} from "./routes/appRoutes.js";
import {getHtmlService, getQueue, getScrapper} from "./service/index.js";
import {AppCoreConstants} from "./constants/AppCoreConstantsClass.js";

export async function startServer() {
    const server = express();

    if (process.env.NODE_ENV !== "test") {
        /**
         * @implements Startable
         */
        const services = [AppCoreConstants, getQueue(), getScrapper(), getHtmlService()]

        for (const service of services) {
            await service.init();
            await new Promise(res => setTimeout(res, IntervalTimeConstants.TIME_BETWEEN_SERVICE_INIT_IN_MILLIS));
        }
    }

    server.use(express.static(path.join(AppCoreConstants.ROOT_DIR, "public")))
    server.use(express.json());

    setInterval(checkUpdates, IntervalTimeConstants.SCRAPPER_INTERVAL_TIMEOUT_IN_MILLIS);
    setInterval(sessionCleanerWorker, IntervalTimeConstants.SESSION_CLEANER_TIME_IN_MILLIS);
    setInterval(scheduleNotificationsWorker, IntervalTimeConstants.SCHEDULE_NOTIFICATION_TIME_IN_MILLIS);
    startNotificationWorker();

    server.use("", appRouter);

    server.listen(AppCoreConstants.SERVER_PORT_VALUE, async() => {
        console.log(`Server running at ${process.env.PROTOCOL || "http"}://${process.env.DOMAIN}:${AppCoreConstants.SERVER_PORT_VALUE}`);

        AppCoreConstants.TELEGRAM_BOT.onText(/\/start/, botOnStartFunction);
        AppCoreConstants.TELEGRAM_BOT.onText(/\/status/, withUserCheck(async (msg) => {
            await botOnStatusFunction(msg);
        }));
        AppCoreConstants.TELEGRAM_BOT.onText(/\/tomorrow/, withUserCheck(async (msg) => {
            await botOnTomorrowStatusFunction(msg);
        }))
        AppCoreConstants.TELEGRAM_BOT.onText(/\/update/, withUserCheck(async(msg) => {
            await botOnUpdateFunction(msg);
        }));
        AppCoreConstants.TELEGRAM_BOT.onText(/\/subscription/, withUserCheck(async(msg) => {
            await botOnSubscriptionFunction(msg);
        }));
        AppCoreConstants.TELEGRAM_BOT.onText(/\/group_init/, withUserCheck(async(msg) => {
            await botOnGroupInitFunction(msg);
        }));
        AppCoreConstants.TELEGRAM_BOT.onText(/\/group_delete/, withUserCheck(async(msg) => {
            await botOnGroupDeleteFunction(msg);
        }));
        AppCoreConstants.TELEGRAM_BOT.onText(/\/groups/, withUserCheck(async (msg) => {
            await botOnGroupOptionsFunction(msg);
        }));
        AppCoreConstants.TELEGRAM_BOT.on("callback_query", botCallBackQueryFunction);
    });
}

startServer();