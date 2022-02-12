const express = require('express');
const controller = require('../controllers/controller.js');

const app = express();

app.get('/favicon.ico', controller.getFavicon);
app.get('/', controller.getIndex);

module.exports = app;