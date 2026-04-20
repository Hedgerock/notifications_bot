/**
 *
 * @param {string []} rows
 * @returns {{ [key:string]:[] }
 */
export function prepareObjectToUse(rows) {
    const result = {};
    rows.forEach(value => result[value] = [])

    return result;
}
