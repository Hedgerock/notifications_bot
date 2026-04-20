//Telegram
/**
 * @typedef {Object} TelegramMessage
 * @property {number} message_id
 * @property {Object} from
 * @property {string} from.id
 * @property {boolean} from.is_bot
 * @property {string} from.first_name
 * @property {string} [from.last_name]
 * @property {string} [from.username]
 * @property {Object} chat
 * @property {string} chat.id
 * @property {string} chat.type
 * @property {string} [chat.title]
 * @property {string} [chat.username]
 * @property {string} [text]
 * @property {Object} [entities]
 * @property {number} date
 */

/**
 * @typedef {Object} TelegramCallbackQuery
 * @property {string} id
 * @property {Object} from
 * @property {string} from.id
 * @property {boolean} from.is_bot
 * @property {string} from.first_name
 * @property {string} [from.last_name]
 * @property {string} [from.username]
 * @property {Object} [message]
 * @property {number} [message.message_id]
 * @property {Object} [message.chat]
 * @property {string} data
 * @property {string} [inline_message_id]
 * @property {string} [chat_instance]
 */

//Entities
/**
 * @typedef {Object} QueueInstance
 * @property {string} code
 * @property {string} description
 * @property {number} city_id
 * @property {number} status
 */

/**
 * @typedef {Object} QueueFields
 * @property {string} [code]
 * @property {string} [description]
 * @property {number} [city_id]
 * @property {0 | 1 | 2 | 3 | 4} [status]
 */

/**
 * @typedef {Object} UserInstance
 * @property {number} id
 * @property {string} social_media_id
 * @property {string} [username]
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {number} messenger_id
 * @property {number} city_id
 * @property {string} [language_code]
 * @property {boolean} [is_bot]
 * @property {boolean} [is_subscriber]
 * @property {boolean} [is_muted]
 * @property {Date} created_at
 * @property {Date} updated_at
 * @property {number} time_until_notification_id
 * @property {GroupInstance[]} [groups]
 * @property {QueueInstance[]} [queues]
 * @property {TimeBeforeNotifcationInstance} [time]
 *
 * Connections
 * @property {(queues: QueueInstance[]|QueueInstance) => Promise<void>} addQueues
 * @property {() => Promise<QueueInstance[]>} getQueues
 * @property {() => Promise<GroupInstance[]>} getGroups
 * @property {(queues: QueueInstance[]|QueueInstance) => Promise<void>} setQueues
 * @property {(queues: QueueInstance[]|QueueInstance) => Promise<void>} removeQueues
 * @property {() => Promise<TimeBeforeNotifcationInstance>} getTime
 * @property {() => any} toJSON
 */

/**
 * @typedef {Object} UserFields
 * @property {number} [social_media_id]
 * @property {string} [username]
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {number} [messenger_id]
 * @property {number} [city_id]
 * @property {string} [language_code]
 * @property {boolean} [is_bot]
 * @property {boolean} [is_subscriber]
 * @property {boolean} [is_muted]
 * @property {number} [time_until_notification_id]
 */

/**
 * @typedef {Object} GroupInstance
 * @property {string} group_id
 * @property {string} group_name
 * @property {boolean} is_subscriber
 * @property {boolean} is_muted
 * @property {number} time_until_notification_id
 * @property {string} user_id
 * @property {(queues: QueueInstance[]|QueueInstance) => Promise<void>} addGroupQueues
 * @property {() => Promise<QueueInstance[]>} getGroupQueues
 * @property {QueueInstance[]} groupQueues
 * @property {TimeBeforeNotifcationInstance} time
 * @property {(queues: QueueInstance[]|QueueInstance) => Promise<void>} setGroupQueues
 * @property {(queues: QueueInstance[]|QueueInstance) => Promise<void>} removeGroupQueues
 * @property {() => Promise<TimeBeforeNotifcationInstance>} getTime
 * @property {() => any} toJSON
 */

/**
 * @typedef {Object} GroupFields
 * @property {string} [group_id]
 * @property {string} [group_name]
 * @property {string} [user_id]
 * @property {boolean} [is_subscriber]
 * @property {boolean} [is_muted]
 * @property {number} [time_until_notification_id]
 */

/**
 * @typedef {Object} GroupRelations
 * @property {string} group_id
 * @property {string} group_name
 * @property {string} user_id
 * @property {(queues: QueueInstance[]|QueueInstance) => Promise<void>} addGroupQueues
 * @property {() => Promise<QueueInstance[]>} getGroupQueues
 * @property {(queues: QueueInstance[]|QueueInstance) => Promise<void>} setGroupQueues
 * @property {(queues: QueueInstance[]|QueueInstance) => Promise<void>} removeGroupQueues
 * @property {() => any} toJSON
 */

/**
 * @typedef {Object} TimeBeforeNotifcationInstance
 * @property {number} id
 * @property {number} time_value_minutes
 * @property {() => any} toJSON
 */

//Session
/**
 * @typedef {Object} Session
 * @property {TelegramMessage | TelegramCallbackQuery | null} [lastMessage]
 * @property {number} createdAt
 * @property {Object} identifiers
 * @property {number} [identifiers.messageId]
 * @property {string} [identifiers.chatId]
 */


//Rows
/**
 * @typedef {Object} ValueCell
 * @property {string} content
 * @property {string} className
 */

/**
 * @typedef {Object} RawRow
 * @property {string|null} time
 * @property {ValueCell[]} values
 */

/**
 * @typedef {Object} Rows
 * @property {string|null} time
 * @property {ValueCell[]} values
 * @property {boolean} isCurrent
 */

//Keyboard
/**
 * @typedef {Object} UserSelection
 * @property {boolean} [key]
 */

/**
 * @typedef {Object} KeyboardOptions
 * @property {string} navigationKey
 * @property {boolean} hasBackButton
 * @property {boolean} fromSelection
 */

/**
 * @typedef {Object} QueueKeyboardTextContent
 * @property {string} readyStatusText
 * @property {string} readyCallBackData
 * @property {string} selectedAllCallbackData
 * @property {string} selectedAllCase
 * @property {string} removeAllCase
 * @property {string} removeAllCallbackData
 * @property {string} backButtonText
 * @property {string} actualBackButtonCallbackData
 */

/**
 * @typedef {Object} SubscriptionKeyboardContent
 * @property {string} subscribedText
 * @property {string} subscribedCallBackData
 * @property {string} unsubscribedText
 * @property {string} unsubscribedCallBackData
 * @property {string} backButtonText
 * @property {string} actualBackButtonCallbackData
 * @property {string} subscriptionDecisionCallbackData
 * @property {number} timeId
 * @property {string} mutedText
 * @property {string} mutedCallBackData
 * @property {string} unmutedText
 * @property {string} unmutedCallBackData
 */


/**
 * @typedef {'info' | 'notification'} MessageType
 */

/**
 * @template T
 * @typedef {new (...args: any[]) => T} Constructor
 */


/**
 * @template T
 * @typedef {Object} NotificationFields
 * @property {'appState' | 'activeQueues'} notificationsAbout
 * @property {T} currentFields
 */

/**
 * @typedef {Object} QueueNotificationFields
 * @property {string} user_id
 * @property {string} [group_id]
 * @property {'user' | 'group'} notification_for
 * @property {number} time_before_notify
 * @property {{code: string, content: {time: string, value: string[]}}[]} queues_data
 * @property {string} redis_key
 * @property {string} queue_codes
 */

/**
 * @typedef {Object} AppStatusNotificationFields
 * @property {string} user_id
 * @property {string} message
 */

/**
 * @typedef {Object} AuthFields
 * @property {string} username
 * @property {string} password
 */

/**
 * @typedef {Object} JwtTokenFields
 * @property {string} role
 */

/**
 * @typedef {Object} JwtPropertyFields
 * @property {string} expiresIn
 */

/**
 * @typedef {import("express").Request} ExpressRequest
 */

/**
 * @typedef {import("express").Response} ExpressResponse
 */

/**
 * @interface Startable
 * @property {() => Promise<void>} init
 */

/**
 * @typedef {Object} QueueContent
 * @property {{[p: string]: number[][]}} startIndex
 * @property {string[]} actualQueuesKeys
 * @property {Rows[]} actualSelectedRows
 */

/**
 * @typedef {Object} GeneratedQueueContent
 * @property {string} response
 * @property {{[p:string]: {time: string, value: string[]}[]}} times
 * @property {{[p: string]: number[][]}} startIndex
 */

/**
 * @typedef {Object} SpecificQeueuesOptions
 * @property {boolean} isTomorrowContent
 * @property {MessageType} messageType
 * @property {boolean} isResponseRequired
 */

/**
 * @typedef {Object} NotificationParams
 * @property {'user' | 'group'} notificationFor
 * @property {string} userId
 * @property {string} [groupId]
 * @property {QueueInstance[]} queues
 * @property {number} timeBeforeNotify
 */