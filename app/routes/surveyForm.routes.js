const surveyFormCtrl = require('../controllers/surveyForm.controller');
const { verifyToken } = require('../middlewares/verify.middleware');
const{ isAdmin, isValidUser } = require('../middlewares/user.middleware');
var router = require('express').Router();

const setSurveyFormRoutes = (app) =>{

    router.post('/', [verifyToken, isAdmin], surveyFormCtrl.createSurveyForm);

    router.post('/form', [verifyToken, isAdmin], surveyFormCtrl.sendSurveyForm);

    router.get('/', [verifyToken, isAdmin], surveyFormCtrl.findAllSurveyForms);

    router.get('/:id/questions', [verifyToken, isValidUser], surveyFormCtrl.displayAllSurveyQuestions);

    router.get('/:id', [verifyToken, isAdmin], surveyFormCtrl.findSurveyForm);

    router.put('/:id', [verifyToken, isAdmin], surveyFormCtrl.updateSurveyForm);

    router.delete('/:id', [verifyToken, isAdmin], surveyFormCtrl.deleteSurveyForm);

    app.use('/api/surveyform', router);
}

module.exports = setSurveyFormRoutes;