const Joi = require('joi');

const schemaForOption = Joi.object().keys({
    option: Joi.string().trim().min(3).max(30).regex(/^[\sA-Za-z]+$/).error(new Error('Invalid Input. option should contain letters and lenght should be greater than 3 and less than 30.')),
    questionId: Joi.number().error(new Error('Invalid Input. questionId should be a integer value.'))
})

const idSchema = Joi.number().error(new Error('id should be an intger value.'));

module.exports = {
    schemaForOption,
    idSchema
}