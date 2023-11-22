const surveyFormService = require('../services/surveyForm.service');
const { schemaForSurveryForm, idSchema } = require('../schemas/surveryForm.schema')
const status = require('http-status')

const createSurveyForm = (req, res) => {
    const { error } = schemaForSurveryForm.validate(req.body);

    if (error) {

        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        const surveyFormData = {
            survey_form_name: req.body.surveyFormName.trim(),
            description: req.body.description.trim(),
            status: req.body.status,
            published_date: req.body.publishedDate
        }

        surveyFormService.createNewSurveyForm(surveyFormData)
            .then(result => {

                res.status(status.CREATED).send(result)
            })
            .catch(err => {
                console.log(err)
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while creating survey form."
                })
            })
    }
}

const findAllSurveyForms = (req, res) => {

    surveyFormService.getAllSurveyForms()
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while finding survey forms."
            })
        })
}

const findSurveyForm = (req, res) => {
    const id = req.params.id;

    const { error } = idSchema.validate(req.params.id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        surveyFormService.getSurveyForm(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result)
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error finding survey form with id = ${id}`,
                })
            })
    }
}

const updateSurveyForm = (req, res) => {
    const id = req.params.id;

    const { error } = idSchema.validate(req.params.id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        const { error } = schemaForSurveryForm.validate(req.body);

        if (error) {
            res.status(status.BAD_REQUEST).send({
                message: error.message
            });

        } else {

            const updateContent = {};

            if (req.body.surveyFormName) {
                updateContent.survey_form_name = req.body.surveyFormName.trim();
            }
            if (req.body.status) {
                updateContent.status = req.body.status.trim();
            }
            if (req.body.publishedDate) {
                updateContent.published_date = req.body.publishedDate;
            }


            surveyFormService.updateSurveyFormById(id, updateContent)
                .then(result => {

                    if (result.error) {
                        return res.status(status.NOT_FOUND).send(result.error)
                    }

                    res.status(status.OK).send(result.result)
                })
                .catch(err => {

                    res.status(status.INTERNAL_SERVER_ERROR).send({
                        message: err.message || `Error updating survey form with id = ${id}`,
                    })
                })
        }
    }
}

const deleteSurveyForm = (req, res) => {
    const id = req.params.id;

    const { error } = idSchema.validate(req.params.id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        surveyFormService.deleteSurveyFormById(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result.result)
            })
            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error deleting survey form with id = ${id}`,
                })
            })
    }
}

const sendSurveyForm = (req, res) => {

    const sendFormData = {
        surveyId: req.body.surveyId,
        user: req.body.user
    }
    
    surveyFormService.sendForm(sendFormData)
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error);
            }

            res.status(status.OK).send(result.result);

        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || `Error while sending survey form.`,
            })
        })
}

const displayAllSurveyQuestions = (req, res) => {

    const surveyId = req.params.id;

    surveyFormService.getSurveyQuestions(surveyId)
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

module.exports = {
    createSurveyForm,
    findAllSurveyForms,
    findSurveyForm,
    updateSurveyForm,
    deleteSurveyForm,
    sendSurveyForm,
    displayAllSurveyQuestions
};