const surveyFormModel = (sequelizeDb, Sequelize) => {

    const SurveyForms = sequelizeDb.define('SurveyForm', {

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        survey_form_name: {
            type: Sequelize.STRING,
        },

        description: {
            type: Sequelize.STRING,
        },

        status: {
            type: Sequelize.ENUM,
            values: ['draft', 'archieved', 'published'],
            validate: {
                isIn: {
                  args: [['draft', 'archieved', 'published']],
                    msg: "status be draft, archieved or published."
                }
              }
        },

        published_date: {
            type: Sequelize.STRING,
        }
    },
        {
            timestamps: false
        });

        SurveyForms.associate = (models) => {
            SurveyForms.hasMany(models.questions, {foreignKey: 'survey_id'});
            SurveyForms.hasMany(models.response, {foreignKey: 'survey_id'});
        }

    return SurveyForms;
};

module.exports = surveyFormModel;