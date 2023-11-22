const db = require('../models');
const Option = db.options;

const createNewOption = async (optionData) => {
    const newOption = await Option.create(optionData);
    return newOption;
}

const getAllOptions = async () => {
    const options = await Option.findAll()

    if (options.length === 0) {
        return {
            error: {
                message: 'No options found.'
            }
        }
    }

    return options;
}

const getOption = async (id) => {
    const option = await Option.findByPk(id)

    if (!option) {
        return {
            error: {
                message: `Option with id ${id} not found.`
            }
        }
    }

    return option;
}

const updateOptionById = async (id, updateContent) => {
    const updateCount = await Option.update(updateContent,
        {
            where: { id: id }
        });

    if (updateCount == 1) {
        return {
            result: {
                message: 'Option was updated successfully.',
            }
        }
    }

    return {
        error: {
            message: `Option with id=${id} not found!`,
        }
    }
}

const deleteOptionById = async (id) => {
    const deleteCount = await Option.destroy(
        {
            where: { id: id }
        });

    if (deleteCount == 1) {
        return {
            result: {
                message: 'Option was deleted successfully.',
            }
        }
    }

    return {
        error: {
            message: `Option with id=${id} not found!`,
        }
    }
}

module.exports = {
    createNewOption,
    getAllOptions,
    getOption,
    updateOptionById,
    deleteOptionById
};