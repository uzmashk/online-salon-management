const db = require('../models');
const status = require('http-status')
const Admin = db.admin;
const Attendant = db.attendant;
const Customer = db.customer;

const isAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findByPk(req.id);

        if (admin) {
            next();
            return;
        }

        return res.status(status.FORBIDDEN).send({
            message: 'Unauthorised Admin access.'
        })

    } catch (err) {

        return res.status(status.INTERNAL_SERVER_ERROR).send({
            message: err.message,
        })
    }
}

const isCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findByPk(req.id)

        const systemGeneratedPassword = customer.dataValues.isSystemGeneratedPassword;

        if (customer) {

            if (systemGeneratedPassword !== false) {
                return res.status(status.FORBIDDEN).send({
                    message: 'Unauthorised access. Please reset your password.'
                })
            }

            next();
            return;
        }

        return res.status(status.FORBIDDEN).send({
            message: 'Unauthorised customer access.'
        })

    } catch (err) {

        return res.status(status.INTERNAL_SERVER_ERROR).send({
            message: err.message,
        })
    }
}

const isAttendant = async (req, res, next) => {
    try {
        const attendant = await Attendant.findByPk(req.id)

        const systemGeneratedPassword = attendant.dataValues.isSystemGeneratedPassword;

        if (attendant) {

            if (systemGeneratedPassword !== false) {
                return res.status(status.FORBIDDEN).send({
                    message: 'Unauthorised access. Please reset your password.'
                })
            }

            next();
            return;
        }

        return res.status(status.FORBIDDEN).send({
            message: 'Unauthorised attendant access.'
        })

    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).send({
            message: err.message,
        })
    }
}

const isAdminCustomer = async (req, res, next) => {
    try {
        if (req.role === 'customer') {

            const customer = await Customer.findByPk(req.id)

            const systemGeneratedPassword = customer.dataValues.isSystemGeneratedPassword;

            if (customer) {

                if (systemGeneratedPassword !== false) {
                    return res.status(status.FORBIDDEN).send({
                        message: 'Unauthorised access. Please reset your password'
                    })
                }

                next();
                return;
            }

            return res.status(status.FORBIDDEN).send({
                message: 'Unauthorised customer access.'
            })

        } else if (req.role === 'admin') {

            const admin = await Admin.findByPk(req.id)

            if (admin) {
                next();
                return;
            }

            return res.status(status.FORBIDDEN).send({
                message: 'Unauthorised admin access.'
            })
        }

        return res.status(status.FORBIDDEN).send({
            message: 'Unauthorised user access.'
        })

    } catch (err) {

        return res.status(status.INTERNAL_SERVER_ERROR).send({
            message: err.message,
        })
    }
}

const isAdminAttendant = async (req, res, next) => {
    try {
        if (req.role === 'attendant') {

            const attendant = await Attendant.findByPk(req.id)

            const systemGeneratedPassword = attendant.dataValues.isSystemGeneratedPassword;

            if (attendant) {

                if (systemGeneratedPassword !== false) {
                    return res.status(status.FORBIDDEN).send({
                        message: 'Unauthorised access. Please reset your password.'
                    })
                }

                next();
                return;
            }

            return res.status(status.FORBIDDEN).send({
                message: 'Unauthorised attendant access.'
            })

        } else if (req.role === 'admin') {

            const admin = await Admin.findByPk(req.id)

            if (admin) {
                next();
                return;
            }

            return res.status(status.FORBIDDEN).send({
                message: 'Unauthorised admin access.'
            })
        }

        return res.status(status.FORBIDDEN).send({
            message: 'Unauthorised user access.'
        })

    } catch (err) {

        return res.status(status.INTERNAL_SERVER_ERROR).send({
            message: err.message,
        })
    }
}

const isAdminAttendantCustomer = async (req, res, next) => {
    try {
        if (req.role === 'attendant') {

            const attendant = await Attendant.findByPk(req.id)

            const systemGeneratedPassword = attendant.dataValues.isSystemGeneratedPassword;

            if (attendant) {

                if (systemGeneratedPassword !== false) {

                    return res.status(status.FORBIDDEN).send({
                        message: 'Unauthorised access. Please reset your password.'
                    })
                }

                next();
                return;
            }

            return res.status(status.FORBIDDEN).send({
                message: 'Unauthorised attendant access.'
            })

        } else if (req.role === 'admin') {

            const admin = await Admin.findByPk(req.id)

            if (admin) {
                next();
                return;
            }

            return res.status(status.FORBIDDEN).send({
                message: 'Unauthorised admin access.'
            })

        } else if (req.role === 'customer') {

            const customer = await Customer.findByPk(req.id)

            const systemGeneratedPassword = customer.dataValues.isSystemGeneratedPassword;

            if (customer) {

                if (systemGeneratedPassword !== false) {
                    return res.status(status.FORBIDDEN).send({
                        message: 'Unauthorised access. Please reset your password.'
                    })
                }

                next();
                return;
            }

            return res.status(status.FORBIDDEN).send({
                message: 'Unauthorised customer access.'
            })
        }

        return res.status(status.FORBIDDEN).send({
            message: 'Unauthorised user.'
        })

    } catch (err) {

        return res.status(status.INTERNAL_SERVER_ERROR).send({
            message: err.message,
        })
    }
}

const verifyUserForReset = async (req, res, next) => {

    try {
        if (req.role === 'attendant') {

            const attendant = await Attendant.findByPk(req.id);

            if (attendant) {

                console.log("Attendant login successful");

                next();
                return;
            }

            return res.status(status.FORBIDDEN).send({
                message: 'Unauthorised user access.'
            })

        } else if (req.role === 'customer') {

            const customer = await Customer.findByPk(req.id)

            if (customer) {

                console.log("Customer login successful");

                next();
                return;
            }

            return res.status(status.FORBIDDEN).send({
                message: 'Unauthorised user access.'
            })

        }

        return res.status(status.FORBIDDEN).send({
            message: 'Unauthorised user access.'
        })

    } catch (err) {

        return res.status(status.INTERNAL_SERVER_ERROR).send({
            message: err.message,
        })
    }
}

const isValidUser = async (req, res, next) => {

    try {
        if (req.role === 'attendant') {

            const attendant = await Attendant.findByPk(req.id);

            if (attendant) {

                next();
                return;
            }

            return res.status(status.FORBIDDEN).send({
                message: 'Unauthorised user access.'
            })

        } else if (req.role === 'customer') {

            const customer = await Customer.findByPk(req.id)

            if (customer) {

                next();
                return;
            }

            return res.status(status.FORBIDDEN).send({
                message: 'Unauthorised user access.'
            })

        } else if (req.role === 'admin') {

            const admin = await Admin.findByPk(req.id)

            if (admin) {

                next();
                return;
            }

            return res.status(status.FORBIDDEN).send({
                message: 'Unauthorised user access.'
            })
        }

        return res.status(status.FORBIDDEN).send({
            message: 'Unauthorised user access.'
        })

    } catch (err) {

        return res.status(status.INTERNAL_SERVER_ERROR).send({
            message: err.message,
        })
    }
}

module.exports = {
    isAdmin,
    isCustomer,
    isAttendant,
    isAdminCustomer,
    isAdminAttendant,
    isAdminAttendantCustomer,
    isValidUser,
    verifyUserForReset
}