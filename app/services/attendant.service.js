const db = require('../models');
const bcrypt = require('bcryptjs');
const Attendant = db.attendant;

const mapResponseData = (data) => {
    const responseData = {
        id: data.id,
        firstname: data.firstname,
        lastname: data.lastname,
        mobile: data.mobile,
        adhaarNumber: data.adhaarNumber,
        email: data.email
    }
    return responseData;
}

const createNewAttendant = async (attendantData) => {
    const newAttendant = await Attendant.create(attendantData);

    return mapResponseData(newAttendant)
}

const getAllAttendants = async () => {
    const findAttendants = await Attendant.findAll({
        attributes: ['id', 'firstname', 'lastname', 'mobile', 'adhaarNumber', 'email']
    })
    if (findAttendants.length === 0) {
        return {
            error: {
                message: 'No attendants found.'
            }
        }
    }
    return findAttendants
}

const getAttendantById = async (id) => {
    const findAttendant = await Attendant.findByPk(id)
    if (!findAttendant) {
        return {
            error: {
                message: `Attendant with id ${id} not found.`
            }
        }
    }
    return mapResponseData(findAttendant)
}

const updateAttendantById = async (updateContent, id) => {
    const updateCount = await Attendant.update(updateContent, { where: { id: id } });

    if (updateCount == 1) {
        return {
            result: {
                message: 'Attendant was updated successfully.',
            }
        }
    }

    return {
        error: {
            message: `Attendant with id=${id} not found!`,
        }
    }
}

const deleteAttendantById = async (id) => {
    const deleteCount = await Attendant.destroy({ where: { id: id } });
    if (deleteCount == 1) {
        return {
            result: {
                message: 'Attendant was deleted successfully.',
            }
        }
    }
    return {
        error: {
            message: `Attendant with id=${id} not found!`,
        }
    }
}

const login = async(email) => {
    const attendant = await Attendant.findOne({
        where:{
            email: email
        }
    })
    if (!attendant) {
        return {
            error: {
                message: 'Attendant not found.',
            }
        }
    }
    return attendant;
}

const forgotPassword = async (email, updatePassword) => {

    const attendant = await Attendant.findOne({
        where: {
            email: email
        }
    })
    if (!attendant) {
        return {
            error: {
                message: `Attendant with email id = ${email} not found.`,
            }
        }
    }

    const id = attendant.dataValues.id;

    await Attendant.update(updatePassword, { where: { id: id } });

    return attendant;
}

const resetPassword = async (attendantData) => {
    const email = attendantData.email;

    const attendant = await Attendant.findOne({
        where: {
            email: email
        }
    })
    if (!attendant) {
        return {
            error: {
                message: `Attendant with email id = ${email} not found.`,
            }
        }
    }

    const oldPassword = attendant.dataValues.password;

    var isPasswordValid = bcrypt.compareSync(
        attendantData.oldPassword,
        oldPassword
    )

    if (!isPasswordValid) {
        return {
            error: {
                message: `oldPassword is incorrect.`,
            }
        }
    }

    const newPassword = attendantData.newPassword;

    const updatePassword = {
        password: bcrypt.hashSync(newPassword, 8),
        isSystemGeneratedPassword: false
    }

    const id = attendant.dataValues.id;

    const passwordUpdate = await Attendant.update(updatePassword, { where: { id: id } });

    if (passwordUpdate == 1) {
        return {
            result: {
                message: 'Password was updated successfully.',
            }
        }
    }

    return {
        error: {
            message: `Unable to update password!`,
        }
    }

}

const saveDocument = async (attendantId, updateUploads) => {

    const updateDocuments = await Attendant.update(updateUploads, {
        where: {
            id: attendantId
        }
    })
    if (updateDocuments == 1) {
        return {
            result: {
                message: 'Documents were uploaded successfully.',
            }
        }
    }
    return {
        error: {
            message: `Attendant with id=${id} not found!`,
        }
    }
}


module.exports = {
    createNewAttendant,
    getAllAttendants,
    getAttendantById,
    updateAttendantById,
    deleteAttendantById,
    login,
    forgotPassword,
    resetPassword,
    saveDocument
};