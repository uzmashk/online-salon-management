const Joi = require('joi');

const schemaForAdminData = Joi.object().keys({
    firstname: Joi.string().trim().min(3).max(30).regex(/^[A-Za-z]+$/).required().error(new Error('Invalid Input. Firstname should contain letters and lenght should be greater than 3 and less than 30.')),
    lastname: Joi.string().trim().min(3).max(30).regex(/^[A-Za-z]+$/).required().error(new Error('Invalid Input. Lastname should contain letters and lenght should be greater than 3 and less than 30.')),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co', 'in'] } }).required().error(new Error('Invalid email input.')),
    password: Joi.string().trim().min(6).max(20).required().error(new Error('Invalid Input. Length should be greater than 2 and less than 20.'))
})

const idSchema = Joi.string().trim().guid({ version: ['uuidv4'] }).error(new Error('Invalid Input. customerrId must be guid.'));

const updateSchemaForAdminData = Joi.object().keys({
    firstname: Joi.string().trim().min(3).max(30).regex(/^[A-Za-z]+$/).error(new Error('Invalid Input. Firstname should contain letters and lenght should be greater than 2 and less than 30.')),
    lastname: Joi.string().trim().min(3).max(30).regex(/^[A-Za-z]+$/).error(new Error('Invalid Input. Lastname should contain letters and lenght should be greater than 2 and less than 30.')),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co', 'in'] } }).error(new Error('Invalid email input.')),
    password: Joi.string().trim().min(6).max(20).error(new Error('Invalid Input. Password length should be greater than 2 and less than 20.'))
})

module.exports = {
    schemaForAdminData,
    idSchema,
    updateSchemaForAdminData
}