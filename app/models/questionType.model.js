const questionTypeModel = (sequelizeDb, Sequelize) => {

    const QuestionType = sequelizeDb.define('QuestionType', {

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        type_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
    },
        {
            timestamps: false
        });

        QuestionType.associate = (models) =>{
            QuestionType.hasMany(models.questions, {foreignKey: 'question_type_id'});
        }

    return QuestionType;
};

module.exports = questionTypeModel;