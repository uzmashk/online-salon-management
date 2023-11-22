const responseCtrl = require('../controllers/response.controller');
const { verifyToken } = require('../middlewares/verify.middleware');
const{ isAdmin, isValidUser } = require('../middlewares/user.middleware');
var router = require('express').Router();

const setResponseRoutes = (app) =>{

    router.post('/', [verifyToken, isAdmin], responseCtrl.createResponse);

    router.post('/answers', [verifyToken, isValidUser], responseCtrl.userResponse);

    router.get('/', [verifyToken, isAdmin], responseCtrl.findAllResponses);

    router.get('/:id', [verifyToken, isAdmin], responseCtrl.findResponse);

    router.put('/:id', [verifyToken, isAdmin], responseCtrl.updateResponse);

    router.delete('/:id', [verifyToken, isAdmin], responseCtrl.deleteResponse);

    app.use('/api/response', router);
}

module.exports = setResponseRoutes;