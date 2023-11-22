const serviceItemsModel = (sequelizeDb, Sequelize) => {
    
    const ServiceItem = sequelizeDb.define('ServiceItem', {

        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },

        appointmentId: {
            type: Sequelize.UUID,
            references:{
                model: 'Appointments',
                key: 'id'
            }
        },

        serviceId: {
            type: Sequelize.INTEGER,
            references:{
                model: 'ServiceTypes',
                key: 'id'
            }
        },
    },

    {
        timestamps: false
    });

    ServiceItem.associate = (models) =>{
        ServiceItem.belongsTo(models.appointment, {foreignKey: 'appointmentId'});
        ServiceItem.belongsTo(models.serviceCharges, {foreignKey: 'serviceId'});
    }
    
    return ServiceItem;
};

module.exports = serviceItemsModel;