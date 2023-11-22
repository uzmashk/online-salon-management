const optionModel = (sequelizeDb, Sequelize) => {

    const Option = sequelizeDb.define('Option', {

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        option: {
            type: Sequelize.STRING,
        },

        question_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Questions',
                key: 'id'
            }
        },
    },
        {
            timestamps: false
        });

    Option.associate = (models) => {
        Option.belongsTo(models.questions, {foreignKey: 'question_id'});
        Option.hasOne(models.surveyAnswer, {foreignKey: 'option_id'});
    }

    return Option;
};

module.exports = optionModel;