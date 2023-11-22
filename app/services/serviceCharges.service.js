const db = require('../models')
const ServiceCharge = db.serviceCharges;

const addNewService = async (serviceData) => {
    const newServiceType = await ServiceCharge.create(serviceData)
    return newServiceType;
}

const findAll = async () => {

    var findServices = await ServiceCharge.findAll();

    findServices = JSON.stringify(findServices)
    findServices = JSON.parse(findServices)

    if (findServices.length === 0) {
        return {
            error: {
                message: 'No services found.'
            }
        }
    }

    return findServices;
}

const findById = async (id) => {
    const findService = await ServiceCharge.findByPk(id)
    if (!findService) {
        return {
            error: {
                message: `Service with id ${id} not found.`
            }
        }
    }
    return findService;
}

const findIndividualServices = async () => {

    const findServices = await ServiceCharge.findAll({ where: { category: "individual" } })
    if (findServices.length === 0) {
        return {
            error: {
                message: 'No individual services found.'
            }
        }
    }
    return findServices;
}

const findComboServices = async () => {
    const findServices = await ServiceCharge.findAll({ where: { category: "combo" } })
    if (findServices.length === 0) {
        return {
            error: {
                message: 'No combo services found.'
            }
        }
    }
    return findServices;
}

const serviceUpdate = async (updateContent, id) => {
    const updateCount = await ServiceCharge.update(updateContent, { where: { id: id } });
    if (updateCount == 1) {
        return {
            result: {
                message: 'Service was updated successfully.',
            }
        }
    }
    return {
        error: {
            message: `Service with id=${id} not found!`,
        }
    }
}

const deleteService = async (id) => {
    const deleteCount = await ServiceCharge.destroy({ where: { id: id } });

    if (deleteCount == 1) {
        return {
            result: {
                message: 'Service was deleted successfully.',
            }
        }
    }

    return {
        error: {
            message: `Service with id=${id} not found!`,
        }
    }
}

module.exports = {
    addNewService,
    findAll,
    findById,
    findIndividualServices,
    findComboServices,
    serviceUpdate,
    deleteService
}