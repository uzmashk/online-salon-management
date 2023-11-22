const customerModel = (sequelizeDb, Sequelize) => {
    const Customer = sequelizeDb.define('Customer', {

        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },

        firstname: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        lastname: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        mobile: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "Mobile number is already registered."
            }
        },

        instagramUsername: {
            type: Sequelize.STRING,
        },

        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "Email is already taken."
            }
        },

        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        isSystemGeneratedPassword: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },

        addressProofType: {
            type: Sequelize.ENUM,
            values: ['passport', 'electionCard', 'drivingLicense'],
            validate: {
                isIn: {
                  args: [['passport', 'electionCard', 'drivingLicense']],
                    msg: "addressProofType should be passport, electitonCard or drivingLicense."
                }
              }
        },

        addressProofType_doc: {
            type: Sequelize.STRING
        },

        photo: {
            type: Sequelize.STRING
        }
    },
        {
            timestamps: false
        });

    Customer.associate = (models) => {
        Customer.hasMany(models.appointment, {foreignKey: 'customerId'});
        Customer.hasMany(models.response, {foreignKey: 'customer_id'});
    }

    return Customer;
};

module.exports = customerModel;