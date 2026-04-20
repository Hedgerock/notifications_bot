import {AppCoreConstants} from "../../../constants/AppCoreConstantsClass.js";

class TimeRepository {

    /**
     * @returns {Promise<TimeBeforeNotifcationInstance[]>}
     */
    async getAllTimes() {
        return /** @type {TimeBeforeNotifcationInstance[]} */ AppCoreConstants.ORM_ENTITIES.TimeBeforeNotification.findAll();
    }

    /**
     *
     * @param {number} timeId
     * @returns {Promise<TimeBeforeNotifcationInstance>}
     */
    async getTimeById(timeId) {
        return /** @type {TimeBeforeNotifcationInstance} */ AppCoreConstants
            .ORM_ENTITIES.TimeBeforeNotification.findByPk(timeId)
    }

    /**
     *
     * @param {Object[]} times
     * @param {{isNewRecord: boolean}} options
     * @returns {Promise<TimeBeforeNotifcationInstance[]>}
     */
    async bulkBuild(times,  options = { isNewRecord: false }) {
        return /** @type {TimeBeforeNotifcationInstance[]} */ AppCoreConstants.ORM_ENTITIES.TimeBeforeNotification.bulkBuild(times, options);
    }

    /**
     *
     * @param { Object } time
     * @param { Object } options
     * @returns {Promise<TimeBeforeNotifcationInstance>}
     */
    async build(time, options = { isNewRecord: false })  {
        return /** @type {TimeBeforeNotifcationInstance}*/ AppCoreConstants.ORM_ENTITIES.TimeBeforeNotification.build(time, options);
    }

}

export const timeRepository = new TimeRepository();