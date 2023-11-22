const statusModel = (sequelizeDb, Sequelize) => {

    const Status = sequelizeDb.define('Status', {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      statusName: {
        type: Sequelize.STRING,
      },
    },

    {
        timestamps: false
    });

    Status.associate = (models) =>{
      Status.hasMany(models.appointment, {foreignKey: 'statusId'});
    }
    
    return Status;
  };
  
  module.exports = statusModel;