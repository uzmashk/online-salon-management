const optionService = require('../services/option.service');
const { schemaForOption, idSchema } = require('../schemas/option.schema')
const status = require('http-status')

const createOption = (req, res) => {
    const { error } = schemaForOption.validate(req.body);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        const optionData = {
            option: req.body.option,
            question_id: req.body.questionId,
        }

        optionService.createNewOption(optionData)
            .then(result => {

                res.status(status.CREATED).send(result)
            })
            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || "Some error occured while creating option."
                })
            })
    }
}

const findAllOptions = (req, res) => {
    optionService.getAllOptions()
        .then(result => {

            if (result.error) {
                return res.status(status.NOT_FOUND).send(result.error)
            }

            res.status(status.OK).send(result)
        })
        .catch(err => {

            res.status(status.INTERNAL_SERVER_ERROR).send({
                message: err.message || "Some error occured while finding options."
            })
        })
}

const findOption = (req, res) => {
    const id = req.params.id;

    const { error } = idSchema.validate(req.params.id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {

        optionService.getOption(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result)
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error finding Option with id = ${id}`,
                })
            })
    }
}

const updateOption = (req, res) => {
    const id = req.params.id.trim();

    const { error } = idSchema.validate(req.params.id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        const { error } = schemaForOption.validate(req.body);

        if (error) {
            res.status(status.BAD_REQUEST).send({
                message: error.message
            });

        } else {
            const updateContent = {};

            if (req.body.option) {
                updateContent.option = req.body.option.trim();
            }
            if (req.body.questionId) {
                updateContent.question_id = req.body.questionId.trim();
            }

            optionService.updateOptionById(id, updateContent)
                .then(result => {

                    if (result.error) {
                        return res.status(status.NOT_FOUND).send(result.error)
                    }

                    res.status(status.OK).send(result.result)
                })
                .catch(err => {

                    res.status(status.INTERNAL_SERVER_ERROR).send({
                        message: err.message || `Error updating option with id = ${id}`,
                    })
                })
        }
    }
}

const deleteOption = (req, res) => {
    const id = req.params.id.trim();

    const { error } = idSchema.validate(req.params.id);

    if (error) {
        res.status(status.BAD_REQUEST).send({
            message: error.message
        });

    } else {
        optionService.deleteOptionById(id)
            .then(result => {

                if (result.error) {
                    return res.status(status.NOT_FOUND).send(result.error)
                }

                res.status(status.OK).send(result.result)
            })
            .catch(err => {

                res.status(status.INTERNAL_SERVER_ERROR).send({
                    message: err.message || `Error deleting option with id = ${id}`,
                })
            })
    }
}


module.exports = {
    createOption,
    findAllOptions,
    findOption,
    updateOption,
    deleteOption
};