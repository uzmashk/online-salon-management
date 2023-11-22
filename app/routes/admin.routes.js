const adminCtrl = require('../controllers/admin.controller');
const { verifyToken } = require('../middlewares/verify.middleware');
const{ isAdmin } = require('../middlewares/user.middleware')
var router = require('express').Router();

const setCustomerRoutes = (app) => {

    router.post('/', adminCtrl.createAdmin);

    router.post('/login', adminCtrl.adminLogin)

    router.get('/', [verifyToken, isAdmin], adminCtrl.findAllAdmins);

    router.get('/:adminId', [verifyToken, isAdmin], adminCtrl.findAdminById)

    router.put('/:adminId', [verifyToken, isAdmin], adminCtrl.updateAdmin);

    router.delete('/:adminId', [verifyToken, isAdmin], adminCtrl.deleteAdmin);

    app.use('/api/admin', router);
}

module.exports = setCustomerRoutes;