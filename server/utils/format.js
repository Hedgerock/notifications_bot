/**
 *
 * @param {string} string
 * @param {string | number} args
 * @returns {string}
 */
export function format(string, ...args) {
    let i = 0;

    return string.replace(/%s|%d/g, () => args[i++]);
}