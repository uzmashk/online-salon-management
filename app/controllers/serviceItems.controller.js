const seviceItemsService = require('../services/serviceItems.service');
const { schemaForServiceItem, updateSchemaForServiceItem, idSchema } = require('../schemas/serviceItems.schema')
const status = require('http-status')

const createServiceItem = (req, res) => {

    const { error } = schemaForServiceItem.validate(req.body)

    if (error) {
        res.status(status.BAD_REQUEST).send(error.details[0].message);

    } else {
        const serviceItemData = {
            appointmentId: req.body.appointmentId,
            serviceId: req.body.serviceId
        }

        seviceItemsService.createNewServiceItems(serviceItemData)
            .then(result => {

                res.status(status.CREATED).send(result)
            })
            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while creating new serviceItem."
                })
            })
    }
}

const findAllServiceItems = (req, res) => {

    seviceItemsService.getAllServiceItems()
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while finding ServiceItem."
            })
        })

}

const findServiceItem = (req, res) => {
    const id = req.params.id;

    const { error } = idSchema.validate(id)

    if (error) {
        res.status(status.BAD_REQUEST).send(error.details[0].message);

    } else {
        seviceItemsService.getServiceItem(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result)
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error finding ServiceItem with id = ${id}`,
                })
            })
    }
}

const updateServiceItem = (req, res) => {
    const id = req.params.id;

    const { error } = idSchema.validate(id)

    if (error) {
        res.status(status.BAD_REQUEST).send(error.details[0].message);

    } else {
        const { error } = updateSchemaForServiceItem.validate(req.body)

        if (error) {
            res.status(status.BAD_REQUEST).send(error.details[0].message);

        } else {
            const updateContent = {};

            if (req.body.appointmentId) {
                updateContent.appointmentId = req.body.appointmentId.trim();
            }
            if (req.body.serviceId) {
                updateContent.serviceId = req.body.serviceId.trim();
            }

            seviceItemsService.updateServiceItemById(id, updateContent)
                .then(result => {

                    if (result.error) {
                        return res.status(status.NOT_FOUND).send(result.error)
                    }

                    res.status(status.OK).send(result.result)
                })
                .catch(err => {

                    res.status(status.INTERNAL_SERVER_ERROR).send({
                        message: err.message || `Error updating ServiceItem with id = ${id}`,
                    })
                })
        }
    }
}

const deleteServiceItem = (req, res) => {
    const id = req.params.id;

    const { error } = idSchema.validate(id)

    if (error) {
        res.status(status.BAD_REQUEST).send(error.details[0].message);

    } else {
        seviceItemsService.deleteServiceItemById(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result.result)
            })
            .catch(err => {
                
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error deleting ServiceItem with id = ${id}`,
                })
            })
    }
}

module.exports = {
    createServiceItem,
    findAllServiceItems,
    findServiceItem,
    updateServiceItem,
    deleteServiceItem
};