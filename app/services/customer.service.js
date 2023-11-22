const db = require('../models');
const bcrypt = require('bcryptjs');
const Customer = db.customer;

const mapResponseData = (data) => {
    const responseData = {
        id: data.id,
        firstname: data.firstname,
        lastname: data.lastname,
        mobile: data.mobile,
        instagramUsername: data.instagramUsername,
        email: data.email
    }
    return responseData;
}

const createNewCustomer = async (customerData) => {
    const newCustomer = await Customer.create(customerData);

    return mapResponseData(newCustomer);
}

const getAllCustomers = async () => {
    const findCustomers = await Customer.findAll({
        attributes: ['id', 'firstname', 'lastname', 'mobile', 'instagramUsername', 'email']
    })

    if (findCustomers.length === 0) {
        return {
            error: {
                message: 'No customers found.'
            }
        }
    }
    return findCustomers;
}

const getCustomerById = async (id) => {
    const findCustomer = await Customer.findByPk(id);

    if (findCustomer) {
        return mapResponseData(findCustomer)
    }

    return {
        error: {
            message: `Customer with id ${id} not found.`
        }
    }
}

const updateCustomerById = async (updateContent, id) => {
    const updateCount = await Customer.update(updateContent, { where: { id: id } });

    if (updateCount == 1) {
        return {
            result: {
                message: 'Customer was updated successfully.',
            }
        }
    }
    return {
        error: {
            message: `Customer with id=${id} not found!`,
        }
    }
}

const deleteCustomerById = async (id) => {
    const deleteCount = await Customer.destroy({ where: { id: id } });

    if (deleteCount == 1) {
        return {
            result: {
                message: 'Customer was deleted successfully.',
            }
        }
    }
    return {
        error: {
            message: `Customer with id=${id} not found!`,
        }
    }
}

const login = async (email) => {
    const customer = await Customer.findOne({
        where: {
            email: email
        }
    })
    if (!customer) {
        return {
            error: {
                message: 'Customer not found.',
            }
        }
    }
    return customer;
}

const forgotPassword = async (email, updatePassword) => {

    const customer = await Customer.findOne({
        where: {
            email: email
        }
    })
    if (!customer) {
        return {
            error: {
                message: `Customer with email id = ${email} not found.`,
            }
        }
    }

    const id = customer.dataValues.id;

    await Customer.update(updatePassword, { where: { id: id } });

    return customer;
}

const resetPassword = async (customerData) => {
    const email = customerData.email;

    const customer = await Customer.findOne({
        where: {
            email: email
        }
    })
    if (!customer) {
        return {
            error: {
                message: `Customer with email id = ${email} not found.`,
            }
        }
    }

    const oldPassword = customer.dataValues.password;

    var isPasswordValid = bcrypt.compareSync(
        customerData.oldPassword,
        oldPassword
    )

    if (!isPasswordValid) {
        return {
            error: {
                message: `oldPassword is incorrect.`,
            }
        }
    }

    const newPassword = customerData.newPassword;

    const updatePassword = {
        password: bcrypt.hashSync(newPassword, 8),
        isSystemGeneratedPassword: false
    }

    const id = customer.dataValues.id;

    const passwordUpdate = await Customer.update(updatePassword, { where: { id: id } });

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

const getAddressProofType = async () => {
    const addressProofTypes = await Customer.rawAttributes.addressProofType.values;

    return {
        data: addressProofTypes
    }
}

const saveProfilePhoto = async (location, customerId) => {

    const uploadData = {
        photo: location
    }

    const updatePhoto = await Customer.update(uploadData, {
        where: {
            id: customerId
        }
    })
    if (updatePhoto == 1) {
        return {
            result: {
                message: 'Profile picture was updated successfully.',
            }
        }
    }
    return {
        error: {
            message: `Customer with id=${id} not found!`,
        }
    }
}

const deletePhoto = async(customerId) =>{

    const uploadData = {
        photo: null
    }

    const removePhoto = await Customer.update(uploadData, {
        where: {
            id: customerId
        }
    })
    if (removePhoto == 1) {
        return {
            result: {
                message: 'Profile picture was removed successfully.',
            }
        }
    }
    return {
        error: {
            message: `Customer with id=${id} not found!`,
        }
    }

}

const saveDocument = async (location, customerId, addressProof) => {

    const uploadData = {
        addressProofType: addressProof,
        addressProofType_doc: location
    }

    const updatePhoto = await Customer.update(uploadData, {
        where: {
            id: customerId
        }
    })
    if (updatePhoto == 1) {
        return {
            result: {
                message: 'Address proof document was updated successfully.',
            }
        }
    }
    return {
        error: {
            message: `Customer with id=${id} not found!`,
        }
    }
}

module.exports = {
    createNewCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomerById,
    deleteCustomerById,
    login,
    forgotPassword,
    resetPassword,
    getAddressProofType,
    saveProfilePhoto,
    deletePhoto,
    saveDocument
};