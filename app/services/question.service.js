const db = require('../models');
const Question = db.questions;
const Option = db.options;

const createNewQuestion = async (questionData) => {
    const newQuestion = await Question.create(questionData);
    return newQuestion;
}

const getAllQuestions = async () => {
    const questions = await Question.findAll()

    if (questions.length === 0) {
        return {
            error: {
                message: 'No questions found.'
            }
        }
    }

    return questions;
}

const getQuestion = async (id) => {
    const question = await Question.findByPk(id)

    if (!question) {
        return {
            error: {
                message: `Question with id ${id} not found.`
            }
        }
    }

    return question;
}

const updateQuestionById = async (id, updateContent) => {
    const updateCount = await Question.update(updateContent,
        {
            where: { id: id }
        });

    if (updateCount == 1) {
        return {
            result: {
                message: 'Question was updated successfully.',
            }
        }
    }

    return {
        error: {
            message: `Question with id=${id} not found!`,
        }
    }
}

const deleteQuestionById = async (id) => {
    const deleteCount = await Question.destroy(
        {
            where: { id: id }
        });

    if (deleteCount == 1) {
        return {
            result: {
                message: 'Question was deleted successfully.',
            }
        }
    }

    return {
        error: {
            message: `Question with id=${id} not found!`,
        }
    }
}

const createNewSurveyQuestion = async (questionData) => {
    const questions = questionData.questions;
    const survey_id = questionData.surveyId;

    if (questions === undefined) {
        return {
            error: {
                message: "questions field is undefined."
            }
        }
    } else if (questions.length === undefined) {
        return {
            error: {
                message: "questions should be an array and not object."
            }
        }
    } else if (questions.length === 0) {
        return {
            error: {
                message: "questions field is empty."
            }
        }
    }

    for (var i = 0; i < questions.length; i++) {

        if (questions[i].options !== undefined) {

            var questionContent = {
                question_type_id: questions[i].questionTypeId,
                question: questions[i].question,
                survey_id: survey_id,
                is_required: questions[i].isRequired,
            }

            const newQuestion = await Question.create(questionContent);

            if (!newQuestion) {
                return {
                    error: {
                        message: `Some error occurred while creating new question`
                    }
                }
            } else {

                var questionId = newQuestion.dataValues.id;

                const options = questions[i].options;

                for (var j = 0; j < options.length; j++) {

                    var optionContent = {
                        option: options[j],
                        question_id: questionId,
                    }

                    const newOption = await Option.create(optionContent);

                    if (!newOption) {
                        return {
                            error: {
                                message: `Some error occurred while creating options.`
                            }
                        }
                    }
                }
            }

        } else {

            if (questions[i].questionTypeId === 3 || questions[i].questionTypeId === 4) {

                return {
                    error: {
                        message: `Please provide options for the question "${questions[i].question}"`
                    }
                }

            } else {

                var questionContent = {
                    question_type_id: questions[i].questionTypeId,
                    question: questions[i].question,
                    survey_id: survey_id,
                    is_required: questions[i].isRequired,
                }

                const newQuestion = await Question.create(questionContent);

                console.log("This is the answer provided", newQuestion)

                if (!newQuestion) {
                    return {
                        error: {
                            message: `Some error occurred while creating new question`
                        }
                    }
                }
            }
        }
    }
    return {
        result: {
            message: "Questions were created successfully."
        }
    }
}

const getAllSurveyQuestions = async () => {
    const surveyQuestions = [];

    var questions = await Question.findAll();

    if (questions.length === 0) {
        return {
            error: {
                message: 'No questions found.'
            }
        }
    }

    questions = JSON.stringify(questions)
    questions = JSON.parse(questions)

    var options = await Option.findAll();
    options = JSON.stringify(options)
    options = JSON.parse(options)

    questions.forEach(element => {

        var surveyOptions = [];

        options.forEach(value => {
            if (element.id === value.question_id) {

                surveyOptions.push(value)
            }
        })

        if (surveyOptions.length > 0) {

            var questionContent = {
                id: element.id,
                question_type_id: element.question_type_id,
                question: element.question,
                survey_id: element.survey_id,
                is_required: element.is_required,
                options: surveyOptions
            }

            surveyQuestions.push(questionContent);

        }
        else {
            var questionContent = {
                id: element.id,
                question_type_id: element.question_type_id,
                question: element.question,
                survey_id: element.survey_id,
                is_required: element.is_required
            }

            surveyQuestions.push(questionContent);

        }
    });

    return surveyQuestions;
}

const getSurveyQuestionsById = async (surveyId) => {
    const surveyQuestions = [];

    var questions = await Question.findAll({
        where: {
            survey_id: surveyId
        }
    });

    if (questions.length === 0) {
        return {
            error: {
                message: 'No questions found.'
            }
        }
    }

    questions = JSON.stringify(questions)
    questions = JSON.parse(questions)

    var options = await Option.findAll();
    options = JSON.stringify(options)
    options = JSON.parse(options)

    questions.forEach(element => {

        var surveyOptions = [];

        options.forEach(value => {
            if (element.id === value.question_id) {

                surveyOptions.push(value)
            }
        })

        if (surveyOptions.length > 0) {

            var questionContent = {
                id: element.id,
                question_type_id: element.question_type_id,
                question: element.question,
                survey_id: element.survey_id,
                is_required: element.is_required,
                options: surveyOptions
            }

            surveyQuestions.push(questionContent);

        }
        else {
            var questionContent = {
                id: element.id,
                question_type_id: element.question_type_id,
                question: element.question,
                survey_id: element.survey_id,
                is_required: element.is_required
            }

            surveyQuestions.push(questionContent);

        }
    });

    return surveyQuestions;
}

module.exports = {
    createNewQuestion,
    getAllQuestions,
    getQuestion,
    updateQuestionById,
    deleteQuestionById,
    createNewSurveyQuestion,
    getAllSurveyQuestions,
    getSurveyQuestionsById
};