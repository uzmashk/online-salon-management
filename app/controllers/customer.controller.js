const customerService = require('../services/customer.service');
const { schemaForCustomerData, idSchema, updateSchemaForCustomerData, emailSchema } = require('../schemas/customer.schema');
const authConfig = require('../config/auth.config');
const account = require('../src/account');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const status = require('http-status');

const generateRandomPassword = () => {
    var password = '';
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (var count = 1; count <= 11; count++) {
        var char = Math.floor(Math.random() * str.length + 1);

        password += str.charAt(char)
    }

    return password;
}

const createCustomer = async (req, res) => {
    const { error } = schemaForCustomerData.validate(req.body);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        const password = await generateRandomPassword();

        const customerData = {
            firstname: req.body.firstname.trim(),
            lastname: req.body.lastname.trim(),
            mobile: req.body.mobile.trim(),
            instagramUsername: req.body.instagramUsername.trim(),
            email: req.body.email.trim(),
            password: bcrypt.hashSync(password, 8)
        }

        customerService.createNewCustomer(customerData)
            .then(result => {

                account.sendWelcomeEmail(customerData, password);

                res.status(status.CREATED).send(result)
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while creating customer."
                })
            })
    }
}

const findAllCustomers = (req, res) => {

    customerService.getAllCustomers()
        .then(result => {
            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }
            res.status(status.OK).send(result)
        })
        .catch(err => {
            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while retrieving customers."
            })
        })
}

const findCustomerById = (req, res) => {
    const id = req.params.customerId

    const { error } = idSchema.validate(id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        customerService.getCustomerById(id)
            .then(result => {
                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }
                res.status(status.OK).send(result)
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while finding customer."
                })
            })
    }
}

const updateCustomer = (req, res) => {
    const id = req.params.customerId;

    const { error } = idSchema.validate(id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        const { error } = updateSchemaForCustomerData.validate(req.body)

        if (error) {
            res.status(status.BAD_REQUEST).send(error.message);

        } else {

            const updateContent = {};

            if (req.body.firstname) {
                updateContent.firstname = req.body.firstname.trim();
            }
            if (req.body.lastname) {
                updateContent.lastname = req.body.lastname.trim();
            }
            if (req.body.mobile) {
                updateContent.mobile = req.body.mobile.trim();
            }
            if (req.body.instagramUsername) {
                updateContent.instagramUsername = req.body.instagramUsername.trim();
            }
            if (req.body.email) {
                updateContent.email = req.body.email.trim();
            }
            if (req.body.password) {
                updateContent.password = req.body.password.trim();
            }

            customerService.updateCustomerById(updateContent, id)

                .then(result => {
                    if (result.error) {
                        return res.status(status.NOT_FOUND).send(result.error)
                    }

                    res.status(status.OK).send(result.result)
                })

                .catch(err => {
                    res.status(status.INTERNAL_SERVER_ERROR).send({
                        message: err.message || `Error updating customer with id = ${id}`,
                    })
                })
        }
    }
}

const deleteCustomer = (req, res) => {
    const id = req.params.customerId;

    const { error } = idSchema.validate(id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        customerService.deleteCustomerById(id)
            .then(result => {
                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }
                res.status(status.OK).send(result.result)
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error deleting Customer with id = ${id}`,
                })
            })
    }
}

const customerLogin = (req, res) => {
    var email = req.body.email;

    customerService.login(email)
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            var isPasswordValid = bcrypt.compareSync(
                req.body.password,
                result.password
            )

            if (!isPasswordValid) {
                res.status(401).send({
                    accessToken: null,
                    message: "Wrong password. Please provide correct password."
                })
            }

            const tokenData = {
                id: result.id,
                role: "customer"
            }

            const token = jwt.sign(tokenData, authConfig.secret, { expiresIn: 86400 });

            if (result.isSystemGeneratedPassword !== false) {

                return res.status(status.OK).send({
                    accessToken: token,
                    resetPassword: true
                })
            }

            return res.status(status.OK).send({
                accessToken: token
            })
        })

        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while finding customer."
            })
        })
}

const customerForgotPassword = async (req, res) => {
    const email = req.body.email;

    const password = await generateRandomPassword();

    const updatePassword = {
        password: bcrypt.hashSync(password, 8),
        isSystemGeneratedPassword: true,
    }

    const { error } = emailSchema.validate(email);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        customerService.forgotPassword(email, updatePassword)

            .then(result => {
                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                account.sendResetPasswordEmail(result, password);

                res.status(status.OK).send({
                    message: `The login credentials to reset password will be sent shortly.`
                })
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Some error occurred while generating password.`,
                })
            })
    }
}

const resetCustomerPassword = (req, res) => {

    const customerData = {
        email: req.body.email,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword
    }

    customerService.resetPassword(customerData)

        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result.result)
        })

        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || `Some error occured while resetting password.`,
            })
        })
}

const findAllAddressProofType = (req, res) => {

    customerService.getAddressProofType()
        .then(result => {
            res.status(status.OK).send(result)
        })
        .catch(err => {
            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured getting addressProof."
            })
        })
}

const uploadCustomerPhoto = (req, res) => {
    const fileExtension = req.file.originalname.split('.').pop();
    const location = `${req.file.path}.${fileExtension}`

    if (!location) {
        res.status(status.BAD_REQUEST).send({
            message: 'Please select an image.'
        });
    }

    var customerId = req.id

    if (!req.file.originalname.match(/\.(jpeg|jpg|png|JPEG|PNG)$/)) {

        res.status(status.BAD_REQUEST).send({
            message: 'Please select an image only.'
        });
    }

    customerService.saveProfilePhoto(location, customerId)
        .then(result => {

            if (result.error) {

                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result.result)
        })

        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured."
            })
        })
}

const deleteCustomerPhoto = (req, res) =>{
    var customerId = req.id;

    customerService.deletePhoto(customerId)
        .then(result => {

            if (result.error) {

                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result.result)
        })

        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured."
            })
        })
}

const uploadCustomerDocument = (req, res) => {
    const addressProof = req.body.addressProof;

    const fileExtension = req.file.originalname.split('.').pop();
    const location = `${req.file.path}.${fileExtension}`

    if (!location) {
        res.status(status.BAD_REQUEST).send({
            message: 'Please select an image.'
        });
    }

    var customerId = req.id

    if (!req.file.originalname.match(/\.(jpeg|jpg|png|JPEG|JPG|PNG)$/)) {

        res.status(status.BAD_REQUEST).send({
            message: 'Please select an image only.'
        });
    }

    customerService.saveDocument(location, customerId, addressProof)
        .then(result => {

            if (result.error) {

                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result.result)
        })

        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured."
            })
        })
}

module.exports = {
    createCustomer,
    findAllCustomers,
    findCustomerById,
    updateCustomer,
    deleteCustomer,
    customerLogin,
    customerForgotPassword,
    resetCustomerPassword,
    findAllAddressProofType,
    uploadCustomerPhoto,
    deleteCustomerPhoto,
    uploadCustomerDocument
};