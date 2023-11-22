const Joi = require('joi');

const schemaForSurveryForm = Joi.object().keys({
    surveyFormName: Joi.string().trim().min(3).max(100).regex(/^[\sA-Za-z]+$/).error(new Error('Invalid Input. surveryFormName should contain letters and lenght should be greater than 3 and less than 30.')),
    description: Joi.string().trim().min(5).max(200).error(new Error('Invalid Input. description should contain letters and lenght should be greater than 5 and less than 200.')),
    status: Joi.string().trim().error(new Error('status should be draft, published or archieved.')),
    publishedDate: Joi.date().iso().error(new Error('Invalid Input. publishedDate must be in YYYY-MM-DD format(ISO).'))
})

const idSchema = Joi.number().error(new Error('id should be an intger value.'));

module.exports = {
    schemaForSurveryForm,
    idSchema
}