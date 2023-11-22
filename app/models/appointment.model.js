const appointmentModel = (sequelizeDb, Sequelize) =>{

    const Appointment = sequelizeDb.define('Appointment', {

        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },

        customerId:{
            type: Sequelize.UUID,
            references:{
                model: 'Customers',
                key: 'id'
            }
        },

        attendantId:{
            type: Sequelize.UUID,
            references:{
                model: 'Attendants',
                key: 'id'
            }
        },

        dateOfAppointment:{
            type: Sequelize.DATEONLY,
        },

        startTime:{
            type: Sequelize.TIME,
        },

        endTime:{
            type: Sequelize.TIME,
        },

        totalDuration:{
            type:Sequelize.INTEGER,
        },

        totalAmount:{
            type: Sequelize.INTEGER,
        },

        statusId:{
            type: Sequelize.INTEGER,
            references:{
                model: 'Statuses',
                key: 'id'
            }
        }
    },

    {
        timestamps: false
    });

    Appointment.associate = (models) =>{
        Appointment.belongsTo(models.customer, {foreignKey: 'customerId'});
        Appointment.belongsTo(models.attendant, {foreignKey: 'attendantId'});
        Appointment.hasMany(models.serviceItems, {foreignKey: 'appointmentId'});
        Appointment.belongsTo(models.status, {foreignKey: 'statusId'});
    }
    
    return Appointment;
}

module.exports = appointmentModel;