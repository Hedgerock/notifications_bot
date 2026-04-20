/**
 *
 * @type {Session}
 */
export const defaultSessionSetup = {
    createdAt: Date.now(),
    lastMessage: null,
    identifiers: {
        messageId: -1,
        chatId: ""
    }
};

export const NotificationConstants = Object.freeze({
    MAX_VALUE_OF_TIME_NOTIFICATION_IN_MINUTES: 120,
    MAX_SCHEDULE_ATTEMPTS: 5,
    USER_BATCH_SIZE: 100,
})

export const IntervalTimeConstants = Object.freeze({
    SCRAPPER_INTERVAL_TIMEOUT_IN_MILLIS: 300_000,
    NOTIFICATION_PAUSE_TIME_IN_MILLIS: 900_000,
    SESSION_CLEANER_TIME_IN_MILLIS: 25_000,
    SCHEDULE_NOTIFICATION_TIME_IN_MILLIS: 60_000,
    TIME_BEFORE_SHUTDOWN_IN_MILLIS: 2000,
    TIME_BEFORE_TURN_UP_IN_MILLIS: 5000,
    TIME_BETWEEN_SERVICE_INIT_IN_MILLIS: 0,
    TTL_SESSION_IN_MILLIS: 600_000,
})

export const colors = Object.freeze({
    "green": "#0cc951",
    "yellow": "#bbbf00",
    "light-red": "#f96363",
    "red": "#ff3c3c"
})

export const emojis = Object.freeze({
    "green-circle": `🟢`,
    "orange-circle": `🟠`,
    "red-circle": "🔴",
    "selected": "✅",
    "unselected": "☐",
    "light-icon": "💡",
    "time": "⌛️",
})

export const clients = [];

export const DAYS = Object.freeze({
        0: "Вс",
        1: "Пн",
        2: "Вт",
        3: "Ср",
        4: "Чт",
        5: "Пт",
        6: "Сб",
    }
)

export const LightStatus = Object.freeze({
    ENABLE: {
        selector: process.env.STATUS_ENABLE,
        emoji: emojis["green-circle"],
        color: colors.green
    },
    PROBABLY: {
        selector: process.env.STATUS_PROBABLY,
        emoji: emojis["orange-circle"],
        color: colors.yellow,
    },
    OFF: {
        selector: process.env.STATUS_OFF,
        emoji: emojis["red-circle"],
        color: colors["light-red"],
    },
    SURE_OFF: {
        selector: process.env.STATUS_SURE_OFF,
        emoji: emojis["red-circle"],
        color: colors.red
    }
})

export const UserRoles = Object.freeze({
    ADMIN: "admin",
    USER: "user"
})

export const JwtExpirationTimes = Object.freeze({
    "30_MINUTES": "30m",
    "1_HOUR": "1h",
    "2_HOURS": "2h",
})

export const ResHeaders = {
    AUTHORIZATION: "authorization",
}

export const ResponseStatus = Object.freeze({
    OK: 200,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
})

export const ScrapperWebsiteConstants = Object.freeze({
    WEBSITE_URL: process.env.WEBSITE_URL,
    SELECTOR_FOR_WAIT: process.env.SELECTOR_FOR_WAIT,
    SELECTOR_TO_WORK: process.env.SELECTOR_TO_WORK,
    BUTTON_FOR_TOMORROW_SCHEDULE: process.env.BUTTON_FOR_TOMORROW_SCHEDULE
})

export const sourceMessage =
    `Информация взята с официального сайта <a href="${ScrapperWebsiteConstants.WEBSITE_URL}">Николаевоблэнерго</a>`
