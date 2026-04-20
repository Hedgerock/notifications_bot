import {AppCoreConstants} from "../../../constants/AppCoreConstantsClass.js";

class QueueRepository {

    /**
     *
     * @param {Object} options
     * @returns {Promise<QueueInstance[]>}
     */
    async findAll(options = {}) {
        return /** @type {QueueInstance[]}*/ AppCoreConstants.ORM_ENTITIES.Queue.findAll(options);
    }

    /**
     *
     * @param {string} queueId
     * @param {QueueFields} data
     * @returns {Promise<QueueInstance>}
     */
    async updateQueue(queueId, data) {
        const [_, affectedRows] = await AppCoreConstants.ORM_ENTITIES.Queue.update(
            {...data},
            {
                where: {
                    id: queueId
                },
                returning: true
            }
        )

        return /** @type {QueueInstance}*/ affectedRows[0];
    }

    /**
     *
     * @param {Object[]} queues
     * @param {{isNewRecord: boolean}} options
     * @returns {Promise<QueueInstance[]>}
     */
    async buildQueue(queues, options) {
        return /** @type {QueueInstance[]} */ AppCoreConstants.ORM_ENTITIES.Queue.bulkBuild(queues, { isNewRecord: false });
    }
}

export const queueRepository = new QueueRepository();