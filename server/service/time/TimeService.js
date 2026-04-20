import {RedisParent} from "../parent/RedisParent.js";
import {timeRepository} from "./repository/TimeRepository.js";
import {format} from "../../utils/index.js";

class TimeService extends RedisParent {
    #ttlSeconds = 180_000;

    /**
     *
     * @returns {Promise<TimeBeforeNotifcationInstance[]>}
     */
    async getTimes() {
        const times = await this._getRedisValue(this._time_service_time_times_key);

        if (times) {
            return timeRepository.bulkBuild(JSON.parse(times));
        }

        const currentTimes = await timeRepository.getAllTimes();

        await this._setRedisValue(
            this._time_service_time_times_key,
            currentTimes.map(t => t.toJSON()),
            this.#ttlSeconds
        )

        return currentTimes;
    }

    /**
     *
     * @param {number} timeId
     * @returns {Promise<TimeBeforeNotifcationInstance>}
     */
    async getTimeById(timeId) {
        const key = format(this._time_service_current_time_key, timeId);
        const time = await this._getRedisValue(key);

        if (time) {
            return timeRepository.build(JSON.parse(time))
        }

        const currentTime = await timeRepository.getTimeById(timeId);

        await this._setRedisValue(key, currentTime.toJSON(), this.#ttlSeconds)

        return currentTime;
    }

}

export const timeService = new TimeService();