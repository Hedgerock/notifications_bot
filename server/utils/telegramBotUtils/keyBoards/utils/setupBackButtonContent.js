import {
    CASE_NOOP_STATUS_OPTION,
    TEMPLATE_OF_BACK_PREVIOUS_POSITION,
    UTILITY_EMPTY_VALUE
} from "../../../../dictionary/index.js";
import {format} from "../../../format.js";

/**
 *
 * @param {string} currentId
 * @param {KeyboardOptions} options
 * @returns {{backButtonText: string, actualBackButtonCallbackData: string}}
 */
export function setupBackButtonContent(currentId, options) {
    const {navigationKey, hasBackButton} = options

    const backButtonText = hasBackButton ? "Назад" : UTILITY_EMPTY_VALUE;

    const backButtonCallbackData =  format(
        TEMPLATE_OF_BACK_PREVIOUS_POSITION,
        navigationKey
    ) + `_${currentId}`

    const actualBackButtonCallbackData = hasBackButton
        ? backButtonCallbackData
        : CASE_NOOP_STATUS_OPTION

    return { backButtonText, actualBackButtonCallbackData }
}