const db = require('../models');
const Appointment = db.appointment;
const ServiceType = db.serviceCharges;
const ServiceItem = db.serviceItems;
const Op = db.Sequelize.Op;

const checkEmptyTimeSlots = async (appointments, startTimeAppointment, endTimeAppointment) => {

    appointments = JSON.stringify(appointments)
    appointments = JSON.parse(appointments)

    const availableTimeSlots = [];

    appointments.forEach(element => {

        if (startTimeAppointment >= element.startTime) {

            availableTimeSlots.push({
                startTime: element.startTime,
                endTime: element.endTime,
            })

        } else if (endTimeAppointment >= element.startTime) {

            availableTimeSlots.push({
                startTime: element.startTime,
                endTime: element.endTime,
            })
        }
    })

    var count = 0;

    availableTimeSlots.forEach(element => {

        if (startTimeAppointment === element.startTime) {

            if (endTimeAppointment === element.endTime) {
                return count = count + 1;

            } else if (endTimeAppointment < element.endTime) {
                return count = count + 1;

            } else if (endTimeAppointment > element.endTime) {
                return count = count + 1;
            }

        } else if (startTimeAppointment > element.startTime) {

            if (startTimeAppointment === element.endTime) {
                return count;

            } else if (startTimeAppointment < element.endTime) {
                return count = count + 1;

            } else if (startTimeAppointment > element.endTime) {
                return count
            }

        } else if (startTimeAppointment < element.startTime) {

            if (endTimeAppointment === element.endTime) {
                return count = count + 1;

            } else if (endTimeAppointment < element.endTime) {
                return count = count + 1;

            } else if (endTimeAppointment > element.endTime) {
                return count = count + 1;
            }
        }
    })

    if (count < 2) {
        return true;

    } else {
        return false;

    }
};

const addNewAppointment = async (appointmentData) => {
    const serviceItems = appointmentData.services;

    if (serviceItems.length === 0) {
        return {
            error: {
                message: 'services cannot be empty.'
            }
        }
    }

    var totalDuration = 0;
    var totalAmount = 0;
    var serviceType = await ServiceType.findAll()
    if (serviceType.length === 0) {
        return {
            error: {
                message: `No serviceTypes found.`
            }
        }
    } else {

        serviceType = JSON.stringify(serviceType)
        serviceType = JSON.parse(serviceType)

        serviceItems.forEach(serviceId => {
            serviceType.forEach(value => {
                if (serviceId === value.id) {
                    totalDuration = totalDuration + value.duration;

                    if (totalDuration < 60) {
                        return {
                            error: {
                                message: "Appointment for services less than 1 hour not accepted."
                            }
                        }
                    } else {
                        if (value.discountedCost !== null) {
                            totalAmount = totalAmount + value.discountedCost

                        } else {
                            totalAmount = totalAmount + value.cost
                        }
                    }
                }
            })
        })

        var startDate = appointmentData.dateOfAppointment;
        var startTime = appointmentData.startTime;
        var breakStart = '13:00';
        var breakDuration = 120;
        var duration = totalDuration;

        let appointmentStartTime = new Date(Date.parse(startDate + "T" + startTime + ":00.000Z"));
        var startTimeAppointment = appointmentStartTime.toISOString().split("T")[1].split(".")[0]

        var appointmentEndTime = appointmentStartTime.setMinutes(appointmentStartTime.getMinutes() + duration);
        appointmentEndTime = new Date(appointmentEndTime)
        var endTimeAppointment = appointmentEndTime.toISOString().split("T")[1].split(".")[0]

        let breakStartTime = new Date(Date.parse(startDate + "T" + breakStart + ":00.000Z"));
        var startTimeBreak = breakStartTime.toISOString().split("T")[1].split(".")[0]

        var breakEndTime = breakStartTime.setMinutes(breakStartTime.getMinutes() + breakDuration);
        breakEndTime = new Date(breakEndTime)
        var endTimeBreak = breakEndTime.toISOString().split("T")[1].split(".")[0]

        if (startTimeAppointment > startTimeBreak && startTimeAppointment < endTimeBreak) {
            return {
                error: {
                    message: 'Appointment starts during the break time. Please choose other time slot'
                }
            }

        } else if (endTimeAppointment > startTimeBreak && endTimeAppointment < endTimeBreak) {
            return {
                error: {
                    message: 'Appointment ends during the break time. Please choose other time slot'
                }
            }
        } else {

            const bookAppointment = {
                customerId: appointmentData.customerId,
                attendantId: appointmentData.attendantId,
                dateOfAppointment: appointmentData.dateOfAppointment,
                startTime: startTimeAppointment,
                endTime: endTimeAppointment,
                totalDuration: totalDuration,
                totalAmount: totalAmount,
                statusId: 1,
            }
            const findAppointments = await Appointment.findAll({
                where: {
                    dateOfAppointment: appointmentData.dateOfAppointment
                }
            })

            if (findAppointments.length === 0) {
                const appointment = await Appointment.create(bookAppointment);

                var appointmentId = appointment.id;

                for (var index = 0; index < serviceItems.length; index++) {

                    await ServiceItem.create({
                        appointmentId: appointmentId,
                        serviceId: serviceItems[index]
                    })
                }

                return appointment;
            }

            const isTimeSlotAvailable = await checkEmptyTimeSlots(findAppointments, startTimeAppointment, endTimeAppointment);

            if (!isTimeSlotAvailable) {
                return {
                    error: {
                        message: `Time slot for ${startTimeAppointment} to ${endTimeAppointment} is not available.`
                    }
                }
            }
            const appointment = await Appointment.create(bookAppointment)

            var appointmentId = appointment.id;

            for (var index = 0; index < serviceItems.length; index++) {

                await ServiceItem.create({
                    appointmentId: appointmentId,
                    serviceId: serviceItems[index]
                })
            }

            return appointment;
        }

    }
}


const getAllAppointment = async () => {
    const findAppointments = await Appointment.findAll()

    if (findAppointments.length === 0) {

        return {
            error: {
                message: 'No appointments found.'
            }
        }
    }

    return findAppointments
}

const getAppointmentById = async (id) => {
    const findAppointment = await Appointment.findByPk(id)

    if (!findAppointment) {
        return {
            error: {
                message: `Appointment with id ${id} not found.`
            }
        }
    }

    return findAppointment;
}

const updateAppointmentById = async (id, updateContent) => {
    const updateCount = await Appointment.update(updateContent, { where: { id: id } });

    if (updateCount == 1) {
        return {
            result: {
                message: 'Appointment was updated successfully.',
            }
        }
    }

    return {
        error: {
            message: `Appointment with id=${id} not found!`,
        }
    }
}

const deleteAppointmentById = async (id) => {
    const deleteCount = await Appointment.destroy({ where: { id: id } });

    if (deleteCount == 1) {
        return {
            result: {
                message: 'Appointment was deleted successfully.',
            }
        }
    }

    return {
        error: {
            message: `Appointment with id=${id} not found!`,
        }
    }
}

const getAppointmentsByDay = async (day) => {
    const appointments = await Appointment.findAll(
        {
            where: { dateOfAppointment: day }
        })

    if (appointments.length === 0) {

        return {
            error: {
                message: `Appointment for day=${day} not found!`,
            }
        }
    }

    return appointments;
}

const getAppointmentsByMonth = async (month, year) => {
    var appointments = await Appointment.findAll()

    if (appointments.length === 0) {
        return {
            error: {
                message: `No appointments found!`,
            }
        }
    }

    appointments = JSON.stringify(appointments)
    appointments = JSON.parse(appointments)

    const allAppointments = [];

    appointments.forEach(value => {

        var splitDate = value.dateOfAppointment.split('-')

        if (splitDate[0] === year && splitDate[1] === month) {
            allAppointments.push(value);
        }
    });

    if (allAppointments.length === 0) {
        return {
            error: {
                message: `No appointments found for month ${month} and year ${year}`
            }
        }
    }

    return allAppointments;
}

const getAppointmentsByDateRange = async (startDate, endDate) => {

    const appointments = await Appointment.findAll({
        where: { dateOfAppointment: { [Op.between]: [startDate, endDate] } }
    })

    if (appointments.length === 0) {

        return {
            error: {
                message: `Appointments for days from ${startDate} to ${endDate} not found!`,
            }
        }
    }

    return appointments;
}

const getAppointmentsByStatus = async (id) => {
    const appointments = await Appointment.findAll(
        {
            where: { statusId: id }
        })

    if (appointments.length === 0) {

        return {
            error: {
                message: `Appointment not found!`,
            }
        }
    }

    return appointments;

}

module.exports = {
    addNewAppointment,
    getAllAppointment,
    getAppointmentById,
    updateAppointmentById,
    deleteAppointmentById,
    getAppointmentsByDay,
    getAppointmentsByMonth,
    getAppointmentsByDateRange,
    getAppointmentsByStatus
};