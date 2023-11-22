const surveyAnswer = require('../services/surveyAnswer.service');
const status = require('http-status')

const createSurveyAnswer = (req, res) => {
    const surveyAnswerData = {
        question_id: req.body.questionId,
        response_id: req.body.responseId,
        answer: req.body.answer
    }

    surveyAnswer.createNewSurveyAnswer(surveyAnswerData)
        .then(result => {

            res.status(status.CREATED).send(result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while creating survey answer."
            })
        })
}

const findAllSurveyAnswers = (req, res) => {
    surveyAnswer.getAllSurveyAnswers()
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while finding survey answers."
            })
        })
}

const findSurveyAnswer = (req, res) => {
    const id = req.params.id;

    surveyAnswer.getSurveyAnswer(id)
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })

        .catch(err => {
            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || `Error finding survery answer with id = ${id}`,
            })
        })
}

const updateSurveyAnswer = (req, res) => {
    const id = req.params.id;

    const updateContent = {};

    if (req.body.id) {
        updateContent.id = req.body.id.trim();
    }
    if (req.body.questionId) {
        updateContent.question_id = req.body.questionId;
    }
    if (req.body.responseId) {
        updateContent.response_id = req.body.responseId;
    }
    if (req.body.answer) {
        updateContent.answer = req.body.answer;
    }

    surveyAnswer.updatesurveyAnswerById(id, updateContent)
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result.result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || `Error updating survey answer with id = ${id}`,
            })
        })
}

const deleteSurveyAnswer = (req, res) => {
    const id = req.params.id;

    surveyAnswer.deleteSurveyAnswerById(id)
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result.result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || `Error deleting survey answer with id = ${id}`,
            })
        })
}


module.exports = {
    createSurveyAnswer,
    findAllSurveyAnswers,
    findSurveyAnswer,
    updateSurveyAnswer,
    deleteSurveyAnswer
};