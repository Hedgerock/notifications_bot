/**
 *
 * @returns {{now: Date, cutoff: Date}}
 */
export function getTime() {
    const now = new Date();
    const cutoff = new Date(now.getTime() + 30 * 60 * 1000);

    return { now, cutoff }
}