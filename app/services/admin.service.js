const db = require('../models');
const Admin = db.admin;

const mapResponseData = (data) => {
    const responseData = {
        id: data.id,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email
    }
    return responseData;
}

const createNewAdmin = async (adminData) => {
    const newAdmin = await Admin.create(adminData)

    return mapResponseData(newAdmin);
}

const getAllAdmins = async () => {
    const findAdmins = await Admin.findAll({
        attributes: ['id', 'firstname', 'lastname', 'email']
    })

    if (findAdmins.length === 0) {
        return {
            error: {
                message: 'No admins found.'
            }
        }
    }
    return findAdmins;
}

const getAdminById = async (id) => {
    const findAdmin = await Admin.findByPk(id);

    if (findAdmin) {
        return mapResponseData(findAdmin)
    }

    return {
        error: {
            message: `Admin with id ${id} not found.`
        }
    }
}

const updateAdminById = async (updateContent, id) => {
    const updateCount = await Admin.update(updateContent, { where: { id: id } });

    if (updateCount == 1) {
        return {
            result: {
                message: 'Admin was updated successfully.',
            }
        }
    }
    return {
        error: {
            message: `Admin with id=${id} not found!`,
        }
    }
}

const deleteAdminById = async (id) => {
    const deleteCount = await Admin.destroy({ where: { id: id } });

    if (deleteCount == 1) {
        return {
            result: {
                message: 'Admin was deleted successfully.',
            }
        }
    }
    return {
        error: {
            message: `Admin with id=${id} not found!`,
        }
    }
}

const login = async(email) => {
    const admin = await Admin.findOne({
        where:{
            email: email
        }
    })
    if (!admin) {
        return {
            error: {
                message: 'Admin not found.',
            }
        }
    }
    return admin;
}

module.exports = {
    createNewAdmin,
    getAllAdmins,
    getAdminById,
    updateAdminById,
    deleteAdminById,
    login
};