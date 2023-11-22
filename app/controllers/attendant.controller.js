const attendantService = require('../services/attendant.service');
const { schemaForAttendantData, idSchema, updateSchemaForAttendantData, emailSchema } = require('../schemas/attendant.schema');
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

const createAttendant = async (req, res) => {
    const { error } = schemaForAttendantData.validate(req.body);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        const password = await generateRandomPassword();

        const attendantData = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            mobile: req.body.mobile,
            email: req.body.email,
            adhaarNumber: req.body.adhaarNumber,
            password: bcrypt.hashSync(password, 8)
        }

        attendantService.createNewAttendant(attendantData)
            .then(result => {

                account.sendWelcomeEmail(attendantData, password);

                res.status(status.CREATED).send(result)
            })

            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while creating attendant."
                })
            })
    }
}

const findAllAttendants = (req, res) => {
    attendantService.getAllAttendants()
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })

        .catch(err => {
            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while retrieving attendants."
            })
        })
}

const findAttendantById = (req, res) => {
    const id = req.params.attendantId;

    const { error } = idSchema.validate(id)

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        attendantService.getAttendantById(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result)
            })

            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while finding Attendant."
                })
            })
    }
}

const updateAttendant = (req, res) => {
    const id = req.params.attendantId;

    const { error } = idSchema.validate(id)

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        const { error } = updateSchemaForAttendantData.validate(req.body)

        if (error) {
            res.status(status.BAD_REQUEST).send({
                message: error.message
            });

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
            if (req.body.email) {
                updateContent.email = req.body.email.trim();
            }
            if (req.body.adhaarNumber) {
                updateContent.adhaarNumber = req.body.adhaarNumber.trim();
            }
            if (req.body.password) {
                updateContent.password = req.body.password.trim();
            }

            attendantService.updateAttendantById(updateContent, id)
                .then(result => {

                    if (result.error) {
                        return res.status(status.NOT_FOUND).send(result.error)
                    }

                    res.status(status.OK).send(result.result)
                })

                .catch(err => {
                    res.status(status.INTERNAL_SERVER_ERROR).send({
                        message: err.message || `Error updating Attendant with id = ${id}`,
                    })
                })
        }
    }
}

const deleteAttendant = (req, res) => {
    const id = req.params.attendantId;

    const { error } = idSchema.validate(id)

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        attendantService.deleteAttendantById(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result.result)
            })

            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error deleting Attendant with id = ${id}`,
                })
            })
    }
}

const attendantLogin = (req, res) => {
    var email = req.body.email;

    attendantService.login(email)
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
                    message: "Invalid password."
                })
            }

            const tokenData = {
                id: result.id,
                role: "attendant"
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
            });
        })

        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while finding attendant."
            })
        })
}

const attendantForgotPassword = async (req, res) => {
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
        attendantService.forgotPassword(email, updatePassword)

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

const resetAttendantPassword = (req, res) => {

    const attendantData = {
        email: req.body.email,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword
    }

    attendantService.resetPassword(attendantData)

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

const uploadAttendantDocument = (req, res) => {

    var fileExtension;

    var updateUploads = {};

    if (req.files.adhaarCard) {

        if (!req.files.adhaarCard[0].originalname.match(/\.(jpeg|jpg|png|JPEG|JPG|PNG)$/)) {

            res.status(status.BAD_REQUEST).send({
                message: 'Please select an image only.'
            });
        }
        
        fileExtension = req.files.adhaarCard[0].originalname.split('.').pop();
        var adhaarLocation = `${req.files.adhaarCard[0].path}.${fileExtension}`

        updateUploads.adhaar_card = adhaarLocation;
    }
    if (req.files.panCard) {

        if (!req.files.panCard[0].originalname.match(/\.(jpeg|jpg|png|JPEG|JPG|PNG)$/)) {

            res.status(status.BAD_REQUEST).send({
                message: 'Please select an image only.'
            });
        }

        fileExtension = req.files.panCard[0].originalname.split('.').pop();
        var panCardLocation = `${req.files.panCard[0].path}.${fileExtension}`

        updateUploads.pan_card = panCardLocation;
    }
    if (req.files.profilePhoto) {

        if (!req.files.profilePhoto[0].originalname.match(/\.(jpeg|jpg|png|JPEG|JPG|PNG)$/)) {

            res.status(status.BAD_REQUEST).send({
                message: 'Please select an image only.'
            });
        }

        fileExtension = req.files.profilePhoto[0].originalname.split('.').pop();
        var profilePhotoLocation = `${req.files.profilePhoto[0].path}.${fileExtension}`

        updateUploads.profile_picture = profilePhotoLocation;
    }

    var attendantId = req.id

    attendantService.saveDocument(attendantId, updateUploads)
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
    createAttendant,
    findAllAttendants,
    findAttendantById,
    updateAttendant,
    deleteAttendant,
    attendantLogin,
    attendantForgotPassword,
    resetAttendantPassword,
    uploadAttendantDocument
};