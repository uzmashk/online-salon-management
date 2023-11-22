const optionCtrl = require('../controllers/option.controller');
const { verifyToken } = require('../middlewares/verify.middleware');
const{ isAdmin } = require('../middlewares/user.middleware');
var router = require('express').Router();

const setOptionRoutes = (app) =>{

    router.post('/', [verifyToken, isAdmin], optionCtrl.createOption);

    router.get('/', [verifyToken, isAdmin], optionCtrl.findAllOptions);

    router.get('/:id', [verifyToken, isAdmin], optionCtrl.findOption);

    router.put('/:id', [verifyToken, isAdmin], optionCtrl.updateOption);

    router.delete('/:id', [verifyToken, isAdmin], optionCtrl.deleteOption);

    app.use('/api/option', router);
}

module.exports = setOptionRoutes;