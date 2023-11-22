const serviceChargesCtrl = require('../controllers/serviceCharges.controller.js')
//const { verifyToken } = require('../middlewares/verify.middleware');
//const{ isAdmin, isAdminAttendantCustomer } = require('../middlewares/user.middleware')
var router = require('express').Router();

const setServiceRoutes = (app) =>{

    router.post('/', serviceChargesCtrl.addService);

    router.get('/', serviceChargesCtrl.findServiceTypeByFilter);

    router.get('/:serviceTypeId', serviceChargesCtrl.findServiceById);

    router.put('/:serviceTypeId',  serviceChargesCtrl.updateService);

    router.delete('/:serviceTypeId', serviceChargesCtrl.serviceDelete);

    // router.post('/', [verifyToken, isAdmin], serviceChargesCtrl.addService);

    // router.get('/', [verifyToken, isAdminAttendantCustomer], serviceChargesCtrl.findServiceTypeByFilter);

    // router.get('/:serviceTypeId', [verifyToken, isAdminAttendantCustomer], serviceChargesCtrl.findServiceById);

    // router.put('/:serviceTypeId', [verifyToken, isAdmin], serviceChargesCtrl.updateService);

    // router.delete('/:serviceTypeId', [verifyToken, isAdmin], serviceChargesCtrl.serviceDelete);

    app.use('/api/serviceType', router);
}

module.exports = setServiceRoutes;