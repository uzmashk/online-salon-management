const status = require('http-status');
const serviceChargesService = require('../services/serviceCharges.service');
const { schemaForServiceData, updateSchemaForServiceData, idSchema } = require('../schemas/serviceCharges.schema');
const account = require('../src/account');

const addService = (req, res) => {
    const { error } = schemaForServiceData.validate(req.body);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.details[0].message,
        });

    } else {

        const serviceData = {
            name: req.body.name.trim(),
            cost: req.body.cost,
            discountedCost: req.body.discountedCost,
            duration: req.body.duration,
            category: req.body.category.trim()
        }

        serviceChargesService.addNewService(serviceData)
            .then(result => {
                res.status(status.CREATED).send(result)
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while adding new service."
                })
            })
    }
}

const findAllServices = (req, res) => {

    serviceChargesService.findAll()
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            account.generateExcel(result);

            res.status(status.OK).send(result)
        })

        .catch(err => {
            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while retrieving services."
            })
        })
}

const findAllIndividualServices = (req, res) => {
    serviceChargesService.findIndividualServices()
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })

        .catch(err => {
            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while retrieving individual services."
            })
        })
}

const findAllComboServices = (req, res) => {
    serviceChargesService.findComboServices()
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })
        .catch(err => {
            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while retrieving combo services."
            })
        })
}

const findServiceById = (req, res) => {
    const id = req.params.serviceTypeId.trim();
    const { error } = idSchema.validate(id);
    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });
    } else {
        serviceChargesService.findById(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result)
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: "Some error occured while retrieving service." || err.message
                })
            })
    }
}

const updateService = (req, res) => {
    const id = req.params.serviceTypeId.trim();

    const { error } = idSchema.validate(id);

    if (error) {
        res.status(status.BAD_REQUEST).send(error.details[0].message);

    } else {

        const { error } = updateSchemaForServiceData.validate(req.body)

        if (error) {
            res.status(status.BAD_REQUEST).send(error.details[0].message);

        } else {
            const updateContent = {};

            if (req.body.name) {
                updateContent.name = req.body.name.trim();
            }
            if (req.body.cost) {
                updateContent.cost = req.body.cost.trim();
            }
            if (req.body.discountedCost) {
                updateContent.discountedCost = req.body.discountedCost.trim();
            }
            if (req.body.duration) {
                updateContent.duration = req.body.duration.trim();
            }
            if (req.body.category) {
                updateContent.category = req.body.category.trim();
            }

            serviceChargesService.serviceUpdate(updateContent, id)
                .then(result => {

                    if (result.error) {
                        return res.status(status.NOT_FOUND).send(result.error)
                    }

                    res.status(status.OK).send(result.result)
                })
                .catch(err => {
                    res.status(status.INTERNAL_SERVER_ERROR).send({
                        message: err.message || `Error updating service with id = ${id}`,
                    })
                })
        }
    }
}

const serviceDelete = (req, res) => {
    const id = req.params.serviceTypeId.trim();

    const { error } = idSchema.validate(id);

    if (error) {
        res.status(status.BAD_REQUEST).send(error.details[0].message);

    } else {
        serviceChargesService.deleteService(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result.result)
            })
            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error deleting service with id = ${id}`,
                })
            })
    }
}

const findServiceTypeByFilter = (req, res) => {

    if (req.query.category) {

        const category = req.query.category.trim();

        if (category) {

            if (category === "individual") {
                findAllIndividualServices(req, res)

            } else if (category === "combo") {
                findAllComboServices(req, res)
            }
        }

    } else {
        findAllServices(req, res)
    }
}

module.exports = {
    addService,
    findServiceById,
    findServiceTypeByFilter,
    updateService,
    serviceDelete
}