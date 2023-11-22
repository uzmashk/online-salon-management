const account = require('../src/account');
const db = require('../models');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const SurveyForm = db.surveyForm;
const Customer = db.customer;
const Attendant = db.attendant;
const Question = db.questions;
const Option = db.options;

const createNewSurveyForm = async (surveyFormData) => {
    const newSurveyForm = await SurveyForm.create(surveyFormData);
    return newSurveyForm;
}

const getAllSurveyForms = async () => {

    const surveyForms = await SurveyForm.findAll()

    if (surveyForms.length === 0) {
        return {
            error: {
                message: 'No survey forms found.'
            }
        }
    }

    return surveyForms;

}

const getSurveyForm = async (id) => {

    const surveyForm = await SurveyForm.findByPk(id)

    if (!surveyForm) {
        return {
            error: {
                message: `Survey form with id ${id} not found.`
            }
        }
    }

    return surveyForm;

}

const updateSurveyFormById = async (id, updateContent) => {

    const updateCount = await SurveyForm.update(updateContent,
        {
            where: { id: id }
        });

    if (updateCount == 1) {
        return {
            result: {
                message: 'Survey form was updated successfully.',
            }
        }
    }

    return {
        error: {
            message: `Survey form with id=${id} not found!`,
        }
    }

}

const deleteSurveyFormById = async (id) => {

    const deleteCount = await SurveyForm.destroy(
        {
            where: { id: id }
        });

    if (deleteCount == 1) {
        return {
            result: {
                message: 'Survey form was deleted successfully.',
            }
        }
    }

    return {
        error: {
            message: `Survey form with id=${id} not found!`,
        }
    }
}

const sendForm = async (sendFormData) => {
    const id = sendFormData.surveyId;
    const user = sendFormData.user;

    const link = process.env.LINK;

    const surveyForm = await SurveyForm.findByPk(id)

    if (!surveyForm) {
        return {
            error: {
                message: `Survey form with id=${id} not found!`,
            }
        }
    }

    if (user === "customer") {
        return sendFormCustomer(link, id);

    } else if (user === "attendant") {
        return sendFormAttendant(link, id);

    } else {

        const customer = await sendFormCustomer(link, id);
        const attendant = await sendFormAttendant(link, id);

        if (customer.error) {
            return customer;

        } else if (attendant.error) {
            return attendant;
        }

        return {
            result: {
                message: "Feedback form sent successfully to customer and attendant.",
            }
        }
    }
}

const sendFormCustomer = async (link, surveyId) => {

    var customers = await Customer.findAll();

    if (customers.length === 0) {
        return {
            error: {
                message: 'No customer found.'
            }
        }
    }

    customers = JSON.stringify(customers);
    customers = JSON.parse(customers);


    for(var index = 0; index < customers.length; index++){

        const tokenData = {
            id: customers[index].id,
            role: "customer"
        }
    
        const token = await generatetoken(tokenData);

        const emailLink = await tokenLink(token, surveyId, link);

        account.sendFeedBackEmail(customers[index], emailLink);
    }

    return {
        result: {
            message: `Feedback forms successfully sent to customers.`
        }
    }
}

const sendFormAttendant = async (link, surveyId) => {

    var attendants = await Attendant.findAll();

    if (attendants.length === 0) {
        return {
            error: {
                message: 'No attendant found.'
            }
        }
    }

    attendants = JSON.stringify(attendants);
    attendants = JSON.parse(attendants);

    for(var index = 0; index < attendants.length; index++){

        const tokenData = {
            id: attendants[index].id,
            role: "attendant"
        }
    
        const token = await generatetoken(tokenData);

        const emailLink = await tokenLink(token, surveyId, link);

        account.sendFeedBackEmail(attendants[index], emailLink);
    }

    return {
        result: {
            message: `Feedback forms successfully sent to attendants.`
        }
    }
}

const generatetoken = async(tokenData) =>{
    const token = jwt.sign(tokenData, authConfig.secret, { expiresIn: 86400 });

    return token;
}

const tokenLink = async(token, surveyId, link) =>{

    const replaceSurveyId = link.replace(":id", surveyId);

    const splitLink = replaceSurveyId.split("=");

    const linkEmail = `${splitLink[0]}=${token}`

    return linkEmail ;
}

const getSurveyQuestions = async (surveyId) =>{

    const surveyQuestions = [];

    var surveyForm = await SurveyForm.findByPk(surveyId);

    if (!surveyForm) {
        return {
            error: {
                message: `Survey form with id ${surveyId} not found.`
            }
        }
    }

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

    const surveyFormData = {
        header: {
            survey_form_name: surveyForm.survey_form_name,
            description: surveyForm.description
        },
        questions: surveyQuestions
    }

    return surveyFormData;

}

module.exports = {
    createNewSurveyForm,
    getAllSurveyForms,
    getSurveyForm,
    updateSurveyFormById,
    deleteSurveyFormById,
    sendForm,
    getSurveyQuestions
};