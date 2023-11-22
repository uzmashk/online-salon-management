const surveyAnswerCtrl = require('../controllers/surveyAnswer.controller');
const { verifyToken } = require('../middlewares/verify.middleware');
const{ isAdmin } = require('../middlewares/user.middleware');
var router = require('express').Router();

const setSurveyAnswerRoutes = (app) =>{

    router.post('/', [verifyToken, isAdmin], surveyAnswerCtrl.createSurveyAnswer);

    router.get('/', [verifyToken, isAdmin], surveyAnswerCtrl.findAllSurveyAnswers);

    router.get('/:id', [verifyToken, isAdmin], surveyAnswerCtrl.findSurveyAnswer);

    router.put('/:id', [verifyToken, isAdmin], surveyAnswerCtrl.updateSurveyAnswer);

    router.delete('/:id', [verifyToken, isAdmin], surveyAnswerCtrl.deleteSurveyAnswer);

    app.use('/api/surveyanswer', router);
}

module.exports = setSurveyAnswerRoutes;