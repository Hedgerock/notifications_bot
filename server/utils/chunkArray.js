/**
 * @template T
 * @param {T[]} arr
 * @param {number} size
 * @returns {T[][]}
 */
export function chunkArray(arr, size) {
    const result = [];

    for (let i = 0; i < arr.length; i+=size) {
        result.push(arr.slice(i, i + size));
    }

    return result;
}