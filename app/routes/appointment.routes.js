const appointmentCtrl = require('../controllers/appointment.controller');
const { verifyToken } = require('../middlewares/verify.middleware');
const{ isAdmin, isAdminAttendantCustomer, isCustomer } = require('../middlewares/user.middleware')
var router = require('express').Router();

const setAppointmentRoutes = (app) =>{

    router.post('/', [verifyToken, isCustomer], appointmentCtrl.addAppointment);
    
    router.get('/', [verifyToken, isAdmin], appointmentCtrl.findAppointmentByFilter);

    router.get('/:statusId', [verifyToken, isAdmin], appointmentCtrl.findAppointmentByStatus)

    router.get('/:appointmentId', [verifyToken, isAdminAttendantCustomer], appointmentCtrl.findAppointmentById)

    router.put('/:appointmentId', [verifyToken, isAdmin], appointmentCtrl.updateAppointment);

    router.delete('/:appointmentId', [verifyToken, isAdmin], appointmentCtrl.deleteAppointment);
    
    app.use('/api/appointments', router)
}

module.exports = setAppointmentRoutes;