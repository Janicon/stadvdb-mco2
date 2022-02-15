const express = require('express');
const mainController = require('../controllers/mainController.js');
const movieController = require('../controllers/movieController.js');
const testController = require('../controllers/testController.js');

const app = express();

app.get('/favicon.ico', mainController.getFavicon);
app.get('/', mainController.getIndex);
app.get('/movie/:id', movieController.getMovie);

app.get('/test', testController.getUsers, testController.load);
app.get('/test/addUser', testController.addUser);

module.exports = app;