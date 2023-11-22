const db = require('../models');
const ServiceItems = db.serviceItems;

const createNewServiceItems = async (serviceItemData) => {
    const newServiceItem = await ServiceItems.create(serviceItemData);
    return newServiceItem;
}

const getAllServiceItems = async () => {
    const findServiceItems = await ServiceItems.findAll()

    if (findServiceItems.length === 0) {
        return {
            result: {
                message: 'No servicesItems found.'
            }
        }
    }

    return findServiceItems;
}

const getServiceItem = async (id) => {
    const findServiceItem = await ServiceItems.findByPk(id)

    if (!findServiceItem) {
        return {
            error: {
                message: `ServiceItem with id ${id} not found.`
            }
        }
    }

    return findServiceItem;
}

const updateServiceItemById = async (id, updateContent) => {
    const updateCount = await ServiceItems.update(updateContent, 
        { where: { id: id } 
    });

    if (updateCount == 1) {
        return {
            result: {
                message: 'ServiceItem was updated successfully.',
            }
        }
    }

    return {
        error: {
            message: `ServiceItem with id=${id} not found!`,
        }
    }
}

const deleteServiceItemById = async (id) => {
    const deleteCount = await ServiceItems.destroy(
        { where: { id: id } 
    });

    if (deleteCount == 1) {
        return {
            result: {
                message: 'ServiceItem was deleted successfully.',
            }
        }
    }

    return {
        error: {
            message: `ServiceItem with id=${id} not found!`,
        }
    }
}

module.exports = {
    createNewServiceItems,
    getAllServiceItems,
    getServiceItem,
    updateServiceItemById,
    deleteServiceItemById
};