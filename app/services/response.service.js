const db = require('../models');
const Response = db.response;
const SurveyAnswer = db.surveyAnswer

const createNewResponse = async (responseData) => {
    const newResponse = await Response.create(responseData);
    return newResponse;
}

const getAllResponses = async () => {
    const responses = await Response.findAll()

    if (responses.length === 0) {
        return {
            error: {
                message: 'No responses found.'
            }
        }
    }

    return responses;
}

const getResponse = async (id) => {
    const response = await Response.findByPk(id)

    if (!response) {
        return {
            error: {
                message: `Response with id ${id} not found.`
            }
        }
    }

    return response;
}

const updateResponseById = async (id, updateContent) => {
    const updateCount = await Response.update(updateContent,
        {
            where: { id: id }
        });

    if (updateCount == 1) {
        return {
            result: {
                message: 'Response was updated successfully.',
            }
        }
    }

    return {
        error: {
            message: `Response with id=${id} not found!`,
        }
    }
}

const deleteResponseById = async (id) => {
    const deleteCount = await Response.destroy(
        {
            where: { id: id }
        });

    if (deleteCount == 1) {
        return {
            result: {
                message: 'Response was deleted successfully.',
            }
        }
    }

    return {
        error: {
            message: `Response with id=${id} not found!`,
        }
    }
}

const createUserResponse = async (responseData, userId, user) => {

    const answers = responseData.answers;

    if (user === "customer") {

        const responseContent = {
            survey_id: responseData.surveyId,
            customer_id: userId,
            response_date: responseData.responseDate
        }

        return createResponseAnswers(responseContent, answers);

    } else if (user === "attendant") {

        const responseContent = {
            survey_id: responseData.surveyId,
            attendant_id: userId,
            response_date: responseData.responseDate
        }

        return createResponseAnswers(responseContent, answers);
    }
}

const createResponseAnswers = async (responseContent, answers) => {

    const newResponse = await Response.create(responseContent);

    if (!newResponse) {
        return {
            error: {
                message: `Some error occurred while creating new response`
            }
        }
    }

    const responseId = newResponse.id

    for (var i = 0; i < answers.length; i++) {

        if (answers[i].option_id !== undefined) {

            var answerContent = {
                question_id: answers[i].question_id,
                response_id: responseId,
                option_id: answers[i].option_id
            }
            const newAnswer = await SurveyAnswer.create(answerContent);

            if (!newAnswer) {
                return {
                    error: {
                        message: `Some error occurred while storing answers`
                    }
                }
            }

        } else {

            var answerContent = {
                question_id: answers[i].question_id,
                response_id: responseId,
                answer: answers[i].answer
            }
            const newAnswer = await SurveyAnswer.create(answerContent);

            if (!newAnswer) {
                return {
                    error: {
                        message: `Some error occurred while storing answers`
                    }
                }
            }

        }
    }

    return {
        result: {
            message: "Answers and response were created successfully."
        }
    }
}

module.exports = {
    createNewResponse,
    getAllResponses,
    getResponse,
    updateResponseById,
    deleteResponseById,
    createUserResponse
};