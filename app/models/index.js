const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");

const sequelizeDb = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {

  host: dbConfig.HOST,
  port: 5534,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;

db.sequelizeDb = sequelizeDb;

db.serviceCharges = require('./serviceCharges.model')(sequelizeDb, Sequelize);

db.customer = require('./customer.model')(sequelizeDb, Sequelize);

db.attendant = require('./attendant.model')(sequelizeDb, Sequelize);

db.admin = require('./admin.model')(sequelizeDb, Sequelize);

db.status = require('./status.model')(sequelizeDb, Sequelize);

db.appointment = require('./appointment.model')(sequelizeDb, Sequelize);

db.serviceItems = require('./serviceItems.model')(sequelizeDb, Sequelize);

db.questionType = require('./questionType.model')(sequelizeDb, Sequelize);

db.surveyForm = require('./surveyForm.model')(sequelizeDb, Sequelize);

db.questions = require('./questions.model')(sequelizeDb, Sequelize);

db.options = require('./options.model')(sequelizeDb, Sequelize);

db.response = require('./response.model')(sequelizeDb, Sequelize);

db.surveyAnswer = require('./surveyAnswer.model')(sequelizeDb, Sequelize);

Object.keys(db).forEach((modelName) => {

  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db; 