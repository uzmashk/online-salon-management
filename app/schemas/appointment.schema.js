const Joi = require('Joi');

const schemaForAppointmentData = Joi.object().keys({
    customerId: Joi.string().trim().guid({ version: ['uuidv4'] }).required().error(new Error('Invalid Input. customerId must be guid.')),
    attendantId: Joi.string().trim().guid({ version: ['uuidv4'] }).required().error(new Error('Invalid Input. attendantId must be guid.')),
    dateOfAppointment: Joi.date().iso().error(new Error('Invalid Input. Date must be in YYYY-MM-DD format(ISO).')),
    startTime: Joi.string().trim().regex(/^([0-9]{1,2})\:([0-9]{2})$/).required().error(new Error('Invalid Input. startTime must be in hh:mm:ss or hh:mm format')),
    services: Joi.array().items(Joi.number().min(1)).required().error(new Error('Invalid Input. services cannot be null and has to be an array of number(s).')),
})

const updateSchemaForAppointmentData = Joi.object().keys({
    customerId: Joi.string().trim().guid({ version: ['uuidv4'] }).error(new Error('Invalid Input. customerId must be guid.')),
    attendantId: Joi.string().trim().guid({ version: ['uuidv4'] }).error(new Error('Invalid Input. attendantId must be guid.')),
    dateOfAppointment: Joi.date().iso().error(new Error('Invalid Input. Date must be in YYYY-MM-DD format(ISO).')),
    startTime: Joi.string().trim().regex(/^([0-9]{1,2})\:([0-9]{2})$/).error(new Error('Invalid Input. startTime must be in hh:mm:ss or hh:mm format')),
    endTime: Joi.string().trim().regex(/^([0-9]{1,2})\:([0-9]{2})$/).error(new Error('Invalid Input. startTime must be in hh:mm:ss or hh:mm format')),
    totalDuration: Joi.number().error(new Error('Invalid Input. totalDuration should be a number.')),
    totalAmount: Joi.number().error(new Error('Invalid Input. totalAmount should be a number.')),
    statusId: Joi.number().error(new Error('Invalid Input. statusId should be a number.'))
})

const idSchema = Joi.string().trim().guid({ version: ['uuidv4'] }).error(new Error('Invalid Input. appointmentId must be guid.'));

const daySchema = Joi.date().iso();

module.exports = {
    schemaForAppointmentData,
    updateSchemaForAppointmentData,
    idSchema,
    daySchema
}