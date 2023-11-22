const serviceTypeModel = (sequelizeDb, Sequelize) => {

  const ServiceType = sequelizeDb.define('ServiceType', {

    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: Sequelize.STRING,
    },

    cost: {
      type: Sequelize.INTEGER,
    },

    discountedCost: {
      type: Sequelize.INTEGER,
    },

    duration: {
      type: Sequelize.INTEGER,
    },

    category: {
      type: Sequelize.ENUM,
      values: ['individual', 'combo'],
      validate: {
        isIn: {
          args: [['individual', 'combo']],
          msg: "category should be individual or combo."
        }
      }
    }
  },

    {
      timestamps: false
    });

  ServiceType.associate = (models) => {
    ServiceType.hasMany(models.serviceItems, { foreignKey: 'serviceId' })
  }

  return ServiceType;
};

module.exports = serviceTypeModel;