const db = require('../models');
const SurveyAnswer = db.surveyAnswer;

const createNewSurveyAnswer = async (surveyAnswerData) => {
    const newSurveyAnswer = await SurveyAnswer.create(surveyAnswerData);
    return newSurveyAnswer;
}

const getAllSurveyAnswers = async () => {
    const surveyAnswers = await SurveyAnswer.findAll()

    if (surveyAnswers.length === 0) {
        return {
            error: {
                message: 'No survey answers found.'
            }
        }
    }

    return surveyAnswers;
}

const getSurveyAnswer = async (id) => {
    const surveyAnswer = await SurveyAnswer.findByPk(id)

    if (!surveyAnswer) {
        return {
            error: {
                message: `Survey answer with id ${id} not found.`
            }
        }
    }

    return surveyAnswer;
}

const updatesurveyAnswerById = async (id, updateContent) => {
    const updateCount = await SurveyAnswer.update(updateContent,
        {
            where: { id: id }
        });

    if (updateCount == 1) {
        return {
            result: {
                message: 'Survey answer was updated successfully.',
            }
        }
    }

    return {
        error: {
            message: `Survey answer with id=${id} not found!`,
        }
    }
}

const deleteSurveyAnswerById = async (id) => {
    const deleteCount = await SurveyAnswer.destroy(
        {
            where: { id: id }
        });

    if (deleteCount == 1) {
        return {
            result: {
                message: 'Survey answer was deleted successfully.',
            }
        }
    }

    return {
        error: {
            message: `Survey answer with id=${id} not found!`,
        }
    }
}

module.exports = {
    createNewSurveyAnswer,
    getAllSurveyAnswers,
    getSurveyAnswer,
    updatesurveyAnswerById,
    deleteSurveyAnswerById
};