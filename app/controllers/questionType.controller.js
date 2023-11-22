const questionTypeService = require('../services/questionType.service');
const { schemaForQuestionType, idSchema } = require('../schemas/questionType.schema')
const status = require('http-status');

const createQuestionType = (req, res) => {
    const { error } = schemaForQuestionType.validate(req.body);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        const questionTypeData = {
            type_name: req.body.typeName.trim()
        }

        questionTypeService.createNewQuestionType(questionTypeData)
            .then(result => {

                res.status(status.CREATED).send(result)
            })
            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while creating Question type."
                })
            })
    }
}

const findAllQuestionTypes = (req, res) => {

    questionTypeService.getAllQuestionTypes()
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while finding Question types."
            })
        })
}

const findQuestionType = (req, res) => {
    const id = req.params.id.trim();

    const { error } = idSchema.validate(req.params.id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        questionTypeService.getQuestionType(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result)
            })

            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error finding question type with id = ${id}`,
                })
            })
    }
}

const updateQuestionType = (req, res) => {
    const id = req.params.id.trim();

    const { error } = idSchema.validate(req.params.id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        const { error } = schemaForQuestionType.validate(req.body);

        if (error) {
            res.status(status.BAD_REQUEST).send({
                message: error.message
            });

        } else {
            const updateContent = {};

            if (req.body.typeName) {
                updateContent.type_name = req.body.typeName.trim();
            }

            questionTypeService.updateQuestionTypeById(id, updateContent)
                .then(result => {

                    if (result.error) {
                        return res.status(status.NOT_FOUND).send(result.error)
                    }

                    res.status(status.OK).send(result.result)
                })
                .catch(err => {

                    res.status(status.INTERNAL_SERVER_ERROR).send({
                        message: err.message || `Error updating question type with id = ${id}`,
                    })
                })
        }
    }
}

const deleteQuestionType = (req, res) => {
    const id = req.params.id.trim();

    const { error } = idSchema.validate(req.params.id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        questionTypeService.deleteQuestionTypeById(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result.result)
            })
            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error deleting question type with id = ${id}`,
                })
            })
    }
}


module.exports = {
    createQuestionType,
    findAllQuestionTypes,
    findQuestionType,
    updateQuestionType,
    deleteQuestionType
};