const responseModel = (sequelizeDb, Sequelize) => {

    const Response = sequelizeDb.define('Response', {

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        survey_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'SurveyForms',
                key: 'id'
            }
        },

        customer_id: {
            type: Sequelize.UUID,
            references: {
                model: 'Customers',
                key: 'id'
            }
        },

        attendant_id: {
            type: Sequelize.UUID,
            references: {
                model: 'Attendants',
                key: 'id'
            }
        },

        response_date: {
            type: Sequelize.DATEONLY,
        },
    },
        {
            timestamps: false
        });

    Response.associate = (models) => {
        Response.belongsTo(models.surveyForm, { foreignKey: 'survey_id' });
        Response.belongsTo(models.customer, { foreignKey: 'customer_id' });
        Response.belongsTo(models.attendant, { foreignKey: 'attendant_id' });
        Response.hasMany(models.surveyAnswer, { foreignKey: 'response_id' });
    }

    return Response;
};

module.exports = responseModel;