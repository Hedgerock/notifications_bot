import {
    CASE_NOOP_STATUS_OPTION,
    TEMPLATE_OF_BACK_PREVIOUS_POSITION,
    TEMPLATE_OF_CASE_REMOVER_ALL_STATUS_OPTION,
    TEMPLATE_OF_CASE_SELECT_ALL_STATUS_OPTION,
    TEMPLATE_OF_CASE_SUCCESS_STATUS_RESPONSE_OPTION,
    UTILITY_EMPTY_VALUE,
    UTILITY_WITH_BACK_BUTTON,
    UTILITY_WITHOUT_BACK_BUTTON
} from "../../../../../dictionary/index.js";
import {format} from "../../../../format.js";
import {setupBackButtonContent} from "../setupBackButtonContent.js";

/**
 *
 * @param {string} currentId
 * @param {QueueInstance[]} rawQueues
 * @param {UserSelection} userSelection
 * @param {KeyboardOptions} options
 * @returns {QueueKeyboardTextContent}
 */
export function getQueueTextContent(currentId, rawQueues, userSelection, options) {
    const isAllSelected = rawQueues.every(q => userSelection[q.code])
    const isSomeSelected = rawQueues.some(q => userSelection[q.code]);
    const {hasBackButton, navigationKey} = options

    const readyStatusText = isSomeSelected ? 'Готово' : 'Не готово';
    const readyCallBackData = isSomeSelected
        ? format(TEMPLATE_OF_CASE_SUCCESS_STATUS_RESPONSE_OPTION, currentId, navigationKey)
        : CASE_NOOP_STATUS_OPTION;

    const hasBackButtonContent = hasBackButton
        ? UTILITY_WITH_BACK_BUTTON
        : UTILITY_WITHOUT_BACK_BUTTON;

    const selectedAllCase = !isAllSelected ? 'Выбрать все' : UTILITY_EMPTY_VALUE;
    const selectedAllCallbackData = !isAllSelected
        ? format(TEMPLATE_OF_CASE_SELECT_ALL_STATUS_OPTION, currentId, navigationKey, hasBackButtonContent)
        : CASE_NOOP_STATUS_OPTION

    const removeAllCase = isSomeSelected ? "Убрать все" : UTILITY_EMPTY_VALUE;
    const removeAllCallbackData = isSomeSelected
        ? format(TEMPLATE_OF_CASE_REMOVER_ALL_STATUS_OPTION, currentId, navigationKey, hasBackButtonContent)
        : CASE_NOOP_STATUS_OPTION

    const {backButtonText, actualBackButtonCallbackData} =
        setupBackButtonContent(currentId, options);

    return {
        readyStatusText,
        readyCallBackData,
        selectedAllCallbackData,
        selectedAllCase,
        removeAllCase,
        removeAllCallbackData,
        backButtonText,
        actualBackButtonCallbackData
    }
}