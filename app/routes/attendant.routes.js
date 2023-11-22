const attendantCtrl = require('../controllers/attendant.controller');
const { verifyToken } = require('../middlewares/verify.middleware');
const{ isAdminAttendant, isAdmin, isAttendant, verifyUserForReset } = require('../middlewares/user.middleware');
const upload = require('../config/multer.config');
var router = require('express').Router();

const setAttendantRoutes = (app) => {

    router.post('/', attendantCtrl.createAttendant);

    router.post('/login', attendantCtrl.attendantLogin);

    router.post('/forgotpassword', attendantCtrl.attendantForgotPassword);

    router.post('/resetpassword', [verifyToken, verifyUserForReset], attendantCtrl.resetAttendantPassword);

    const multipleUploads = upload.uploadDocuments.fields([{name:'adhaarCard', maxCount:1}, {name:'panCard', maxCount:1}, {name:'profilePhoto', maxCount:1}]);
    router.post('/uploads', [verifyToken, isAttendant], multipleUploads, attendantCtrl.uploadAttendantDocument);

    router.get('/', [verifyToken, isAdmin], attendantCtrl.findAllAttendants);

    router.get('/:attendantId', [verifyToken, isAdminAttendant], attendantCtrl.findAttendantById)

    router.put('/:attendantId', [verifyToken, isAdminAttendant], attendantCtrl.updateAttendant);

    router.delete('/:attendantId', [verifyToken, isAdminAttendant], attendantCtrl.deleteAttendant);

    app.use('/api/attendant', router);
}

module.exports = setAttendantRoutes;