const Joi = require('Joi');

const schemaForAttendantData = Joi.object().keys({
    firstname: Joi.string().trim().min(2).max(30).regex(/^[A-Za-z]+$/).required().error(new Error('Invalid Input. Firstname should contain letters and lenght should be greater than 3 and less than 30.')),
    lastname: Joi.string().trim().min(2).max(30).regex(/^[A-Za-z]+$/).required().error(new Error('Invalid Input. Lastname should contain letters and lenght should be greater than 3 and less than 30.')),
    mobile: Joi.string().trim().length(10).pattern(/^[0-9]+$/).required().error(new Error('Invalid Input. Mobile lenght should be 10.')),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co', 'in'] } }).required().error(new Error('Invalid email input.')),
    adhaarNumber: Joi.string().trim().length(12).pattern(/^[0-9]+$/).required().error(new Error('Invalid Input. adhaarNumber lenght should be 16')),
})

const updateSchemaForAttendantData = Joi.object().keys({
    firstname: Joi.string().trim().min(2).max(30).regex(/^[A-Za-z]+$/).error(new Error('Invalid Input. Firstname should contain letters and lenght should be greater than 3 and less than 30.')),
    lastname: Joi.string().trim().min(2).max(30).regex(/^[A-Za-z]+$/).error(new Error('Invalid Input. Lastname should contain letters and lenght should be greater than 3 and less than 30.')),
    mobile: Joi.string().trim().length(10).pattern(/^[0-9]+$/).error(new Error('Invalid Input. Mobile lenght should be 10.')),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co', 'in'] } }).error(new Error('Invalid email input.')),
    adhaarNumber: Joi.string().trim().length(12).pattern(/^[0-9]+$/).error(new Error('Invalid Input. adhaarNumber lenght should be 12')),
})

const idSchema = Joi.string().guid({ version: ['uuidv4'] }).trim().error(new Error('Invalid Input. attendantId must be guid.'));

const emailSchema = Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co', 'in'] } }).error(new Error('Invalid email input.'));


module.exports = {
    schemaForAttendantData,
    updateSchemaForAttendantData,
    idSchema,
    emailSchema
}