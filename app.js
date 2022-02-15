'use strict';

const express = require('express');
require("dotenv").config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/api', authRoute);
app.use('/api/posts', postRoute);

let port = process.env.PORT;

console.log("Waiting for DB Connection")

const startApp = () => {
  app.listen(port, () => console.log(`Server is up and running on ${port}`));
};

module.exports = app;
