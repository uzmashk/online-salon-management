const surveyAnswerModel = (sequelizeDb, Sequelize) => {

    const surveyAnswer = sequelizeDb.define('SurveyAnswer', {

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        question_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Questions',
                key: 'id'
            }
        },

        response_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Responses',
                key: 'id'
            }
        },

        answer: {
            type: Sequelize.STRING,
        },

        option_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Options',
                key: 'id'
            }
        },
    },
        {
            timestamps: false
        });

    surveyAnswer.associate = (models) => {
        surveyAnswer.belongsTo(models.questions, {foreignKey: 'question_id'});
        surveyAnswer.belongsTo(models.options, {foreignKey: 'option_id'});
        surveyAnswer.belongsTo(models.response, {foreignKey: 'response_id'});
    }

    return surveyAnswer;
};

module.exports = surveyAnswerModel;