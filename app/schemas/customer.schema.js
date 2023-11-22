const Joi = require('joi');

const schemaForCustomerData = Joi.object().keys({
    firstname: Joi.string().trim().min(3).max(30).regex(/^[A-Za-z]+$/).required().error(new Error('Invalid Input. Firstname should contain letters and lenght should be greater than 3 and less than 30.')),
    lastname: Joi.string().trim().min(3).max(30).regex(/^[A-Za-z]+$/).required().error(new Error('Invalid Input. Lastname should contain letters and lenght should be greater than 3 and less than 30.')),
    mobile: Joi.string().trim().length(10).pattern(/^[0-9]+$/).required().error(new Error('Invalid Input. Lenght should be 10.')),
    instagramUsername: Joi.string().trim().min(2).max(30).required().error(new Error('Invalid Input. Lenght should be less than or equal to 30.')),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co', 'in'] } }).required().error(new Error('Invalid email input.'))
})

const idSchema = Joi.string().trim().guid({ version: ['uuidv4'] }).error(new Error('Invalid Input. customerrId must be guid.'));

const updateSchemaForCustomerData = Joi.object().keys({
    firstname: Joi.string().trim().min(3).max(30).regex(/^[A-Za-z]+$/).error(new Error('Invalid Input. Firstname should contain letters and lenght should be greater than 2 and less than 30.')),
    lastname: Joi.string().trim().min(3).max(30).regex(/^[A-Za-z]+$/).error(new Error('Invalid Input. Lastname should contain letters and lenght should be greater than 2 and less than 30.')),
    mobile: Joi.string().trim().length(10).pattern(/^[0-9]+$/).error(new Error('Invalid Input. Mobile lenght should be 10.')),
    instagramUsername: Joi.string().trim().min(2).max(30).error(new Error('Invalid Input. InstagramUsernam lenght should be less than or equal to 30.')),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co', 'in'] } }).error(new Error('Invalid email input.'))
})

const emailSchema = Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co', 'in'] } }).error(new Error('Invalid email input.'));

module.exports = {
    schemaForCustomerData,
    idSchema,
    updateSchemaForCustomerData,
    emailSchema
}