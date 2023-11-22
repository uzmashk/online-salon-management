const db = require('../models');
const QuestionType = db.questionType;

const createNewQuestionType = async (questionTypeData) => {
    const newQuestionType = await QuestionType.create(questionTypeData);
    return newQuestionType;
}

const getAllQuestionTypes = async () => {
    const questionTypes = await QuestionType.findAll()

    if (questionTypes.length === 0) {
        return {
            error: {
                message: 'No question type found.'
            }
        }
    }

    return questionTypes;
}

const getQuestionType = async (id) => {
    const questionType = await QuestionType.findByPk(id)

    if (!questionType) {
        return {
            error: {
                message: `Question type with id ${id} not found.`
            }
        }
    }

    return questionType;
}

const updateQuestionTypeById = async (id, updateContent) => {
    const updateCount = await QuestionType.update(updateContent,
        {
            where: { id: id }
        });

    if (updateCount == 1) {
        return {
            result: {
                message: 'Question type was updated successfully.',
            }
        }
    }

    return {
        error: {
            message: `Question type with id=${id} not found!`,
        }
    }
}

const deleteQuestionTypeById = async (id) => {
    const deleteCount = await QuestionType.destroy(
        {
            where: { id: id }
        });

    if (deleteCount == 1) {
        return {
            result: {
                message: 'Question type was deleted successfully.',
            }
        }
    }

    return {
        error: {
            message: `Question type with id=${id} not found!`,
        }
    }
}

module.exports = {
    createNewQuestionType,
    getAllQuestionTypes,
    getQuestionType,
    updateQuestionTypeById,
    deleteQuestionTypeById
};