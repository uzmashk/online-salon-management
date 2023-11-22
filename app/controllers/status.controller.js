const statusService = require('../services/status.service');
const { schemaForStatus, updateSchemaForStatus, idSchema } = require('../schemas/status.schema')
const status = require('http-status')

const createStatus = (req, res) => {

    const { error } = schemaForStatus.validate(req.body)

    if (error) {
        res.status(status.BAD_REQUEST).send(error.details[0].message);

    } else {
        const statusData = {
            statusName: req.body.statusName
        }

        statusService.createNewStatus(statusData)
            .then(result => {

                res.status(statusData.CREATED).send(result)
            })
            .catch(err => {

                res.status(statusData.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while creating new status."
                })
            })
    }
}

const findAllStatuses = (req, res) => {

    statusService.getAllStatus()
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while finding statuses."
            })
        })
}

const findStatus = (req, res) => {
    const id = req.params.id;

    const { error } = idSchema.validate(id)

    if (error) {
        res.status(status.BAD_REQUEST).send(error.details[0].message);

    } else {
        statusService.getStatus(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result)
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error finding status with id = ${id}`,
                })
            })
    }
}

const updateStatus = (req, res) => {
    const id = req.params.id;

    const { error } = idSchema.validate(id)

    if (error) {
        res.status(status.BAD_REQUEST).send(error.details[0].message);

    } else {
        const { error } = updateSchemaForStatus.validate(req.body)

        if (error) {
            res.status(status.BAD_REQUEST).send(error.details[0].message);

        } else {
            const updateContent = {};

            if (req.body.id) {
                updateContent.id = req.body.id.trim();
            }
            if (req.body.statusName) {
                updateContent.statusName = req.body.statusName.trim();
            }

            statusService.updateServiceItemById(id, updateContent)
                .then(result => {

                    if (result.error) {
                        return res.status(status.NOT_FOUND).send(result.error)
                    }

                    res.status(status.OK).send(result.result)
                })
                .catch(err => {

                    res.status(status.INTERNAL_SERVER_ERROR).send({
                        message: err.message || `Error updating status with id = ${id}`,
                    })
                })
        }
    }
}

const deleteStatus = (req, res) => {
    const id = req.params.id;

    const { error } = idSchema.validate(id)

    if (error) {
        res.status(status.BAD_REQUEST).send(error.details[0].message);

    } else {
        statusService.deleteServiceItemById(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result.result)
            })
            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error deleting status with id = ${id}`,
                })
            })
    }
}

module.exports = {
    createStatus,
    findAllStatuses,
    findStatus,
    updateStatus,
    deleteStatus
};