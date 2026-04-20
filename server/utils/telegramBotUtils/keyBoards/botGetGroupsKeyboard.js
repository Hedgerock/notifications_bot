import {chunkArray} from "../../chunkArray.js";
import {MAX_GROUPS_PER_USER} from "../../../db/constants/index.js";
import {
    UTILITY_EMPTY_VALUE, UTILITY_EMPTY_VALUE_WITH_TEXT,
    CASE_NOOP_STATUS_OPTION,
    TEMPLATE_OF_GROUP_SELECTION, CASE_CLOSE_OPTION
} from "../../../dictionary/index.js";
import {format} from "../../format.js";

const TUPLE_TOTAL_ELEMENTS = 2;

export function botGetGroupsKeyboard(groups) {
    const chunkedGroups = chunkArray(groups, TUPLE_TOTAL_ELEMENTS);
    const emptyContent = {
        group_name: UTILITY_EMPTY_VALUE_WITH_TEXT,
        group_id: null
    };

    const targetIndex = chunkedGroups.length - 1;

    if (chunkedGroups.length && chunkedGroups[targetIndex].length < TUPLE_TOTAL_ELEMENTS) {
        chunkedGroups[targetIndex].push(emptyContent);
    }

    const totalButtons = groups.length;
    const diff = MAX_GROUPS_PER_USER - totalButtons;

    for (let i = 0; i < diff - 1; i += TUPLE_TOTAL_ELEMENTS) {
        chunkedGroups.push([emptyContent, emptyContent]);
    }

    return {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: UTILITY_EMPTY_VALUE, callback_data: CASE_NOOP_STATUS_OPTION },
                    { text: UTILITY_EMPTY_VALUE, callback_data: CASE_NOOP_STATUS_OPTION },
                    { text: "Закрыть", callback_data: CASE_CLOSE_OPTION }
                ],
                ...chunkedGroups.map(pair =>
                    pair.map(el => ({
                        text: el.group_name,
                        callback_data: el.group_id
                            ? format(TEMPLATE_OF_GROUP_SELECTION, el.group_id)
                            : CASE_NOOP_STATUS_OPTION,
                    }))
                )
            ]
        }
    };
}