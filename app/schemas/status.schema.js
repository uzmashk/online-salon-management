const Joi = require('joi');

const schemaForStatus = Joi.object().keys({
    statusName: Joi.string().trim().required(),
});

const updateSchemaForStatus = Joi.object().keys({
    statusName: Joi.string().trim(),
});

const idSchema = Joi.number().required();

module.exports = {
    schemaForServiceItem: schemaForStatus,
    updateSchemaForServiceItem: updateSchemaForStatus,
    idSchema
};