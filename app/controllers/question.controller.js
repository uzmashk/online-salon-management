const questionService = require('../services/question.service');
const { schemaForQuestion, idSchema } = require('../schemas/question.schema')
const status = require('http-status')

const createQuestion = (req, res) => {

    const { error } = schemaForQuestion.validate(req.body);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        const questionData = {
            question_type_id: req.body.questionTypeId,
            question: req.body.question,
            survey_id: req.body.surveyId,
            is_required: req.body.isRequired
        }

        questionService.createNewQuestion(questionData)
            .then(result => {

                res.status(status.CREATED).send(result)
            })
            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while creating Question."
                })
            })
    }
}

const findAllQuestions = (req, res) => {

    questionService.getAllQuestions()
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while finding Questions."
            })
        })
}

const findQuestion = (req, res) => {
    const id = req.params.id;

    const { error } = idSchema.validate(req.params.id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        questionService.getQuestion(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result)
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error finding question with id = ${id}`,
                })
            })
    }
}

const updateQuestion = (req, res) => {
    const id = req.params.id;

    const { error } = idSchema.validate(req.params.isRequired);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        const { error } = schemaForQuestion.validate(req.body);

        if (error) {
            res.status(status.BAD_REQUEST).send({
                message: error.message
            });

        } else {

            const updateContent = {};

            if (req.body.questionTypeId) {
                updateContent.question_type_id = req.body.questionTypeId.trim();
            }
            if (req.body.question) {
                updateContent.question = req.body.question.trim();
            }
            if (req.body.surveyId) {
                updateContent.survey_id = req.body.surveyId.trim();
            }
            if (req.body.isRequired) {
                updateContent.is_required = req.body.isRequired.trim();
            }

            questionService.updateQuestionById(id, updateContent)
                .then(result => {

                    if (result.error) {
                        return res.status(status.NOT_FOUND).send(result.error)
                    }

                    res.status(status.OK).send(result.result)
                })
                .catch(err => {

                    res.status(status.INTERNAL_SERVER_ERROR).send({
                        message: err.message || `Error updating question with id = ${id}`,
                    })
                })
        }
    }
}

const deleteQuestion = (req, res) => {
    const id = req.params.id;

    const { error } = idSchema.validate(req.param.id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        questionService.deleteQuestionById(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result.result)
            })
            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error deleting question with id = ${id}`,
                })
            })
    }
}

const createSurveyQuestions = (req, res) => {

    const questionData = {
        surveyId: req.body.surveyId,
        questions: req.body.questions
    }

    questionService.createNewSurveyQuestion(questionData)
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.CREATED).send(result.result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while creating survery Question."
            })
        })
}

const findAllSurveyQuestions = (req, res) => {

    questionService.getAllSurveyQuestions()
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while finding Survey Questions."
            })
        })
}

const findSurveyQuestionsById = (surveyId, res) => {

    questionService.getSurveyQuestionsById(surveyId)
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while finding Survey Questions."
            })
        })
}

const findSurveyQuestions = (req, res) => {

    if (req.query.survey_id) {
        const surveyId = req.query.survey_id.trim();

        findSurveyQuestionsById(surveyId, res)

    } else {
        findAllSurveyQuestions(req, res);
    }
}

module.exports = {
    createQuestion,
    findAllQuestions,
    findQuestion,
    updateQuestion,
    deleteQuestion,
    createSurveyQuestions,
    findSurveyQuestions
};