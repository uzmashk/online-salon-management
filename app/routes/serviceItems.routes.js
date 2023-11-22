const serviceItemsCtrl = require('../controllers/serviceItems.controller');
const { verifyToken } = require('../middlewares/verify.middleware');
const{ isAdmin, isAdminAttendantCustomer } = require('../middlewares/user.middleware')
var router = require('express').Router();

const setServiceItemsRoutes = (app) =>{

    router.post('/', serviceItemsCtrl.createServiceItem);

    router.get('/', [verifyToken, isAdmin], serviceItemsCtrl.findAllServiceItems);

    router.get('/:id', [verifyToken, isAdminAttendantCustomer], serviceItemsCtrl.findServiceItem);

    router.put('/:id', [verifyToken, isAdmin], serviceItemsCtrl.updateServiceItem);

    router.delete('/:id', [verifyToken, isAdmin], serviceItemsCtrl.deleteServiceItem);

    app.use('/api/serviceItems', router);
}

module.exports = setServiceItemsRoutes;