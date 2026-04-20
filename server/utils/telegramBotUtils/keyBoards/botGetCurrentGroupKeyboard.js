import {format} from "../../format.js";
import {
    CASE_CLOSE_OPTION,
    CASE_NOOP_STATUS_OPTION,
    NAVIGATION_KEY_GROUP_OPERATIONS,
    NAVIGATION_KEY_GROUPS,
    TEMPLATE_OF_BACK_PREVIOUS_POSITION,
    TEMPLATE_OF_CASE_SEND_GROUP_STATUS_OPTION,
    TEMPLATE_OF_CASE_SPECIFIC_SUBSCRIPTION_OPTION,
    TEMPLATE_OF_SPECIFIC_UPDATE,
    UTILITY_EMPTY_VALUE,
    UTILITY_TODAY_CONTENT,
    UTILITY_TOMORROW_CONTENT
} from "../../../dictionary/index.js";

/**
 *
 * @param {string} groupId
 * @param {string} groupTitle
 * @returns {{reply_markup: {inline_keyboard}}}
 */
export function botGetCurrentGroupKeyboard(groupId, groupTitle) {

    return {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "К группам",
                        callback_data: format(
                            TEMPLATE_OF_BACK_PREVIOUS_POSITION,
                            NAVIGATION_KEY_GROUPS
                        )
                    },
                    { text: UTILITY_EMPTY_VALUE, callback_data: CASE_NOOP_STATUS_OPTION },
                    { text: "Закрыть", callback_data: CASE_CLOSE_OPTION },
                ],
                [
                    {
                        text: "Очереди",
                        callback_data: format(
                            TEMPLATE_OF_SPECIFIC_UPDATE,
                            NAVIGATION_KEY_GROUP_OPERATIONS,
                            groupTitle,
                            groupId
                        )
                    },
                    {
                        text: "Уведомления",
                        callback_data: format(
                            TEMPLATE_OF_CASE_SPECIFIC_SUBSCRIPTION_OPTION,
                            NAVIGATION_KEY_GROUP_OPERATIONS,
                            groupTitle,
                            groupId
                        )
                    },
                ],
                [
                    {
                        text: "Статус",
                        callback_data: format(
                            TEMPLATE_OF_CASE_SEND_GROUP_STATUS_OPTION,
                            groupTitle,
                            groupId,
                            UTILITY_TODAY_CONTENT
                        )
                    },
                    {
                        text: "Статус на завтра",
                        callback_data: format(
                            TEMPLATE_OF_CASE_SEND_GROUP_STATUS_OPTION,
                            groupTitle,
                            groupId,
                            UTILITY_TOMORROW_CONTENT
                        )
                    },
                ]
            ]
        }
    }
}