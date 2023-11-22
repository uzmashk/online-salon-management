const Joi = require('joi');

const schemaForServiceData = Joi.object().keys({
    name: Joi.string().trim().min(2).max(50).required(),
    cost: Joi.number().required(),
    discountedCost: Joi.number(),
    duration: Joi.number().required(),
    category: Joi.string().trim().required()
})

const updateSchemaForServiceData = Joi.object().keys({
    name: Joi.string().trim().min(2).max(50),
    cost: Joi.number(),
    discountedCost: Joi.number(),
    duration: Joi.number(),
    category: Joi.string().trim()
})

const idSchema = Joi.number().error(new Error('Invalid Input. serviceTypeId should be guid.'));

module.exports ={
    schemaForServiceData,
    updateSchemaForServiceData,
    idSchema
};