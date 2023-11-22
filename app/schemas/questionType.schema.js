const Joi = require('joi');

const schemaForQuestionType = Joi.object().keys({
    typeName: Joi.string().trim().min(3).max(30).regex(/^[\sA-Za-z]+$/).error(new Error('Invalid Input. typeName should contain letters and lenght should be greater than 3 and less than 30.')),
})

const idSchema = Joi.number().error(new Error('id should be an intger value.'));

module.exports = {
    schemaForQuestionType,
    idSchema
}