const db = require('../models');
const Status = db.status;

const createNewStatus = async (statusData) => {
    const newStatus = await Status.create(statusData);
    return newStatus;
}

const getAllStatus = async () => {
    const findStatuses = await Status.findAll()

    if (findStatuses.length === 0) {
        return {
            result: {
                message: 'No statuses found.'
            }
        }
    }

    return findStatuses;
}

const getStatus = async (id) => {
    const findStatus = await Status.findByPk(id)

    if (!findStatus) {
        return {
            error: {
                message: `Status with id ${id} not found.`
            }
        }
    }

    return findStatus;
}

const updateStatusById = async (id, updateContent) => {
    const updateCount = await Status.update(updateContent, 
        { where: { id: id } 
    });

    if (updateCount == 1) {
        return {
            result: {
                message: 'Status was updated successfully.',
            }
        }
    }

    return {
        error: {
            message: `Status with id=${id} not found!`,
        }
    }
}

const deleteStatusById = async (id) => {
    const deleteCount = await Status.destroy(
        { where: { id: id } 
    });

    if (deleteCount == 1) {
        return {
            result: {
                message: 'Status was deleted successfully.',
            }
        }
    }

    return {
        error: {
            message: `Status with id=${id} not found!`,
        }
    }
}

module.exports = {
    createNewStatus,
    getAllStatus,
    getStatus,
    updateStatusById,
    deleteStatusById
};