const adminModel = (sequelizeDb, Sequelize) => {

    const Admin = sequelizeDb.define('Admin', {

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

        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "Email is already registered."
            }
        },

        password: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    },

    {
        timestamps: false
    });
    
    return Admin;
};

module.exports = adminModel;