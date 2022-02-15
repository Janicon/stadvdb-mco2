const express = require('express');
const mainController = require('../controllers/mainController.js');
const movieController = require('../controllers/movieController.js');
const testController = require('../controllers/testController.js');

const app = express();

app.get('/favicon.ico', mainController.getFavicon);
app.get('/', mainController.getIndex);
app.get('/movie/:id', movieController.getMovie);

app.get('/test', testController.getUsers);
app.get('/test/:id', testController.getUser);
app.get('/test/addUser', testController.addUser);
/*
app.get('/test/findCount', testController.findCount);
app.get('/test/testTransaction', testController.testTransaction);
app.get('/users', testController.loadPage);
*/

module.exports = app;