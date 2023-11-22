const questionTypeCtrl = require('../controllers/questionType.controller');
const { verifyToken } = require('../middlewares/verify.middleware');
const{ isAdmin } = require('../middlewares/user.middleware');
var router = require('express').Router();

const setQuestionTypeRoutes = (app) =>{

    router.post('/', [verifyToken, isAdmin], questionTypeCtrl.createQuestionType);

    router.get('/', [verifyToken, isAdmin], questionTypeCtrl.findAllQuestionTypes);

    router.get('/:id', [verifyToken, isAdmin], questionTypeCtrl.findQuestionType);

    router.put('/:id', [verifyToken, isAdmin], questionTypeCtrl.updateQuestionType);

    router.delete('/:id', [verifyToken, isAdmin], questionTypeCtrl.deleteQuestionType);

    app.use('/api/questiontype', router);
}

module.exports = setQuestionTypeRoutes;