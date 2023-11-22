const serviceChargeRoutes = require('./serviceCharges.routes');

const customerRoutes = require('./customer.routes');

const attendantRoutes = require('./attendant.routes');

const appointmentRoutes = require('./appointment.routes');

const serviceItemsRoutes = require('./serviceItems.routes');

const statusRoutes = require('./status.routes');

const adminRoutes = require('./admin.routes');

const questionTypeRoutes = require('./questionType.routes');

const surveyFormRoutes = require('./surveyForm.routes');

const questionRoutes = require('./question.routes');

const optionRoutes = require('./option.routes');

const responseRoutes = require('./response.routes');

const surveyAnswerRoutes = require('./surveyAnswer.routes');

const status = require('http-status');
const setSurveyAnswerRoutes = require('./surveyAnswer.routes');

const pageNotFound = (req, res) => {
  res.status(status.NOT_FOUND).send({
    message: "Page not found"
  });
}

const setRoutes = (app) => {

  app.get('/', (req, res) => {
    res.send('Welcome to online salon app.')
  });

  serviceChargeRoutes(app);

  customerRoutes(app);

  attendantRoutes(app);

  appointmentRoutes(app);

  serviceItemsRoutes(app);

  statusRoutes(app);

  adminRoutes(app);

  questionTypeRoutes(app);

  surveyFormRoutes(app);

  questionRoutes(app);

  optionRoutes(app);

  responseRoutes(app);

  surveyAnswerRoutes(app)

  app.get('*', (req, res) => {
    pageNotFound(req, res);
  });

  app.post('*', (req, res) => {
    pageNotFound(req, res);
  });

  app.put('*', (req, res) => {
    pageNotFound(req, res);;
  });

  app.delete('*', (req, res) => {
    pageNotFound(req, res);
  });
}

module.exports = setRoutes;
