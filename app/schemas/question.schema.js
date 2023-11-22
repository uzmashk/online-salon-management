const Joi = require('joi');

const schemaForQuestion = Joi.object().keys({
    questionTypeId: Joi.number().error(new Error('Invalid Input. questionTypeId should be a integer value.')),
    question: Joi.string().trim().min(10).max(100).regex(/^[\sA-Za-z\?]+$/).error(new Error('Invalid Input. question should contain letters and lenght should be greater than 10 and less than 100.')),
    surveyId: Joi.number().error(new Error('Invalid Input. surveyId should be an integer value.')),
    isRequired: Joi.boolean()
})

const idSchema = Joi.number().error(new Error('id should be an intger value.'));

module.exports = {
    schemaForQuestion,
    idSchema
}