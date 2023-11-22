const questionModel = (sequelizeDb, Sequelize) => {

    const Question = sequelizeDb.define('Question', {

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        question_type_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'QuestionTypes',
                key: 'id'
            }
        },
        
        question: {
            type: Sequelize.STRING,
        },

        survey_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'SurveyForms',
                key: 'id'
            }
        },

        is_required: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
    },
        {
            timestamps: false
        });

        Question.associate = (models) =>{
            Question.hasMany(models.options, {foreignKey: 'question_id'});
            Question.belongsTo(models.questionType, {foreignKey: 'question_type_id'});
            Question.belongsTo(models.surveyForm, {foreignKey: 'survey_id'});
            Question.hasMany(models.surveyAnswer, {foreignKey: 'question_id'});
        }

    return Question;
};

module.exports = questionModel;