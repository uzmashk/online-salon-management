const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;

var corsOptions = {
  origin: "http://localhost:8080"
}

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelizeDb.sync({force: true}).then(() => {
  console.log("Drop and re-sync db.");
});

const appRoutes = require('./app/routes/app.routes');

appRoutes(app);

app.listen(port, () => {
  console.log(`Server started at port ${port}`)
});