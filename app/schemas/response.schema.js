const Joi = require('joi');

const schemaForResponse = Joi.object().keys({
    surveyId: Joi.number().required().error(new Error('Invalid Input. surveyId should be a integer value.')),
    customerId: Joi.number().required().error(new Error('Invalid Input. customerId should be a integer value.')),
    attendantId: Joi.number().required().error(new Error('Invalid Input. customerId should be a integer value.')),
    responseDate: Joi.date().iso().required().error(new Error('Invalid Input. responseDate must be in YYYY-MM-DD format(ISO).'))
})

const updateResponseSchema = Joi.object().keys({
    surveyId: Joi.number().error(new Error('Invalid Input. surveyId should be a integer value.')),
    customerId: Joi.number().error(new Error('Invalid Input. customerId should be a integer value.')),
    attendantId: Joi.number().required().error(new Error('Invalid Input. customerId should be a integer value.')),
    responseDate: Joi.date().iso().error(new Error('Invalid Input. responseDate must be in YYYY-MM-DD format(ISO).'))
})

const idSchema = Joi.number().error(new Error('id should be an intger value.'));

module.exports = {
    schemaForResponse,
    updateResponseSchema,
    idSchema
}