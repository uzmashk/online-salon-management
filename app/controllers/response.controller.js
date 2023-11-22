const responseService = require('../services/response.service');
const { schemaForResponse, updateResponseSchema, idSchema } = require('../schemas/response.schema');
const status = require('http-status');

const createResponse = (req, res) => {
    const { error } = schemaForResponse.validate(req.body);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        const responseData = {
            survey_id: req.body.surveyId,
            customer_id: req.body.customerId,
            response_date: req.body.responseDate.trim()
        }

        responseService.createNewResponse(responseData)
            .then(result => {

                res.status(status.CREATED).send(result)
            })
            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while creating response."
                })
            })
    }
}

const findAllResponses = (req, res) => {
    responseService.getAllResponses()
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while finding responses."
            })
        })
}

const findResponse = (req, res) => {
    const id = req.params.id.trim();

    const { error } = idSchema.validate(req.params.id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        responseService.getResponse(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result)
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error finding Response with id = ${id}`,
                })
            })
    }
}

const updateResponse = (req, res) => {
    const id = req.params.id.trim();

    const { error } = idSchema.validate(req.params.id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        const { error } = updateResponseSchema.validate(req.body);

        if (error) {
            res.status(status.BAD_REQUEST).send({
                message: error.message
            });

        } else {

            const updateContent = {};

            if (req.body.surveyId) {
                updateContent.survey_id = req.body.surveyId;
            }
            if (req.body.customerId) {
                updateContent.customer_id = req.body.customerId;
            }
            if (req.body.responseDate) {
                updateContent.response_date = req.body.responseDate.trim();
            }

            responseService.updateResponseById(id, updateContent)
                .then(result => {

                    if (result.error) {
                        return res.status(status.NOT_FOUND).send(result.error)
                    }

                    res.status(status.OK).send(result.result)
                })
                .catch(err => {

                    res.status(status.INTERNAL_SERVER_ERROR).send({
                        message: err.message || `Error updating response with id = ${id}`,
                    })
                })
        }
    }
}

const deleteResponse = (req, res) => {
    const id = req.params.id.trim();

    const { error } = idSchema.validate(req.params.id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        responseService.deleteResponseById(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result.result)
            })
            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error deleting response with id = ${id}`,
                })
            })
    }
}

const userResponse = (req, res) => {

    const currentDate = new Date().toISOString().slice(0, 10);

    const responseData = {
        surveyId: req.body.surveyId,
        answers: req.body.answers,
        responseDate: currentDate,
    }

    const userId = req.id;

    const user = req.role;

    responseService.createUserResponse(responseData, userId, user)
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error);
            }

            res.status(status.OK).send(result.result);
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while creating response."
            })
        })
}

module.exports = {
    createResponse,
    findAllResponses,
    findResponse,
    updateResponse,
    deleteResponse,
    userResponse
};