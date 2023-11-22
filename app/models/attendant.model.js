const attendantModel = (sequelizeDb, Sequelize) => {
    const Attendant = sequelizeDb.define('Attendant', {

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

        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            unique: {
                args: true,
                msg: "Email is already registered."
            }
        },

        adhaarNumber: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "Adhaar number is registered."
            }
        },

        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        isSystemGeneratedPassword:{
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },

        adhaar_card: {
            type: Sequelize.STRING
        },

        pan_card: {
            type: Sequelize.STRING
        },

        profile_picture: {
            type: Sequelize.STRING
        }
    },

    {
        timestamps: false
    });

    Attendant.associate = (models) =>{
        Attendant.hasMany(models.appointment, {foreignKey: 'attendantId'});
        Attendant.hasMany(models.response, {foreignKey: 'attendant_id'});
    }
    
    return Attendant;
};

module.exports = attendantModel;