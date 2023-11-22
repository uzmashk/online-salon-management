const appointmentService = require('../services/appointment.service');
const { schemaForAppointmentData, updateSchemaForAppointmentData, idSchema, daySchema } = require('../schemas/appointment.schema')
const status = require('http-status');

const addAppointment = (req, res) => {
    const { error } = schemaForAppointmentData.validate(req.body);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        const appointmentData = {
            customerId: req.body.customerId,
            attendantId: req.body.attendantId,
            dateOfAppointment: req.body.dateOfAppointment,
            startTime: req.body.startTime,
            services: req.body.services
        }

        appointmentService.addNewAppointment(appointmentData)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result)
            })
            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while creating appointment."
                })
            })
    }
}

const findAllAppointments = (req, res) => {
    appointmentService.getAllAppointment()

        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })

        .catch(err => {
            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while retrieving appointments."
            })
        })
}

const findAppointmentById = (req, res) => {
    const id = req.params.appointmentId;

    const { error } = idSchema.validate(id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        appointmentService.getAppointmentById(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result)
            })

            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while finding Appointment."
                })
            })
    }
}

const updateAppointment = (req, res) => {
    const id = req.params.appointmentId;

    const { error } = idSchema.validate(id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        const { error } = updateSchemaForAppointmentData.validate(req.body)

        if (error) {
            res.status(status.BAD_REQUEST).send({
                message: error.message
            });

        } else {
            const updateContent = {};

            if (req.body.customerId) {
                updateContent.customerId = req.body.customerId.trim();
            }
            if (req.body.attendantId) {
                updateContent.attendantId = req.body.attendantId.trim();
            }
            if (req.body.dateOfAppointment) {
                updateContent.dateOfAppointment = req.body.dateOfAppointment.trim();
            }
            if (req.body.startTime) {
                updateContent.startTime = req.body.startTime.trim();
            }
            if (req.body.endTime) {
                updateContent.endTime = req.body.endTime.trim();
            }
            if (req.body.totalAmount) {
                updateContent.totalAmount = req.body.totalAmount;
            }
            if (req.body.totalDuration) {
                updateContent.totalDuration = req.body.totalDuration;
            }
            if (req.body.statusId) {
                updateContent.statusId = req.body.statusId;
            }

            appointmentService.updateAppointmentById(id, updateContent)
                .then(result => {

                    if (result.error) {
                        return res.status(status.NOT_FOUND).send(result.error)
                    }

                    res.status(status.OK).send(result.result)
                })

                .catch(err => {
                    res.status(status.INTERNAL_SERVER_ERROR).send({
                        message: err.message || `Error updating Appointment with id = ${id}`,
                    })
                })
        }
    }
}

const deleteAppointment = (req, res) => {
    const id = req.params.appointmentId;

    const { error } = idSchema.validate(id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        appointmentService.deleteAppointmentById(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result.result)
            })

            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error deleting Appointment with id = ${id}`,
                })
            })
    }
}

const findAppointmentByFilter = (req, res) => {
    if (req.query.day) {

        const day = req.query.day.trim();

        findAppointmentsByDay(day, res);

    } else if (req.query.month && req.query.year) {

        const month = req.query.month.trim();
        const year = req.query.year.trim();

        findAppointmentsByMonth(month, year, res);

    } else if (req.query.startDate && req.query.endDate) {

        const startDate = req.query.startDate.trim();
        const endDate = req.query.endDate.trim();

        findAppointmentsByDateRange(startDate, endDate, res);

    } else if (req.query.month) {

        res.status(status.BAD_REQUEST).send({
            message: 'Please provide a year parameter.',
        });

    } else if (req.query.year) {

        res.status(status.BAD_REQUEST).send({
            message: 'Please provide a month parameter.',
        });

    } else if (req.query.startDate) {

        res.status(status.BAD_REQUEST).send({
            message: 'Please provide a endDate parameter.',
        });

    } else if (req.query.endDate) {

        res.status(status.BAD_REQUEST).send({
            message: 'Please provide a startDate parameter.',
        });

    } else {
        findAllAppointments(req, res)
    }
}

const findAppointmentsByDay = (day, res) => {
    const { error } = daySchema.validate(day);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        appointmentService.getAppointmentsByDay(day)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result.result)
            })
            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Some error occured while retrieving appointments for ${day}`,
                })
            })
    }
}

const findAppointmentsByMonth = (month, year, res) => {

    appointmentService.getAppointmentsByMonth(month, year)
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || `Some error occured while retrieving appointments for ${month}`,
            })
        })
}

const findAppointmentsByDateRange = (startDate, endDate, res) => {

    appointmentService.getAppointmentsByDateRange(startDate, endDate)
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || `Some error occured while retrieving appointment.`,
            })
        })
}

const findAppointmentByStatus = (req, res) => {
    const id = req.params.statusId;

    appointmentService.getAppointmentsByStatus(id)
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || `Some error occured while retrieving appointment.`,
            })
        })

}

module.exports = {
    addAppointment,
    findAllAppointments,
    findAppointmentById,
    updateAppointment,
    deleteAppointment,
    findAppointmentByFilter,
    findAppointmentByStatus
};