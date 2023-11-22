const statusCtrl = require('../controllers/status.controller');
const { verifyToken } = require('../middlewares/verify.middleware');
const{ isAdmin } = require('../middlewares/user.middleware')
var router = require('express').Router();

const setStatusRoutes = (app) =>{

    router.post('/', [verifyToken, isAdmin], statusCtrl.createStatus);

    router.get('/', [verifyToken, isAdmin], statusCtrl.findAllStatuses);

    router.get('/:id', [verifyToken, isAdmin], statusCtrl.findStatus);

    router.put('/:id', [verifyToken, isAdmin], statusCtrl.updateStatus);

    router.delete('/:id', [verifyToken, isAdmin], statusCtrl.deleteStatus);

    app.use('/api/status', router);
}

module.exports = setStatusRoutes;