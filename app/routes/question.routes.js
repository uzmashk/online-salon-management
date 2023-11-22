const questionCtrl = require('../controllers/question.controller');
const { verifyToken } = require('../middlewares/verify.middleware');
const{ isAdmin } = require('../middlewares/user.middleware');
var router = require('express').Router();

const setQuestionRoutes = (app) =>{

    router.post('/', [verifyToken, isAdmin], questionCtrl.createQuestion);

    router.post('/surveyquestions', [verifyToken, isAdmin], questionCtrl.createSurveyQuestions);

    router.get('/', [verifyToken, isAdmin], questionCtrl.findAllQuestions);

    router.get('/surveyquestions', [verifyToken, isAdmin], questionCtrl.findSurveyQuestions);

    router.get('/:id', [verifyToken, isAdmin], questionCtrl.findQuestion);

    router.put('/:id', [verifyToken, isAdmin], questionCtrl.updateQuestion);

    router.delete('/:id', [verifyToken, isAdmin], questionCtrl.deleteQuestion);

    app.use('/api/question', router);
}

module.exports = setQuestionRoutes;