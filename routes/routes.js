const express = require('express');
const mainController = require('../controllers/mainController.js');
const movieController = require('../controllers/movieController.js');
const testController = require('../controllers/testController.js');

const app = express();

app.get('/favicon.ico', mainController.getFavicon);
app.get('/', mainController.getBlank);
app.get('/movie/:id', movieController.getMovie);
app.post('/addMovie', movieController.addMovie);
app.post('/movie/:id/edit', movieController.editMovie);
app.get('/movie/:id/delete', movieController.deleteMovie);

app.get('/test', testController.getUsers);
app.get('/test/:id', testController.getUser);

module.exports = app;