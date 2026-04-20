import {
    TEMPLATE_OF_CURRENT_QUEUE_SELECTION,
    UTILITY_WITH_BACK_BUTTON,
    UTILITY_WITHOUT_BACK_BUTTON
} from "../../../../../dictionary/index.js";
import {format} from "../../../../format.js";
import {getOptionalTextContent} from "../getOptionalTextContent.js";

/**
 *
 * @param {QueueInstance} option
 * @param {UserSelection} userSelection
 * @param {string} currentId
 * @param {KeyboardOptions} options
 * @returns {{text: string, callback_data: string}}
 */
export function setupCurrentOption(option, userSelection, currentId, options) {
    const {navigationKey, hasBackButton} = options
    const code = option.code;
    const currentText = getOptionalTextContent(userSelection[code], code);
    const currentOptionCallbackData = format(TEMPLATE_OF_CURRENT_QUEUE_SELECTION, code, currentId) +
        `_${hasBackButton ? UTILITY_WITH_BACK_BUTTON : UTILITY_WITHOUT_BACK_BUTTON}` +
        `_${navigationKey}`;

    return {
        text: currentText,
        callback_data: currentOptionCallbackData
    }
}