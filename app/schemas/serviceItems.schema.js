const Joi = require('joi');

const schemaForServiceItem = Joi.object().keys({
    appointmentId: Joi.string().trim().guid({ version: ['uuidv4'] }).required(),
    serviceId: Joi.string().trim().guid({ version: ['uuidv4'] }).required(),
});

const updateSchemaForServiceItem = Joi.object().keys({
    appointmentId: Joi.string().trim().guid({ version: ['uuidv4'] }),
    serviceId: Joi.string().trim().guid({ version: ['uuidv4'] }),
});

const idSchema = Joi.string().trim().guid({ version: ['uuidv4'] }).required();

module.exports = {
    schemaForServiceItem,
    updateSchemaForServiceItem,
    idSchema
};