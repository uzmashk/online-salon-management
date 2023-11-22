const adminService = require('../services/admin.service');
const { schemaForAdminData, idSchema, updateSchemaForAdminData } = require('../schemas/admin.schema')
const authConfig = require('../config/auth.config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const status = require('http-status');

const createAdmin = (req, res) => {
    const { error } = schemaForAdminData.validate(req.body);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        const adminData = {
            firstname: req.body.firstname.trim(),
            lastname: req.body.lastname.trim(),
            email: req.body.email.trim(),
            password: bcrypt.hashSync(req.body.password.trim(), 8)
        }

        adminService.createNewAdmin(adminData)
            .then(result => {
                res.status(status.CREATED).send(result)
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while creating admin."
                })
            })
    }
}

const findAllAdmins = (req, res) => {

    adminService.getAllAdmins()
        .then(result => {
            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }
            res.status(status.OK).send(result)
        })
        .catch(err => {
            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while retrieving admins."
            })
        })
}

const findAdminById = (req, res) => {
    const id = req.params.adminId

    const { error } = idSchema.validate(id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        adminService.getAdminById(id)
            .then(result => {
                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }
                res.status(status.OK).send(result)
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while finding admin."
                })
            })
    }
}

const updateAdmin = (req, res) => {
    const id = req.params.adminId;

    const { error } = idSchema.validate(id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        const { error } = updateSchemaForAdminData.validate(req.body)

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
            if (req.body.email) {
                updateContent.email = req.body.email.trim();
            }
            if (req.body.password) {
                updateContent.password = req.body.password.trim();
            }

            adminService.updateAdminById(updateContent, id)
                .then(result => {
                    if (result.error) {
                        return res.status(status.NOT_FOUND).send(result.error)
                    }
                    res.status(status.OK).send(result.result)
                })
                .catch(err => {
                    res.status(status.INTERNAL_SERVER_ERROR).send({
                        message: err.message || `Error updating admin with id = ${id}`,
                    })
                })
        }
    }
}

const deleteAdmin = (req, res) => {
    const id = req.params.adminId;

    const { error } = idSchema.validate(id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        adminService.deleteAdminById(id)
            .then(result => {
                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }
                res.status(status.OK).send(result.result)
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error deleting admin with id = ${id}`,
                })
            })
    }
}

const adminLogin = (req, res) => {
    var email = req.body.email;

    adminService.login(email)
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
                role: "admin"
            }

            const token = jwt.sign(tokenData, authConfig.secret, {expiresIn : 86400});

            return res.status(status.OK).send({
                accessToken: token
            })
        })

        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while finding admin."
            })
        })
}

module.exports = {
    createAdmin,
    findAllAdmins,
    findAdminById,
    updateAdmin,
    deleteAdmin,
    adminLogin
};