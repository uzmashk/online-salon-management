const customerCtrl = require('../controllers/customer.controller');
const { verifyToken } = require('../middlewares/verify.middleware');
const{ isAdminCustomer, isAdmin, isCustomer, verifyUserForReset } = require('../middlewares/user.middleware');
const upload = require('../config/multer.config');
var router = require('express').Router();

const setCustomerRoutes = (app) => {

    router.post('/', customerCtrl.createCustomer);

    router.post('/login', customerCtrl.customerLogin);

    router.post('/forgotpassword', customerCtrl.customerForgotPassword);

    router.post('/resetpassword', [verifyToken, verifyUserForReset], customerCtrl.resetCustomerPassword);

    router.post('/upload/profile_picture', [verifyToken, isCustomer], upload.uploadDocuments.single('images'), customerCtrl.uploadCustomerPhoto)

    router.post('/upload/document', [verifyToken, isCustomer], upload.uploadDocuments.single('images'), customerCtrl.uploadCustomerDocument)

    router.get('/addressprooftype', customerCtrl.findAllAddressProofType);

    router.get('/', [verifyToken, isAdmin], customerCtrl.findAllCustomers);

    router.get('/:customerId', [verifyToken, isAdminCustomer], customerCtrl.findCustomerById);

    router.put('/delete/profile_picture', [verifyToken, isCustomer], customerCtrl.deleteCustomerPhoto);

    router.put('/:customerId', [verifyToken, isAdminCustomer], customerCtrl.updateCustomer);

    router.delete('/:customerId', [verifyToken, isAdminCustomer], customerCtrl.deleteCustomer);

    app.use('/api/customer', router);
}

module.exports = setCustomerRoutes;